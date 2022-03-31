import { displayState, displayCity } from "./location.js";

import {
  displayImage,
  displayDesc,
  displayHumid,
  displayWindSp,
  displayTemp,
} from "./weather.js";

const searchBtn = document.querySelector(".fa-magnifying-glass");
const searchMessage = document.querySelector("#message");
const weatherLocation = document.querySelector(".weather-location");
let locationBox = document.querySelector(".locations-box");
const suggestionBox = document.querySelector("#suggestion-Box");
const searchBarInput = document.querySelector("#search-bar input");
let locationOptions = [];
let addressArray = [];

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// WHILE USER IS TYPING IN THE SEARCH BAR, THESET EVENTS HAPPEN
function searchRules() {
  searchBarInput.addEventListener("click", function () {
    suggestionBox.classList.remove("hidden");
    suggestionBox.classList.add("search-options");
  });

  searchBarInput.addEventListener("keydown", function (e) {
    if (searchBarInput.value.length == 0) {
      searchMessage.classList.add("hidden");
      searchMessage.classList.remove("show-message");
    }
  });

  searchBarInput.addEventListener("keyup", function () {
    if (searchBarInput.value.length == 0) {
      searchMessage.classList.remove("hidden");
      searchMessage.classList.add("show-message");
    }
  });

  document.addEventListener("click", function (e) {
    if (
      e.target != searchBarInput &&
      e.target != searchMessage &&
      e.target != suggestionBox &&
      e.target != locationBox &&
      e.target != locationOptions
    ) {
      suggestionBox.classList.add("hidden");
      suggestionBox.classList.remove("search-options");
    }
  });

  searchBarInput.addEventListener("keydown", function (e) {
    if (e.which == 8) {
      getLocation();
      console.log("BACKSPACE");
    }
  });
}
searchRules();

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// CREATE A FUNCTION THATS GET USER SEARCHED STATE AND PASSES THE STATE AS AN ARGUMENT TO THE WEATHER DATA
let testData = "florida";
searchBarInput.addEventListener("keyup", (e) => {
  const weatherData = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=97773d5af5401e1b00aed3a63620b57e`
  );
  weatherData
    .then((success) => {
      return success.json();
    })
    .then((data) => {
      let latitude = data.coord.lat;
      let longitude = data.coord.lon;
      getLocation(latitude, longitude, data);
    })
    .catch((failed) => {
      console.log(failed);
    });
});

//WHEN THE USER SEARCHES BY CITY OR STATE
function getLocation(lat, lon) {
  const locationData = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDenEVE_JaCJfdRwz4SbL1unVkgj1Rzl_s`
  );
  locationData
    .then((success) => {
      return success.json();
    })
    .then((data) => {
      function formattedAddresses() {
        console.log(data);
        locationOptions = [];
        addressArray = [];

        // Push the results/data into the addressArray
        for (let i = 0; i < data.results.length; i++) {
          addressArray.push(data.results[i].formatted_address);
        }

        // Create a paragraph element for each value and append the element as a child for locationBox
        const addList = addressArray.forEach((x) => {
          const newPara = document.createElement("p");
          newPara.className = "locations-options";
          newPara.innerText = `${x}`;
          locationBox.prepend(newPara);
        });

        // Create a new array using the spread method
        locationOptions = document.querySelectorAll(".locations-options");
        const betterArray = [...locationOptions].reverse();

        // Create a click event for each child element
        const clickEvent = locationOptions.forEach((y) => {
          y.addEventListener("click", function (e) {
            let arrayIndex = betterArray.indexOf(y);
            const searchedCity = data.results[arrayIndex].formatted_address;

            const searchedState =
              data.results[data.results.length - 2].formatted_address.split(
                ","
              )[0];

            const searchedLatittude =
              data.results[arrayIndex].geometry.location.lat;

            const searchedLongitiude =
              data.results[arrayIndex].geometry.location.lng;

            console.log(searchedCity);
            console.log(arrayIndex);
            searchedWeather(searchedLongitiude, searchedLatittude);
            displaySearchedLoaction(searchedState, searchedCity);
          });
        });
      }

      // If data already exist in the addressArray. erase data from the array.
      if (addressArray.length > 0) {
        let x = addressArray.length;
        while (x > 0) {
          addressArray.pop(x);
          x--;
        }

        // Delete all child elements form location box
        while (locationBox.firstChild) {
          locationBox.removeChild(locationBox.firstChild);
        }

        formattedAddresses();
      } else {
        formattedAddresses();
      }
    })
    .catch((failed) => {
      console.log(failed);
    });
}

function searchedWeather(lat, lon) {
  const searchWeather = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97773d5af5401e1b00aed3a63620b57e`
  );
  searchWeather
    .then((success) => {
      return success.json();
    })
    .then((data) => {
      console.log(data);
      displaySearchedWeather(data);
    })
    .catch((failed) => {
      console.log(failed);
    });

  console.log(lon);
  console.log(lat);
}

function displaySearchedLoaction(state, city) {
  displayState.textContent = state;
  displayCity.textContent = city;
}

function displaySearchedWeather(weatherData) {
  console.log(weatherData);
  const weatherInfo = weatherData.weather[0];
  const weatherImage = weatherData.weather[0].icon;
  const weatherDesc = weatherInfo.description;
  const weatherHumidty = weatherData.main.humidity;
  const weatherWindSpd = weatherData.wind.speed;
  const weatherDeg = weatherData.wind.deg;
  const calDegree = Math.trunc((weatherDeg - 32) * (5 / 9));

  const searchedDesc = weatherDesc.split(" ");
  const searchedCapDesc = searchedDesc.map(
    (x) => x[0].toUpperCase() + x.slice(1)
  );
  const searchOfficialDesc = searchedCapDesc.join(" ");

  console.log(weatherImage);
  console.log(searchOfficialDesc);
  console.log(weatherHumidty);
  console.log(weatherWindSpd);
  console.log(weatherDeg);
  console.log(calDegree);

  displayImage.src = ` http://openweathermap.org/img/wn/${weatherImage}@2x.png`;
  displayDesc.textContent = searchOfficialDesc;
  displayHumid.textContent = weatherHumidty;
  displayWindSp.textContent = weatherWindSpd;
  displayTemp.textContent = calDegree;
}
