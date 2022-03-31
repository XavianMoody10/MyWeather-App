"use strict";
// Declare DOM elements
const displayState = document.querySelector("#user-location p:first-child");
const displayCity = document.querySelector("#user-location p:last-child");
const displayDate = document.querySelector("#date-time p:first-child");
const displayTime = document.querySelector("#date-time p:last-child");

// Export DOM elements (Imported in the "app.js" file)
export { displayState, displayCity };

// Display state and city location
const displayUserLocation = function (theState, theCity) {
  const onlyState = theState.split(",");
  const onlyCity = theCity.split(",");
  const userState = onlyState[0];
  const userCity = onlyCity[0];

  displayState.textContent = userState;
  displayCity.textContent = userCity;
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// USE GEOLOCATION TO GET USER LOCATION
// If fetch data is success
const locationFound = (grantLocation) => {
  // const userLatitude = 30.267153;
  // const userLongitude = -97.7430608;
  const userLatitude = grantLocation.coords.latitude;
  const userLongitude = grantLocation.coords.longitude;

  // Fetch location API (google maps)
  const getIp = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatitude},${userLongitude}&key=AIzaSyDenEVE_JaCJfdRwz4SbL1unVkgj1Rzl_s`
  );

  getIp
    .then((success) => {
      const parsedData = success.json();
      return parsedData;
    })
    .then((locData) => {
      console.log(locData);
      const state = locData.results[7].formatted_address;
      const city = locData.results[4].formatted_address;
      console.log(state);
      console.log(city);

      displayUserLocation(state, city);
      return state, city;
    })
    .catch((failed) => {
      console.log(failed);
    });
};

// If data fetched fails
const locationBlocked = (blockedLocation) => {
  console.log(blockedLocation);
};

// GEOLOCATION Activated
const userLocation = navigator.geolocation.getCurrentPosition(
  locationFound,
  locationBlocked
);

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// TIMESTAMP
const displayTimestamp = function () {
  function getCurrentDate() {
    // DISPLAY USER CURRENT DATE
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentDate = new Date();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    let currentMonth = months[month];
    let currentDay = day;
    let currentYear = year;
    displayDate.textContent = `${currentMonth} ${currentDay}, ${currentYear}`;
  }
  // ---------------------------
  function getCurrentTime() {
    // DISPLAY USER CURRENT TIME
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let timePeriod;

    if (currentHour > 12) {
      currentHour = currentHour - 12;
      timePeriod = "PM";
    } else {
      timePeriod = "AM";
    }

    if (currentHour == 0) {
      currentHour = 1;
    }

    if (currentMinute < 10) {
      displayTime.textContent = `${currentHour}: 0${currentMinute} ${timePeriod}`;
    } else {
      displayTime.textContent = `${currentHour}: ${currentMinute} ${timePeriod}`;
    }
  }

  getCurrentDate();
  getCurrentTime();
};

displayTimestamp();
