const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');


const app = express();
app.use(cors());

/*
[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]

let weathers = [];
		for (const day of json['daily']['data']) {
			const date = new Date(day.time * 1000);
			weathers.push({
				'forecast': day.summary,
				'time': date.toString().slice(0, 15),
			});
		}
*/

class Weather {
	constructor(json) {
		this.forecast = json.summary;
		this.day = new Date(json.time * 1000).toString().slice(0,15);
	}
}



console.log('Hello?');

class Location {

	constructor(query, json) {
		this.search_query = query;
		this.formatted_query = json.results[0].formatted_address;
		this.latitude = json.results[0].geometry.location.lat;
		this.longitude = json.results[0].geometry.location.lng;
	}
}

// const geoData = require('./data/geo.json');
// const weatherData = require('./data/darksky.json');

app.get('/location', (req, res) => {
	try {
		let SQL = 'SELECT * FROM locations WHERE seach_query=$1';
		let VALUES = [req.query.data];

		client.query(SQL, VALUES).then(res => {
			if(res.rows.length = 0){
superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODEAPI_KEY}`)
			.then((geoData) => {
					const location = new Location(req.query.location, geoData.body);
					SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4)'
					VALUES = Object.values(location);
					client.query(SQL, VALUES);
					res.send(location);
				});
			}
		})

		
				// const location = new Location(req.query.location, geoData);
				
			}
		catch (error) {
			res.status(500).send({
				status: 500,
				responseText: error.message

			});
		}
});

app.get('/weather', (req, res) => {
	try {
		console.log(req.query.data);
		superagent.get(`https://api.darksky.net/forecast/${process.env.DARKSKYAPI_KEY}/${req.query.data.latitude},${req.query.data.longitude}`)
			.then((weatherData) => {

				console.log(weatherData);
				const weather = new Weather(req.query.weather, weatherData.body);

				console.log(weatherData.body.daily.data);
				let weather = weatherData.body.daily.data.map((day) => {
					return new Weather(day);
				})
				res.send(weather)
			});
		}
		catch (error) {
		res.status(500).send({
			status: 500,
			responseText: error.message

		});
	}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('Server has started...');
});