var location;
var lat;
var lon;
var userHistory = [];

// search 
function search() {
    var input = document.getElementById("search-input").value;
    location = input;
    fetchData();
}

function fetchData() {
    // geocoder to turn city name into lat and lon coords
    var geocoding = "http://api.openweathermap.org/geo/1.0/direct?q="+ location + "&limit=1&appid=f237ee47155c423e2a0250df610441f7"
    fetch(geocoding)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // gathers user's search history capped at 5
            if(userHistory.length < 5) {
                userHistory.push(data.name);
            } else {
                userHistory.splice(1,1);
                userHistory.push(data.name);
            }
            // appends city name to header 
            var cityName = $("<h1>");
            cityName.text(data.name);
            cityName.append("#today");

            // saves each to local storage
            for (let i = 0; i < userHistory.length; i++) {
                localStorage.setItem('result' + i, location);
            }

            // getting the lat and lon data for API call
            lat = data.lat;
            lon = data.lon;
});
    var queryURL = "api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon=" + lon + "&appid=f237ee47155c423e2a0250df610441f7"
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //clears previous results
            // $("#mainCard").empty();
            
});
};