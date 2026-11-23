console.log("WeatherC App Started!");

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FColombo")

    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const temperature = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const windSpeed = data.current.wind_speed_10m;


        document.getElementById("temperature").innerHTML = temperature + "°C";
        document.getElementById("humidity").innerHTML = humidity + "%";
        document.getElementById("windSpeed").innerHTML = windSpeed + " km/h";
        document.getElementById("feelsLike").innerHTML = data.current.apparent_temperature + "°C";
        console.log(data);
    });
