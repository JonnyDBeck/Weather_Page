//search bar elements
var sBtn = $('#sBtn');
var sbar = $('#cityInput');
var errMsg = $('#errMsg');
var btnList = $('#btnList');

//main weather elements
var bigWeather = $('#bigWeather');
var today = $('#todayBox');
var wallet = $('#wallet');

//API key
var wAPIKey = "1b5a9a0bdf858ae608b75dbdd896fa41";

//Local Storage Check
storageCheck();


//search button click function
sBtn.click(function(e){
    e.preventDefault();

    //initializing vars and parsing user input
    var city = sbar.val().trim().replace(/ /g,"_");
    city = city.toString().toLowerCase();
    var latLon = [];

    //Geolocation API Call
    var gQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + wAPIKey
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){

        //Error Message
        if (typeof(data[0]) == "undefined"){
            errMsg.removeClass("hidden");  
            return;
        } else{
            errMsg.addClass("hidden");
        }

        //Getting data from the API
        latLon = [data[0].lat, data[0].lon, data[0].state]

        //Calling next functions
        makeBtn(city, latLon[2], true)
        updatePage(latLon, city);
    })
});


//update info on page
function updatePage(locale, city){
    //Shows main weather class
    bigWeather.removeClass("hidden");

    //Finds and changes all h2s to the city
    var allH2 = bigWeather.find("h2");
    for(i = 0; i < 6; i++){
        allH2.first().text(city.replace("_"," ") + ', ' + locale[2]);
        allH2 = allH2.slice(1);
    }

    //Finds and changes all h3s to the dates
    var allH3 = bigWeather.find("h3");
    for(i = 0; i < 6; i++){
        allH3.first().text(moment().add(i,'days').format("M-D-YYYY"));
        allH3 = allH3.slice(1);
    }

    //Current Weather API Call
    var gQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + locale[0] + "&lon=" + locale[1] + "&appid=" + wAPIKey + "&units=imperial";
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){
        //displaying stats
        today.children().eq(0).children().eq(0).text(toEmoji(data.weather[0].icon));
        today.children().eq(1).children().eq(0).text("Temp: " + data.main.temp + "°F");
        today.children().eq(1).children().eq(1).text("Wind: " + data.wind.speed + " Mph");
        today.children().eq(1).children().eq(2).text("Humidity: " + data.main.humidity + " g.m-3");

    })

    //Weekly Weather API Call
    var gQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + locale[0] + "&lon=" + locale[1] + "&appid=" + wAPIKey + "&units=imperial";
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){
        for(i = 3; i < 39 ; i += 8){
            //displaying stats
            wallet.children().eq((i - 3)/8).children().eq(0).text(toEmoji(data.list[i].weather[0].icon));
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(0).text("Temp: " + data.list[i].main.temp + "°F");
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(1).text("Wind: " + data.list[i].wind.speed + " Mph");
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(2).text("Humidity: " + data.list[i].main.humidity + " g.m-3");
        }

    })

}


//Creates "Recently Searched" Button
function makeBtn(city, state, data){
    //Getting full city + state name
    var fullName = (city.replace("_"," ") + ', ' + state);

    //checks if the button already exists
    var allBtn = btnList.find("button");
    for (i = 0; i < allBtn.length; i++){
        if(allBtn[i].textContent.toUpperCase() == fullName.toUpperCase()){
            return;
        }
    }

    //checks if there are too many buttons
    if(allBtn.length >= 8){
        btnList.children().eq(17).remove();
        btnList.children().eq(16).remove();
    }

    //creates new button
    var newBtn = $('<button>')
    newBtn.text(fullName);
    //apPENds and prePENds dePENding on what hapPENs
    if(data){
        btnList.prepend('<br>');
        btnList.prepend(newBtn)
    }else{
        btnList.append(newBtn)
        btnList.append('<br>');
        }

    //if button was not made from local data, it saves it to local data
    allBtn = btnList.find("button");
    if(data){
        var history = JSON.parse(localStorage.getItem("History"));
        for(i = 0; i < allBtn.length; i++){
            history[i] = allBtn[i].textContent;
        }
        console.log(allBtn[0].textContent)
        localStorage.setItem("History", JSON.stringify(history))        
    }


    //creates the button's click event
    newBtn.on('click', clickevent => {
        //Seperates city and state
        var selCity = newBtn[0].innerText.split(",");

        //Using the API, gets the info again
        var gQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + wAPIKey
        fetch(gQueryURL)
        .then((response) => response.json())
        .then(function (data){
            latLon = [data[0].lat, data[0].lon, data[0].state]
            updatePage(latLon, selCity[0]);
        })
    })
}


//Switches API icon to an emoji
function toEmoji(weather){
    var emoji;
    switch(weather){
        case "11d":
            emoji = "⛈️";
            break;
        case "09d":
            emoji = "🌧️";
            break;
        case "10d":
            emoji = "🌦️";
            break;
        case "13d":
            emoji = "🌨️";
            break;
        case "50d":
            emoji = "🌫️";
            break;
        case "01n":
        case "01d":
            emoji = "☀️";
            break;
        case "02n":
        case "02d":
            emoji = "🌤️";
            break;
        case "03n":
        case "03d":
            emoji = "🌥️";
            break;
        case "04n":
        case "04d":
            emoji = "☁️";
            break;
        default:
            emoji = "❓";
            break;
    }
    return emoji;
}


//checks storage and makes buttond sepending on storage
function storageCheck(){
    //makes newn local storage if none exist
    if(localStorage.getItem("History") == null){
        var emptyArray = ["","","","","","","",""]
        localStorage.setItem("History", JSON.stringify(emptyArray))
    }

    //gets local storage
    var history = JSON.parse(localStorage.getItem("History"));

    //makes a button for each index
    for(i = 0; i < 8; i++){
        console.log(i)
        if (history[i] != ""){
            var locArray = history[i].split(", ");
            makeBtn(locArray[0], locArray[1], false);
        }
    }
}