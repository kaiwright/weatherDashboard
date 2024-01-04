var input;
var lat;
var lon;
var userHistory = [];

// Handling form submission
document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    input = document.getElementById("search-input").value;
    fetchData();
});


function fetchData() {
    // geocoder to turn city name into lat and lon coordinates
    var geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=f237ee47155c423e2a0250df610441f7"
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // getting the lat and lon data for API call
            lat = JSON.stringify(data[0].lat);
            lon = JSON.stringify(data[0].lon);

            // API call for city data
            var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=f237ee47155c423e2a0250df610441f7"
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    locationDateWeather()
                    appendHistory()
                    console.log(data)

                    // ----------------- Search History ----------------
                    if (userHistory.length < 5) {
                        userHistory.push(data.city.name);
                    } else {
                        userHistory.splice(1, 1);
                        userHistory.push(data.city.name);
                    }

                    // --------------- Current city weather data ---------------
                    function locationDateWeather() {
                        // Clears Results
                        $("#today").empty()
                        //date
                        var todayDate = dayjs().format("D/M/YYYY");
                        cityDateContainer = $("<h1>")
                        //date and name
                        cityDateContainer.text((data.city.name) + " (" + todayDate + ")");
                        //icon
                        iconCode = (data.list[0].weather[0].icon);
                        iconContainer = $("<img>").attr("src", "https://openweathermap.org/img/wn/"+ iconCode + "@2x.png")
                        // appends all to header
                        $("#today").append(cityDateContainer, iconContainer);
                    }

                    // -------------- Saving to Local Storage -------------
                    for (let i = 0; i < userHistory.length; i++) {
                        ;
                        localStorage.setItem("result" + i, userHistory[i]);
                    }

                    // ----------- Weather Data --------------
                    // temperature
                    var temp = (data.list[0].main.temp);
                    tempContainer = $("<h3>");
                    tempContainer.text("Temp: " + temp + "C");
                    $("#today").append(tempContainer);

                    // wind
                    var windy = (data.list[0].wind.speed);
                    windContainer = $("<h3>");
                    windContainer.text("Wind: " + windy + "KPH");
                    $("#today").append(windContainer);

                    // humidity
                    var humidity = (data.list[0].main.humidity);
                    humidityContainer = $("<h3>");
                    humidityContainer.text("Humidity: " + humidity + "%");
                    $("#today").append(humidityContainer);

                });
        });
};

function appendHistory() {
    $("#history").empty()
    for (let i = 0; i < userHistory.length; i++) {
        var historyResult = $("<h3>");
        historyResult.text(userHistory[i]).attr("id", "result" + i);
        $("#history").append(historyResult);
    }
}

// gets history from local storage
window.onload = function () {
    for (let i = 0; i < 5; i++) {
        var history = localStorage.getItem('result' + i);
        userHistory.push(history)
    }
    appendHistory()
}