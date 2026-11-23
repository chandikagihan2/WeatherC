
console.log("WeatherC App Started!");

alert("Welcome to WeatherC!");

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");

searchButton.addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city == "") {
        alert("Please enter a city name");

    } else {
        cityName.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
        cityInput.value = "";
    }
});

cityInput.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        searchButton.click();
    }
});
