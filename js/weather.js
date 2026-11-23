
console.log("WeatherC App Started!");

function getWeather(city) {

    fetch("https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(city) + "&format=jsonv2&limit=1&addressdetails=1&accept-language=en")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Location search failed");
            }

            return response.json();
        })

        .then(function (locationData) {

            if (!locationData || locationData.length == 0) {
                throw new Error("Location not found. Please try another location.");
            }

            const location = locationData[0];

            const latitude = Number(location.lat);
            const longitude = Number(location.lon);

            const locationName = location.name || location.display_name.split(",")[0];

            const countryName = location.address && location.address.country
                ? location.address.country
                : "";

            return fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto")
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Weather data could not be loaded");
                    }

                    return response.json();
                })

                .then(function (data) {

                    const temperature = data.current.temperature_2m;
                    const humidity = data.current.relative_humidity_2m;
                    const windSpeed = data.current.wind_speed_10m;
                    const feelsLike = data.current.apparent_temperature;

                    const weatherCode = data.current.weather_code;

                    let condition = "";
                    let description = "";
                    let icon = "";

                    if (weatherCode == 0) {
                        condition = "Sunny";
                        description = "Clear sky";
                        icon = "☀️";

                    } else if (weatherCode == 1 || weatherCode == 2) {
                        condition = "Partly Cloudy";
                        description = "Some clouds in the sky";
                        icon = "🌤️";

                    } else if (weatherCode == 3) {
                        condition = "Cloudy";
                        description = "Overcast sky";
                        icon = "☁️";

                    } else if (weatherCode == 45 || weatherCode == 48) {
                        condition = "Foggy";
                        description = "Foggy weather";
                        icon = "🌫️";

                    } else if (weatherCode >= 51 && weatherCode <= 67) {
                        condition = "Rainy";
                        description = "Rain or drizzle";
                        icon = "🌧️";

                    } else if (weatherCode >= 71 && weatherCode <= 77) {
                        condition = "Snowy";
                        description = "Snow is falling";
                        icon = "❄️";

                    } else if (weatherCode >= 80 && weatherCode <= 82) {
                        condition = "Rainy";
                        description = "Rain showers";
                        icon = "🌧️";

                    } else if (weatherCode == 85 || weatherCode == 86) {
                        condition = "Snowy";
                        description = "Snow showers";
                        icon = "❄️";

                    } else if (weatherCode >= 95 && weatherCode <= 99) {
                        condition = "Thunderstorm";
                        description = "Thunderstorm in the area";
                        icon = "⛈️";

                    } else {
                        condition = "Unknown";
                        description = "Weather information unavailable";
                        icon = "🌤️";
                    }

                    document.getElementById("cityName").innerHTML = locationName + ", " + countryName;
                    document.getElementById("temperature").innerHTML = temperature + "°C";
                    document.getElementById("humidity").innerHTML = humidity + "%";
                    document.getElementById("windSpeed").innerHTML = windSpeed + " km/h";
                    document.getElementById("feelsLike").innerHTML = feelsLike + "°C";

                    document.getElementById("weatherCondition").innerHTML = condition;
                    document.getElementById("weatherDescription").innerHTML = description;
                    document.getElementById("weatherIcon").innerHTML = icon;



                    const hourlyTime = data.hourly.time;
                    const hourlyTemperature = data.hourly.temperature_2m;
                    const hourlyWeatherCode = data.hourly.weather_code;

                    let currentIndex = hourlyTime.findIndex(function (time) {
                        return time.substring(0, 13) == data.current.time.substring(0, 13);
                    });

                    if (currentIndex == -1) {
                        currentIndex = hourlyTime.findIndex(function (time) {
                            return time >= data.current.time;
                        });
                    }

                    if (currentIndex == -1) {
                        currentIndex = 0;
                    }

                    let hourlyHTML = "";

                    for (let i = currentIndex; i < Math.min(currentIndex + 4, hourlyTime.length); i++) {

                        const time = hourlyTime[i];

                        let temperature = hourlyTemperature[i];
                        let weatherCode = hourlyWeatherCode[i];

                        let hour = Number(time.split("T")[1].split(":")[0]);
                        let displayTime = "";

                        if (i == currentIndex) {
                            displayTime = "Now";
                            temperature = data.current.temperature_2m;
                            weatherCode = data.current.weather_code;

                        } else {

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

                        let hourlyIcon = "🌤️";

                        if (weatherCode == 0) {
                            hourlyIcon = "☀️";

                        } else if (weatherCode == 1 || weatherCode == 2) {
                            hourlyIcon = "🌤️";

                        } else if (weatherCode == 3) {
                            hourlyIcon = "☁️";

                        } else if (weatherCode == 45 || weatherCode == 48) {
                            hourlyIcon = "🌫️";

                        } else if (weatherCode >= 51 && weatherCode <= 67) {
                            hourlyIcon = "🌧️";

                        } else if (weatherCode >= 71 && weatherCode <= 77) {
                            hourlyIcon = "❄️";

                        } else if (weatherCode >= 80 && weatherCode <= 82) {
                            hourlyIcon = "🌧️";

                        } else if (weatherCode == 85 || weatherCode == 86) {
                            hourlyIcon = "❄️";

                        } else if (weatherCode >= 95 && weatherCode <= 99) {
                            hourlyIcon = "⛈️";
                        }

                        hourlyHTML += `<div class="col-3">
                        <p>${displayTime}</p>
                        <h3>${hourlyIcon}</h3>
                        <h5>${temperature}°C</h5>
                    </div>`;
                    }

                    document.getElementById("hourlyForecast").innerHTML = hourlyHTML;


                    const dailyTime = data.daily.time;
                    const dailyWeatherCode = data.daily.weather_code;
                    const dailyMax = data.daily.temperature_2m_max;
                    const dailyMin = data.daily.temperature_2m_min;

                    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                    let dailyHTML = "";

                    for (let i = 0; i < 5; i++) {

                        const dateParts = dailyTime[i].split("-");
                        const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

                        const dayName = dayNames[date.getDay()];
                        const weatherCode = dailyWeatherCode[i];

                        let dailyIcon = "🌤️";

                        if (weatherCode == 0) {
                            dailyIcon = "☀️";

                        } else if (weatherCode == 1 || weatherCode == 2) {
                            dailyIcon = "🌤️";

                        } else if (weatherCode == 3) {
                            dailyIcon = "☁️";

                        } else if (weatherCode == 45 || weatherCode == 48) {
                            dailyIcon = "🌫️";

                        } else if (weatherCode >= 51 && weatherCode <= 67) {
                            dailyIcon = "🌧️";

                        } else if (weatherCode >= 71 && weatherCode <= 77) {
                            dailyIcon = "❄️";

                        } else if (weatherCode >= 80 && weatherCode <= 82) {
                            dailyIcon = "🌧️";

                        } else if (weatherCode == 85 || weatherCode == 86) {
                            dailyIcon = "❄️";

                        } else if (weatherCode >= 95 && weatherCode <= 99) {
                            dailyIcon = "⛈️";
                        }

                        dailyHTML += `<div class="forecast-item">
                    <span>${dayName}</span>
                    <span>${dailyIcon}</span>
                    <span>${dailyMax[i]}°C / ${dailyMin[i]}°C</span>
                </div>`;
                    }

                    document.getElementById("dailyForecast").innerHTML = dailyHTML;
                    const sunrise = data.daily.sunrise[0];
                    const sunset = data.daily.sunset[0];

                    const sunriseDate = new Date(sunrise);
                    const sunsetDate = new Date(sunset);

                    document.getElementById("sunriseTime").innerHTML =
                        sunriseDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                        });

                    document.getElementById("sunsetTime").innerHTML =
                        sunsetDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                        });

                    console.log(data);
                });
        })

        .catch(function (error) {
            alert(error.message);
            console.log(error);
        });
}

getWeather("Colombo");
