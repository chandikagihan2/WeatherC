
console.log("WeatherC App Started!");

const API_KEY = "f78c16965c5b4e2084c162937262311";

function getWeatherDetails(code, isDay = 1) {

    if (code == 1000) {
        return isDay
            ? { condition: "Sunny", description: "Clear sky", icon: "☀️" }
            : { condition: "Clear", description: "Clear night sky", icon: "🌙" };

    } else if (code == 1003) {
        return { condition: "Partly Cloudy", description: "Some clouds in the sky", icon: "🌤️" };

    } else if (code == 1006 || code == 1009) {
        return { condition: "Cloudy", description: "Cloudy or overcast sky", icon: "☁️" };

    } else if (code == 1030 || code == 1135 || code == 1147) {
        return { condition: "Foggy", description: "Foggy weather", icon: "🌫️" };

    } else if ([1063, 1150, 1153, 1168, 1171].includes(code)) {
        return { condition: "Rainy", description: "Light rain or drizzle", icon: "🌧️" };

    } else if ([1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201].includes(code)) {
        return { condition: "Rainy", description: "Rain is falling", icon: "🌧️" };

    } else if ([1240, 1243, 1246].includes(code)) {
        return { condition: "Rainy", description: "Rain showers", icon: "🌧️" };

    } else if ([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
        return { condition: "Snowy", description: "Snow is falling", icon: "❄️" };

    } else if ([1069, 1072, 1204, 1207, 1249, 1252].includes(code)) {
        return { condition: "Sleet", description: "Rain and snow mixed", icon: "🌨️" };

    } else if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
        return { condition: "Thunderstorm", description: "Thunderstorm in the area", icon: "⛈️" };

    } else if ([1114, 1117].includes(code)) {
        return { condition: "Snowy", description: "Blowing snow", icon: "❄️" };

    } else {
        return { condition: "Unknown", description: "Weather information unavailable", icon: "🌤️" };
    }
}


function getWeather(city) {

    const url = "https://api.weatherapi.com/v1/forecast.json?key="
        + API_KEY
        + "&q=" + encodeURIComponent(city)
        + "&days=5&aqi=no&alerts=no";

    fetch(url)

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Weather data could not be loaded");
            }

            return response.json();
        })

        .then(function (data) {

            if (data.error) {
                throw new Error(data.error.message);
            }

            // Current Weather
            const locationName = data.location.name;
            const countryName = data.location.country;

            const temperature = data.current.temp_c;
            const humidity = data.current.humidity;
            const windSpeed = data.current.wind_kph;
            const feelsLike = data.current.feelslike_c;

            const weatherCode = data.current.condition.code;
            const weatherDetails = getWeatherDetails(
                weatherCode,
                data.current.is_day
            );

            document.getElementById("cityName").innerHTML =
                locationName + ", " + countryName;

            document.getElementById("temperature").innerHTML =
                temperature + "°C";

            document.getElementById("humidity").innerHTML =
                humidity + "%";

            document.getElementById("windSpeed").innerHTML =
                windSpeed + " km/h";

            document.getElementById("feelsLike").innerHTML =
                feelsLike + "°C";

            document.getElementById("weatherCondition").innerHTML =
                weatherDetails.condition;

            document.getElementById("weatherDescription").innerHTML =
                weatherDetails.description;

            document.getElementById("weatherIcon").innerHTML =
                weatherDetails.icon;


            // Hourly Forecast
            let hourlyData = [];

            data.forecast.forecastday.forEach(function (day) {
                hourlyData = hourlyData.concat(day.hour);
            });

            const currentTime = data.location.localtime_epoch;

            let currentIndex = hourlyData.findIndex(function (hour) {
                return hour.time_epoch + 3600 > currentTime;
            });

            if (currentIndex == -1) {
                currentIndex = 0;
            }

            let hourlyHTML = "";

            for (
                let i = currentIndex;
                i < Math.min(currentIndex + 4, hourlyData.length);
                i++
            ) {

                const hourData = hourlyData[i];

                let displayTime = "";

                if (i == currentIndex) {
                    displayTime = "Now";

                } else {

                    const hour = Number(hourData.time.split(" ")[1].split(":")[0]);

                    let period = "AM";

                    if (hour >= 12) {
                        period = "PM";
                    }

                    let displayHour = hour % 12;

                    if (displayHour == 0) {
                        displayHour = 12;
                    }

                    displayTime = displayHour + " " + period;
                }

                const hourlyDetails = getWeatherDetails(
                    hourData.condition.code,
                    hourData.is_day
                );

                hourlyHTML += `<div class="col-3">
                    <p>${displayTime}</p>
                    <h3>${hourlyDetails.icon}</h3>
                    <h5>${hourData.temp_c}°C</h5>
                </div>`;
            }

            document.getElementById("hourlyForecast").innerHTML =
                hourlyHTML;


            // 5-Day Forecast
            const dailyData = data.forecast.forecastday;

            const dayNames = [
                "Sunday", "Monday", "Tuesday",
                "Wednesday", "Thursday", "Friday", "Saturday"
            ];

            let dailyHTML = "";

            for (let i = 0; i < dailyData.length; i++) {

                const dayData = dailyData[i];

                const dateParts = dayData.date.split("-");

                const date = new Date(
                    Number(dateParts[0]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[2])
                );

                const dayName = dayNames[date.getDay()];

                const dailyDetails = getWeatherDetails(
                    dayData.day.condition.code
                );

                const dailyMax = dayData.day.maxtemp_c;
                const dailyMin = dayData.day.mintemp_c;

                dailyHTML += `<div class="forecast-item">
                    <span>${dayName}</span>
                    <span>${dailyDetails.icon}</span>
                    <span>${dailyMax}°C / ${dailyMin}°C</span>
                </div>`;
            }

            document.getElementById("dailyForecast").innerHTML =
                dailyHTML;


            // Sunrise and Sunset
            const astro = dailyData[0].astro;

            document.getElementById("sunriseTime").innerHTML =
                astro.sunrise;

            document.getElementById("sunsetTime").innerHTML =
                astro.sunset;


            console.log(data);

        })

        .catch(function (error) {

            alert(error.message);
            console.log(error);

        });
}


getWeather("Panadura");
