
console.log("WeatherC App Started!");

alert("Welcome to WeatherC!");

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city == "") {
        alert("Please enter a city name");

    } else {
        getWeather(city);
        cityInput.value = "";
    }
});

cityInput.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        searchButton.click();
    }
});

const currentDate = new Date();

const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

document.getElementById("currentDate").innerHTML = currentDate.toLocaleDateString("en-US", dateOptions);