// holds array of previous searches
var searchHistory = [];
// loads search history from local storage into array and displays it
var loadSearchHistory = function() {
    var savedHistory = localStorage.getItem("citySearchHistory");
    if (!savedHistory) {
        return false;
    }
    savedHistory = JSON.parse(savedHistory);
    for (var i = 0; i < savedHistory.length; i++) {
        searchHistory.push(savedHistory[i]);
    }
    createSearchHistBtns();
};

// creates btn elements for search history
var createSearchHistBtns = function() {
    $("#city-btn-area").empty();
    var ruler = $("<hr>")
        .addClass("col-9 border-dark m-2");
    $("#city-btn-area").append(ruler);
    for (var i = 0; i < searchHistory.length; i++) {
        var cityBtn = $("<button>")
            .addClass("col-9 btn city-btn m-2")
            .text(searchHistory[i]);
        $("#city-btn-area").append(cityBtn);
    }
}

// saves search history to local storage
var saveSearchHistory = function(city) {
    if (!searchHistory.includes(city)) {
        // add city to array for saving
        searchHistory.push(city);
        // clears form
        $("input").first().val("");
        localStorage.setItem("citySearchHistory", JSON.stringify(searchHistory));
        createSearchHistBtns();
    }
};

// passes city name to get lat/long
var cityToGeoPosit = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
        + city + "&appid=48bd45b2787b6bc230706d9c63aab592";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // checks if anything was returned
                    if (data.length === 0) {
                        var errorEl = $("<p>").addClass("error-notice col-9 bg-danger m-2 p-2").text("Error: City not found");
                        $("#search-form").append(errorEl);
                        setTimeout(function() {
                            $(".error-notice").remove();
                        }, 3000);
                    } else {
                        var latLon = [data[0].lat, data[0].lon];
                        getWeather(latLon, city);
                        // saves city name
                        saveSearchHistory(city);
                    }
                });
            } else {
                var errorEl = $("<p>").addClass("error-notice col-9 bg-danger m-2 p-2").text("Location Error Code: " + data.cod);
                $("#search-form").append(errorEl);
                setTimeout(function() {
                    $(".error-notice").remove();
                }, 3000);
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
                    clearDash();
                    createWeatherDash(data, city);
                    createFiveDay(data);
                });
            } else {
                var errorEl = $("<p>").addClass("error-notice col-9 bg-danger p-2 m-2").text("Weather Error Code: " + data.cod);
                $("#search-form").append(errorEl);
                setTimeout(function() {
                    $(".error-notice").remove();
                }, 3000);
            }
        })
};

// clears previous forecast
var clearDash = function() {
    $("#right-column").html("");
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
    var tempEl = $("<li>").text("Temp: " + forecast.current.temp + " ??F")
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
            .addClass("card mr-2 p-2");
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
        var tempEl = $("<li>").text("Temp: " + forecast.daily[i].temp.day + " ??F");
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
        // formats city name
        cityName = cityName.split(" ");
        for (var i = 0; i < cityName.length; i++) {
            cityName[i] = cityName[i][0].toUpperCase() + cityName[i].substr(1).toLowerCase();
        }
        cityName = cityName.join(" ");
        // sends city to get data back
        cityToGeoPosit(cityName);
    } else {
        var errorEl = $("<p>").addClass("error-notice col-9 bg-danger m-2 p-2").text("Error: No Input");
        $("#search-form").append(errorEl);
        setTimeout(function() {
            $(".error-notice").remove();
        }, 3000);
    }
});

// on click send city name from button from searchHistory
$("#city-btn-area").on("click", "button", function() {
    var cityName = $(this).text();
    cityToGeoPosit(cityName);
});

loadSearchHistory();

