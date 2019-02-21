const { version } = require('../package.json');
const { openWeatherAPI, maxDays, dataPerDay } = require('./openweathermap');
const chalk = require('chalk');
const cityList = require('../resources/city.list');
const inquirer = require('inquirer');
const jsSearch = require('js-search');
const ttyTable = require('tty-table');
const autoCompletePrompt= require('inquirer-autocomplete-prompt');
const log = console.log;

let forecastData = null;
let citySearch = null;

const appInit = () => {
  welcome();
  loadDatabase();
};

const welcome = () => {
  log(chalk`{green Weather Forecast} {greenBright v.${version}}`);
  log(chalk`{cyan App is using OpenWeatherMap API to present weather information.}`);
  log();
};

const loadDatabase = () => {
  log(chalk`{yellow Loading city database ...}`);
  citySearch = new jsSearch.Search('name');
  citySearch.addIndex('name');
  citySearch.addDocuments(cityList);
  log(chalk`{yellow Done}`);
};

const getCityName = () => {
  inquirer.registerPrompt('autocomplete', autoCompletePrompt);
  inquirer.prompt([{
    type: 'autocomplete',
    name: 'city',
    message: 'Please enter your city name:',
    source: async (answersSoFar, input = '') => citySearch.search(input).map(({ name }) => name)
  }]).then((answers) => {
    getCityForecast(answers.city);
  });
};

const getCityForecast = (city) => {
  log(chalk`{yellow Loading forecast data for ${city} ...}`);

  openWeatherAPI(city)
  .then((response) => {
    log(chalk`{yellow Done}`);
    forecastData = response.data.list;

    makeForecastTable();
    tryAgain();
  })
  .catch((error) => {
    log(error);
  })
};

const getForecast = (day) => {
  /*
    This function needs to be refactored.
    Currently just pick the first data for each day.
    There are 8 data lines for each day, every 3 hours.
  */

  const index = (day === 1) ? 0 : (day - 1) * dataPerDay;
  return forecastData[index];
};

const makeForecastTable = () => {
  const currentTemp = ['Now'];
  const minTemp = ['Min'];
  const maxTemp = ['Max'];
  const weather = ['Weather'];
  const windSpeed = ['Wind'];
  const header = [
    {
      align : "left",
      paddingLeft : 1,
      width : 10
    }
  ];

  for (let i = 1; i <= maxDays; i++) {
    const day = getForecast(i);
    const date = new Date(day.dt * 1000);

    header.push({
      value: date.toLocaleDateString('en-AU',{ weekday: 'long'})
    });

    currentTemp.push(day.main.temp);
    minTemp.push(day.main.temp_min);
    maxTemp.push(day.main.temp_max);
    weather.push(day.weather[0].main);
    windSpeed.push(day.wind.speed);
  }

  const rows = [currentTemp, minTemp, maxTemp, weather, windSpeed];

  const forecastTable = ttyTable(header, rows, {
    borderStyle : 1,
    borderColor : "blue",
    paddingBottom : 0,
    headerAlign : "center",
    align : "center",
    color : "white",
    truncate: "..."
  });

  log(forecastTable.render());
};

const tryAgain = () => {
  log();
  inquirer.prompt([{
    type: 'list',
    message: 'Would you like to check another city?',
    name: 'yesno',
    choices: ['Yes', 'No'],
  }]).then(answers => {
    if (answers.yesno === 'Yes') {
      getCityName();
    }
    else {
      log();
      log(chalk`{cyan Enjoy the rest of your day.}`);
    }
  });
};

module.exports = {
  appInit,
  getCityName
};
