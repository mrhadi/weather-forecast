const apiKey = 'd24a847176de474270d62510ead19156'; // TODO: This should be removed, user can enter it on first run
const units = 'metric';
const maxDays = 5;
const dataPerDay = 8;
const countLines = maxDays * dataPerDay;

module.exports = {
  apiKey,
  units,
  maxDays,
  dataPerDay,
  countLines
};
