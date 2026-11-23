console.log("WeatherC App Started!");

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FColombo")

    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const temperature = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const windSpeed = data.current.wind_speed_10m;

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


        document.getElementById("temperature").innerHTML = temperature + "°C";
        document.getElementById("humidity").innerHTML = humidity + "%";
        document.getElementById("windSpeed").innerHTML = windSpeed + " km/h";
        document.getElementById("feelsLike").innerHTML = data.current.apparent_temperature + "°C";

        document.getElementById("weatherCondition").innerHTML = condition;
        document.getElementById("weatherDescription").innerHTML = description;
        document.getElementById("weatherIcon").innerHTML = icon;
        console.log(data);
    });
