const express = require('express')
var request = require('request-promise')
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
var cookieSession = require('cookie-session')
var navigator = require('navigator')
const passport = require('passport')
const unirest = require("unirest")
var s = require('./views/script')
const { response } = require('express')
var NodeGeocoder = require('node-geocoder');
const p = require('./config/passport')

var app = express()
app.use(bodyparser.urlencoded({ extended: false }))
app.set('view engine','ejs')


app.use(cookieSession({
    name: 'weather-session',
    keys: ['key1', 'key2']
  }))
   

app.use(express.json());

app.use(function(req,res,next){     //to add currentUser to every route
	res.locals.currentUser=req.user;
	next();
});

//Initializes passport authentication process
app.use(passport.initialize());
//instruct to use session
app.use(passport.session());


mongoose.connect('mongodb+srv://tanay_r:[password]@cluster0-subqu.mongodb.net/<dbname>?retryWrites=true&w=majority',{ useNewUrlParser: true })

var userSchema = new mongoose.Schema({
    date:{
      type: Date,
      default: Date.now
    },
    city:String,
    Temperature:{
      type:Number
    },
    description:String,
    account:String


});

var User = mongoose.model('User', userSchema);

app.get('/',(req,res)=>{

    res.render("login")

})



app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));



app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/profile',
        failureRedirect: '/login'
}));

app.get('/profile', (req, res) =>{
    res.render("profile")
})

app.get('/history',(req,res)=>{
  User.find({account:req.user},(err,user)=>{
    if(!err)
    {
      res.json(user)
    }
    else{
      throw err;
    }
  })
})

app.get('/guest',(req,res)=>{
  res.render('guest')
})

app.post('/guestTemp',(req,res)=>{
  let options = {
    provider: 'openstreetmap'
  };
  console.log(res.body)
  let geoCoder = NodeGeocoder(options);
  // Reverse Geocode
    geoCoder.reverse({lat:req.body.latitude, lon:req.body.longitude})
    .then((response1)=> {
      console.log(response1[0].city);
      var url = `https://api.openweathermap.org/data/2.5/weather?q=${response1[0].city}&units=imperial&appid=e450f34cb2b983137d637e6cf43bab7d`
      request(url,function(error,response,body){
          weather_json = JSON.parse(body)
          // console.log(weather_json)
  
          var weather = {
              city:response1[0].city,
              description: weather_json.weather[0].description,
              temp:Math.round(weather_json.main.temp),
              icon: weather_json.weather[0].icon
          }
          var weather_data = {weather:weather}
          const user = {
            account:req.user,
            city:response1[0].city,
            description: weather_json.weather[0].description,
            temp:Math.round(weather_json.main.temp)
      
            
          }
          res.json(user)
        })
      })

})




app.post('/hello',async(req,res)=>{

  let options = {
    provider: 'openstreetmap'
  };
  console.log(res.body)
  let geoCoder = NodeGeocoder(options);
  // Reverse Geocode
    geoCoder.reverse({lat:req.body.latitude, lon:req.body.longitude})
    .then((response1)=> {
      console.log(response1[0].city);
      var url = `https://api.openweathermap.org/data/2.5/weather?q=${response1[0].city}&units=imperial&appid=e450f34cb2b983137d637e6cf43bab7d`
      request(url,function(error,response,body){
          weather_json = JSON.parse(body)
          // console.log(weather_json)
  
          var weather = {
              city:response1[0].city,
              description: weather_json.weather[0].description,
              temp:Math.round(weather_json.main.temp),
              icon: weather_json.weather[0].icon
          }
          var weather_data = {weather:weather}
          const user = new User({
            account:req.user,
            city:response1[0].city,
            description: weather_json.weather[0].description,
            temp:Math.round(weather_json.main.temp)
      
            
          })
          res.json(user)
          
          user
          .save()
          .then(user=>{
            console.log("SAVEDDD!!!!")
          })
          .catch(err=>console.log(err))
          
          
  
      })
    })
    .catch((err)=> {
      console.log(err);
    })
    
    

    

    
})





app.post('/weather',(req,res)=>{
   city = req.body.city
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=e450f34cb2b983137d637e6cf43bab7d`
    request(url,function(error,response,body){
        weather_json = JSON.parse(body)
        // console.log(weather_json)

        var weather = {
            city:req.body.city,
            description: weather_json.weather[0].description,
            temp:Math.round(weather_json.main.temp),
            icon: weather_json.weather[0].icon
        }

        var weather_data = {weather:weather}
        res.render('weather',weather_data)

    })

    
})

app.listen(3000,console.log(`server started at port 3000`))
