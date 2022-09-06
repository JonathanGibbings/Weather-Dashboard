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
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + geoPosit[0] + "&lon=" + geoPosit[1] + "&units=imperial&appid=48bd45b2787b6bc230706d9c63aab592";
    // var apiUrlFiveDay = "http://api.openweathermap.org/data/2.5/forecast?lat=" + geoPosit[0] + "&lon=" + geoPosit[1] + "&appid=48bd45b2787b6bc230706d9c63aab592";
    // var fiveDayForecast = {};
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    createWeatherDash(data, city);
                });
            } else {
                var errorEl = $("<p>").addClass("error-notice col-9 bg-danger p-2").text("Weather Error Code: " + data.cod);
                $("#search-form").append(errorEl);
            }
        })
    // fetch(apiUrlFiveDay)
    //     .then(function(response) {
    //         if (response.ok) {
    //             response.json().then(function(data) {
    //                 console.log(data);
    //                 fiveDayForecast = data;
    //             });
    //         } else {
    //             var errorEl = $("<p>").addClass("error-notice col-9 bg-danger p-2").text("5Day Error Code: " + data.cod);
    //             $("#search-form").append(errorEl);
    //         }
    //     })
};

// parses weather object into dynamic elements
var createWeatherDash = function(forecast, city) {
//     <div class="border border-dark mr-3 p-3">
//     <h2>Durham (9/3/2022) ☁️</h2>
//     <ul>
//         <li>
//             <p>
//                 Temp: 74.01 °F
//             </p>
//         </li>
//         <li>
//             <p>Wind: 8.22 MPH</p>
//         </li>
//         <li>
//             <p>Humidity: 22%</p>
//         </li>
//         <li>
//             <p>UV Index: <span>0.48</span></p>
//         </li>
//     </ul>
// </div>
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
    // current weather info elements
    var tempEl = $("<p>").text("Temp: " + forecast.current.temp + " °F")
        .addClass("col-12");
    var windEl = $("<p>").text("Wind: " + forecast.current.wind_speed + " MPH")
        .addClass("col-12");
    var humidityEl = $("<p>").text("Humidity: " + forecast.current.humidity + "%")
        .addClass("col-12");
    var uvIndexEl = $("<p>").html("UV Index: <span>" + forecast.current.uvi + "</span>")
        .addClass("col-12");
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


    weatherBox.append(cityDateEl, currIcon, tempEl, windEl, humidityEl, uvIndexEl);
    $("#right-column").append(weatherBox);






};

var createFiveDay = function(fiveDay) {};

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

