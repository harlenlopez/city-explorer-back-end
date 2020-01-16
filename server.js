'use strict'
//express library is my server
const express = require('express');
// const pg = require('pg');
//const client = new pg.client(process.env.DATABASE_URL);
//client.on('error', err => console.error(err));
const app = express();
//allows our server talk to the front end
const cors = require('cors');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT || 3001;

//define routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);

//LOCATION

function homeHandler(req, res) {
  res.status(200).send('Server is alive this is the home page');
}

function locationHandler(req, res) {
  // res.status(200).send('Server is alive this is the location page');
  //get the data
  const geoData = require('./data/geo.json');
  const city = req.query.city;
  console.log(req);
  //run the data through the constructor and push to new array
  const locationData = new Location(city, geoData);
  //send the new array back to the front end 
  res.status(200).json(locationData);

}
//constructor
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  console.log(this)

}



//WEATHER
function weatherHandler(req, res) {
  // res.status(200).send('Server is alive this is the weather page');
  try{
  const weatherData = require('./data/darksky.json');
  let weatherDataArray = [];
  let weatherArray = weatherData.daily.data;
  console.log('weather data',weatherArray);
  // console.log('we are in handler',weatherArray);
   weatherArray.forEach((obj) => {
    let day = new Weather(obj);
    weatherDataArray.push(day);
    // console.log('this is the day log',day);

  });

  console.log('this is the new array', weatherDataArray);
  res.send(weatherDataArray);
  // res.status(200).json(weatherDataArray);
  }
    catch (err) {
    console.log(err);
  }

}

//CONSTRUCTOR
function Weather(daily) {
  this.forecast = daily.summary;
  this.time = new Date(daily.time * 1000).toString().slice(0, 15);

}

//constructor function

// const Weather = function(city){
//   try{
//     const weatherdata = require('./data/darksky.json/daily/data')[0];

//     console.log(weatherdata);
//     //build the object
//     this.search_query = city;
//     this.formatted_query = weatherdata.summary;


//   } 
//   catch (err) {
//     console.log(error);
//   }
// }

// /* {
//   search_query: 'Lynwood'
//   formatted_query: etc etc...'
// }}
// */



// //routes

// app.get('/location', (req,res) => {
//   console.log('hi!');
//   const reqCity = req.query.city;
//   const responseObj = new Location(reqCity);
//   console.log("in route: ",responseObj);
//   res.status(200).send(responseObj);
// })



// app.get('/weather', (req,res) => {
//   console.log('weather working');




//   const reqCity = req.query.city;
//   const responseObj = new Weather(reqCity);
//   console.log("in transit", responseObj);
//   res.status(200).send(responseObj);
// })

// app.get('*',(req,res) => {
//   res.status(404).send('that route cannot be found');
// })
// //configure port
app.listen(PORT, () => { console.log(`Your server is listening on ${PORT}`) });

