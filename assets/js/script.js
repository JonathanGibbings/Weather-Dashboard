// TODO
/* GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city */

// holds array of previous searches
var searchHistory = [];
// loads search history from local storage into array
var loadSearchHistory = function() {};
// dynamically creates buttons from search history
var showSearchHistory = function() {};

// passes city name to get lat/long
var cityToGeoPosit = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=48bd45b2787b6bc230706d9c63aab592";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var latLon = [data[0].lat, data[0].lon]
                    console.log(latLon);
                });
            } else {
                console.log("Error");
            }
        })
};
// passes lat/long to get weather obj
var getWeather = function(GeoPosit) {};

// parses weather object into dynamic elements
var createWeatherDash = function() {};

// on submit send city name to lat/long fetch
$("#search-form").submit(function(event) {
    event.preventDefault();
    var cityName = $("input").first().val().trim();
    if (cityName) {
        cityToGeoPosit(cityName);
    } else {
        console.log("need input")
    }
});

// on click send city name from button from searchHistory
$("").on("click", "button", function() {});

// loadSearchHistory();

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

