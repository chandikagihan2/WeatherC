
console.log("WeatherC App Started!");

alert("Welcome to WeatherC!");

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");

searchButton.addEventListener("click", function () {
    const city = cityInput.value;
     if (city == "") {
        alert("Please enter a city name");

    } else {
        cityName.innerHTML = city;
    }
});