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
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
        + city + "&appid=48bd45b2787b6bc230706d9c63aab592";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var latLon = [data[0].lat, data[0].lon]
                    getWeather(latLon, city);
                });
            } else {
                var errorEl = $("<p>").addClass("error-notice col-9 bg-danger p-2").text("Location Error Code: " + data.cod);
                $("#search-form").append(errorEl);
            }
        })
};
// passes lat/long to get weather obj
var getWeather = function(geoPosit, city) {
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="
        + geoPosit[0] + "&lon=" + geoPosit[1]
        + "&units=imperial&appid=48bd45b2787b6bc230706d9c63aab592";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    createWeatherDash(data, city);
                    createFiveDay(data);
                });
            } else {
                var errorEl = $("<p>").addClass("error-notice col-9 bg-danger p-2").text("Weather Error Code: " + data.cod);
                $("#search-form").append(errorEl);
            }
        })
};

// parses weather object into dynamic elements
var createWeatherDash = function(forecast, city) {
    // container for dashboard
    var weatherBox = $("<div>")
        .addClass("col-12 row justify-content-start border border-dark mr-3 p-3")
        .attr("id", "weather-box")
    // city and date header element
    var cityDateEl = $("<h2>")
        .text(city + " (" + moment.unix(forecast.current.dt).format("M/D/YYYY") + ") ")
    // icon for current weather
    var currIcon = $("<img>")
        .attr("src", "http://openweathermap.org/img/w/" + forecast.current.weather[0].icon + ".png")
        .attr("alt", "Icon for current weather.")
    var listBox = $("<ul>")
        .addClass("list-group col-12");
    // current weather info elements
    var tempEl = $("<li>").text("Temp: " + forecast.current.temp + " °F")
    var windEl = $("<li>").text("Wind: " + forecast.current.wind_speed + " MPH")
    var humidityEl = $("<li>").text("Humidity: " + forecast.current.humidity + "%")
    var uvIndexEl = $("<li>").html("UV Index: <span>" + forecast.current.uvi + "</span>")
    // sets color for uv span element
    if (forecast.current.uvi >= 11) {
        uvIndexEl.addClass("uv-purple")
    } else if (forecast.current.uvi >= 8) {
        uvIndexEl.addClass("uv-red")
    } else if (forecast.current.uvi >= 6) {
        uvIndexEl.addClass("uv-orange")
    } else if (forecast.current.uvi >= 3) {
        uvIndexEl.addClass("uv-yellow")
    } else {
        uvIndexEl.addClass("uv-green")
    }
    listBox.append(tempEl, windEl, humidityEl, uvIndexEl);
    weatherBox.append(cityDateEl, currIcon, listBox);
    $("#right-column").append(weatherBox);
};

var createFiveDay = function(forecast) {
    // card group to hold the 5 day cards
    var fiveDayBox = $("<div>")
        .addClass("card-group")
    var titleEl = $("<h2>")
        .addClass("col-12 p-3")
        .text("5-Day Forecast:");
    fiveDayBox.append(titleEl);
    // loops to create a card for each day
    for (var i = 1; i < 6; i++) {
        // card to hold forecast
        var cardEl = $("<div>")
            .addClass("card m-1 p-2");
        // list for formatting purposes
        var listBox = $("<ul>")
            .addClass("list-group");
        // data including date, icon. temp, wind, humidity
        var DateEl = $("<h3>")
            .text(moment.unix(forecast.daily[i].dt).format("M/D/YYYY"))
            .addClass("card-title");
        var icon = $("<img>")
            .attr("src", "http://openweathermap.org/img/w/" + forecast.daily[i].weather[0].icon + ".png")
            .attr("alt", "Icon for future weather.")
        var tempEl = $("<li>").text("Temp: " + forecast.daily[i].temp.day + " °F");
        var windEl = $("<li>").text("Wind: " + forecast.daily[i].wind_speed + " MPH");
        var humidityEl = $("<li>").text("Humidity: " + forecast.daily[i].humidity + "%");
        // append list items to list then list to card then card to card group
        listBox.append(DateEl, icon, tempEl, windEl, humidityEl);
        cardEl.append(listBox);
        fiveDayBox.append(cardEl);
    }
    $("#right-column").append(fiveDayBox);
};

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

