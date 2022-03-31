"use strict";

// INITIALIZE AND DECLARE DOM VARIABLES
const displayImage = document.querySelector("#weather-info img");
const displayDesc = document.querySelector("#weather-info p");
const displayHumid = document.querySelector(
  "#conditions-stats p:first-child span"
);
const displayWindSp = document.querySelector(
  "#conditions-stats p:nth-child(2) span"
);
const displayTemp = document.querySelector(
  "#conditions-stats p:last-child span"
);

// Export DOM elements (Imported in the "app.js" file)
export { displayImage, displayDesc, displayHumid, displayWindSp, displayTemp };

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getWeather(userLon, userLat) {
  // Fetch weather data API
  const weatherData = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=97773d5af5401e1b00aed3a63620b57e
    `
  );

  weatherData
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // INITIALIZE AND DECLARE DOM VARIABLES
      const weatherInfo = data.weather[0];
      const weatherImage = data.weather[0].icon;
      const weatherDesc = weatherInfo.description;
      const weatherHumidty = data.main.humidity;
      const weatherWindSpd = data.wind.speed;
      const weatherDeg = data.wind.deg;
      const calDegree = Math.trunc((weatherDeg - 32) * (5 / 9));

      displayImage.src = ` http://openweathermap.org/img/wn/${weatherImage}@2x.png`;
      displayDesc.textContent = weatherDesc;
      displayHumid.textContent = weatherHumidty;
      displayWindSp.textContent = weatherWindSpd;
      displayTemp.textContent = calDegree;

      console.log(data);

      return weatherDesc;
    })
    .then((description) => {
      // MAKE WEATHER DESCRIPTION CAPITALIZED
      // Example: scattered clouds => Output: Scattered Clouds
      const splitDesc = description.split(" ");
      const capDesc = splitDesc.map((x) => x[0].toUpperCase() + x.slice(1));
      const officialDesc = capDesc.join(" ");
      displayDesc.textContent = officialDesc;
    })
    .catch((error) => {
      console.log(error);
    });
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get user longitude and altitude
const success = function (granted) {
  const longitude = granted.coords.longitude;
  const latitude = granted.coords.latitude;
  getWeather(longitude, latitude);
  return longitude, latitude;
};

const fail = function (denied) {
  console.log(denied);
};

navigator.geolocation.getCurrentPosition(success, fail);
