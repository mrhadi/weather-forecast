const axios = require('axios');
const { stringify } = require('querystring');
const { apiKey, units, maxDays, dataPerDay } = require('./constants');

const baseURL = 'http://api.openweathermap.org/data/2.5/forecast';

const makeParams = city => stringify({
  q: city,
  cnt: maxDays * dataPerDay,
  units: units,
  APPID: apiKey
});

const openWeatherAPI = async city => axios.get(`${baseURL}?${makeParams(city)}`);

module.exports = {
  openWeatherAPI
};
