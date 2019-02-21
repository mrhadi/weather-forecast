const axios = require('axios');
const baseURL = 'http://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'd24a847176de474270d62510ead19156';
const units = 'metric';
const maxDays = 5;
const dataPerDay = 8;
const countLines = maxDays * dataPerDay;

const openWeatherAPI = async (city) => {
  return axios.get(`${baseURL}?q=${city}&cnt=${countLines}&units=${units}&APPID=${apiKey}`);
};

module.exports = {
  maxDays,
  dataPerDay,
  openWeatherAPI
};
