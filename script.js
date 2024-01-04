var input;
var lat;
var lon;
var userHistory = [];

// search 
document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("Searched");

    input = document.getElementById("search-input").value;

    // Your code to handle the form submission goes here

    fetchData();
});


function fetchData() {
    // geocoder to turn city name into lat and lon coords
    var geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=f237ee47155c423e2a0250df610441f7"
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // getting the lat and lon data for API call
            lat = JSON.stringify(data[0].lat);
            lon = JSON.stringify(data[0].lon);

            var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=f237ee47155c423e2a0250df610441f7"
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    locationAndDate()
                    appendHistory()
                    console.log(data)

                    // gathers user's search history capped at 5
                    if (userHistory.length < 5) {
                        userHistory.push(data.city.name);
                    } else {
                        userHistory.splice(1, 1);
                        userHistory.push(data.city.name);
                    }
                    // append history
                    function appendHistory() {
                        $("#history").empty()
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            
                        }

                        userHistory.forEach(element => {
                            var historyResult = $("<h3>");
                            historyResult.text(element).addClass()
                            $("#history").append(historyResult)
                        });
                    }


                    // appends searched city name and current date to header 
                    function locationAndDate() {
                        $("#today").empty()
                        var todayDate = dayjs().format("D/M/YYYY");
                        cityDateContainer = $("<h1>")
                        cityDateContainer.text((data.city.name) + " (" + todayDate + ")");
                        $("#today").append(cityDateContainer);
                    }

                    // saves each to local storage
                    for (let i = 0; i < userHistory.length; i++) {
                        localStorage.setItem("result" + i, input);
                    }

                    // gets history from local storage
                    window.onload = function () {
                        for (let i = 0; i < userHistory.length; i++) {
                            var input = localStorage.getItem('result' + i);
                            document.getElementById('result' + i).value = input;
                            appendHistory()
                        }
                    }

                });
        });

};