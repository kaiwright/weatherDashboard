var input;
var lat;
var lon;
var userHistory = [];
// container 
var weatherCard = $("<div>").addClass("border border-dark p-3").attr("id", "weatherCard");

// Handling form submission
document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    input = document.getElementById("search-input").value;
    fetchData();
});


function fetchData() {
    // geocoder to turn city name into lat and lon coordinates
    var geocodingURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=f237ee47155c423e2a0250df610441f7"
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // getting the lat and lon data for API call
            lat = JSON.stringify(data[0].lat);
            lon = JSON.stringify(data[0].lon);

            // API call for city data
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=f237ee47155c423e2a0250df610441f7"
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    locationDateWeather();
                    appendHistory();

                    // --------- Search History ----------
                    if (userHistory.length < 5) {
                        userHistory.push(data.city.name);
                    } else {
                        userHistory.splice(1, 1);
                        userHistory.push(data.city.name);
                    }


                    // ------ Current city weather data ------
                    function locationDateWeather() {
                        // Clears previous results
                        $("#weatherCard").empty();
                        $("#today").empty();
                        $("#forecast").empty();

                        //date
                        var todayDate = dayjs().format("D/M/YYYY");
                        cityDateContainer = $("<h1>")

                        //date and name
                        cityDateContainer.text((data.city.name) + " (" + todayDate + ")");

                        //icon
                        iconCode = (data.list[0].weather[0].icon);
                        iconContainer = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png")

                        // appends all to header
                        weatherCard.append(cityDateContainer, iconContainer);


                        // ------- Saving to Local Storage -------
                        for (let i = 0; i < userHistory.length; i++) {
                            localStorage.setItem("result" + i, userHistory[i]);
                        }


                        // ----------- Weather Data --------------
                        // temperature
                        var temp = (data.list[0].main.temp);
                        tempContainer = $("<h3>");
                        tempContainer.text("Temp: " + temp + "C").addClass("mb-3");
                        weatherCard.append(tempContainer);

                        // wind
                        var windy = (data.list[0].wind.speed);
                        windContainer = $("<h3>");
                        windContainer.text("Wind: " + windy + "KPH").addClass("mb-3");
                        weatherCard.append(windContainer);

                        // humidity
                        var humidity = (data.list[0].main.humidity);
                        humidityContainer = $("<h3>");
                        humidityContainer.text("Humidity: " + humidity + "%").addClass("mb-3");
                        weatherCard.append(humidityContainer);

                        $("#today").append(weatherCard);
                    }


                    // ------------- 5 day forecast -------------

                    // make 5 calls to the future weather function
                    for (let index = 1; index < 6; index++) {

                        // set desired day in YYYY-MM-DD
                        var futureDate = dayjs().add([index], "day").format("YYYY-MM-DD");
                        futureWeather()
                    }
                    function futureWeather() {
                        // filter data responses that includes desired day
                        var findData = (data.list).filter(item => item.dt_txt.includes(futureDate));

                        // Create card
                        var fiveDayContainer = $("<div>").addClass("col")
                        var forecastCard = $("<div>").addClass("card bg-dark text-light p-3 mb-5");

                        // date 
                        futureDateContainer = $("<h3>")
                        futureDateContainer.text(dayjs(futureDate).format("D/M/YYYY"))
                        forecastCard.append(futureDateContainer)
                        //icon
                        futureIconCode = (findData[4].weather[0].icon);
                        futureIconContainer = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png")
                        forecastCard.append(futureIconContainer)

                        // temperature
                        var futureTemp = (findData[4].main.temp);
                        futureTempContainer = $("<h4>");
                        futureTempContainer.text("Temp: " + futureTemp + "C").addClass("mb-3");
                        forecastCard.append(futureTempContainer);

                        // wind
                        var futureWindy = (findData[4].wind.speed);
                        futureWindContainer = $("<h4>");
                        futureWindContainer.text("Wind: " + futureWindy + "KPH").addClass("mb-3");
                        forecastCard.append(futureWindContainer);

                        // humidity
                        var futureHumidity = (findData[4].main.humidity);
                        futureHumidityContainer = $("<h4>");
                        futureHumidityContainer.text("Humidity: " + futureHumidity + "%").addClass("mb-3");
                        forecastCard.append(futureHumidityContainer);
                        fiveDayContainer.append(forecastCard)
                        $("#forecast").append(fiveDayContainer);
                    };

                });
        });

};

function appendHistory() {
    $("#history").empty()
    for (let i = 0; i < userHistory.length; i++) {
        // render as button
        if (userHistory[i] === "null") {
            userHistory[i] = "";
        } else {
            var historyResult = $("<button>").addClass("btn btn-secondary btn-lg").attr("id", "button");
            historyResult.text(userHistory[i]).attr("id", "result" + i);
            $("#history").append(historyResult);
        }
    }

    // onclick for history to go through geocoder as value of the city name
    document.getElementById("result0").addEventListener("click", function () {
        input = document.getElementById("result0").innerText;
        fetchData();
    });
    document.getElementById("result1").addEventListener("click", function () {
        input = document.getElementById("result1").innerText;
        fetchData();
    });
    document.getElementById("result2").addEventListener("click", function () {
        input = document.getElementById("result2").innerText;
        fetchData();
    });
    document.getElementById("result3").addEventListener("click", function () {
        input = document.getElementById("result3").innerText;
        fetchData();
    });
    document.getElementById("result4").addEventListener("click", function () {
        input = document.getElementById("result4").innerText;
        fetchData();
    });
}

// gets history from local storage
window.onload = function () {
    for (let i = 0; i < 5; i++) {
        var history = localStorage.getItem('result' + i);
        userHistory.push(history)
    }
    appendHistory()
}