import './index.css';

const getWeather = async (city, unit) => {
  toggleLoader();

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&include=days&key=K36KRFL32SVNC6M3KR8A2EUBC&contentType=json`;

  const response = await fetch(url);
  const json = await response.json();

  try {
    return {
      city: json['resolvedAddress'],
      days: json['days'].slice(0, 6),
      unit: unit,
    };
  } catch (err) {
    console.error(err);
  }
};

const getIconUrl = (icon) => {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${icon}.png`;
};

const toggleLoader = () => {
  const loader = document.querySelector('#loader');
  if (loader.classList.contains('loader')) {
    loader.classList.remove('loader');
  } else {
    loader.classList.add('loader');
  }
};

const displayWeather = (data) => {
  const city = document.querySelector('#w-city');
  const iconImg = document.querySelector('#w-icon');
  const temp = document.querySelector('#w-temp');
  const conditions = document.querySelector('#w-conditions');
  const tempDay = document.querySelector('#w-temp-day');
  const tempNight = document.querySelector('#w-temp-night');
  const nextDates = Array.from(document.querySelectorAll('.w-next-date'));
  const nextIconImgs = Array.from(document.querySelectorAll('.w-next-icon'));
  const nextDayTmps = Array.from(document.querySelectorAll('.w-next-day'));
  const nextNightTmps = Array.from(document.querySelectorAll('.w-next-night'));
  const unitLetter = data['unit'] === 'us' ? 'F' : 'C';

  city.textContent = data['city'];
  iconImg.src = getIconUrl(data['days'][0]['icon']);
  temp.textContent = `${data['days'][0]['temp']}°${unitLetter}`;
  conditions.textContent = data['days'][0]['conditions'];
  tempDay.textContent = `Day: ${data['days'][0]['tempmax']}°${unitLetter}`;
  tempNight.textContent = `Night: ${data['days'][0]['tempmin']}°${unitLetter}`;

  for (let i = 1; i <= 5; i++) {
    nextDates[i - 1].textContent = data['days'][i]['datetime'].slice(5);
    nextIconImgs[i - 1].src = getIconUrl(data['days'][i]['icon']);
    nextDayTmps[i - 1].textContent =
      `${data['days'][i]['tempmax']}°${unitLetter}`;
    nextNightTmps[i - 1].textContent =
      `${data['days'][i]['tempmin']}°${unitLetter}`;
  }

  toggleLoader();
};

let city = 'tashkent';
let unit = 'metric';

getWeather(city, unit).then((response) => {
  displayWeather(response);
});

const search = document.querySelector('#search-field');
const searchBtn = document.querySelector('#search-btn');
const unitSwitchBtn = document.querySelector('#unit-switch-btn');

searchBtn.addEventListener('click', () => {
  if (search.value.length > 0) {
    city = search.value;
    getWeather(city, unit).then((response) => {
      displayWeather(response);
    });
  }
});

unitSwitchBtn.addEventListener('click', () => {
  unit = unit === 'metric' ? 'us' : 'metric';
  getWeather(city, unit).then((response) => {
    displayWeather(response);
  });
});
