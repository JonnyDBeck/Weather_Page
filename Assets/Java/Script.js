var sBtn = $('#sBtn');
var sbar = $('#cityInput');

var btnList = $('#btnList');

var bigWeather = $('#bigWeather');
var today = $('#todayBox');
var wallet = $('#wallet');

var wAPIKey = "1b5a9a0bdf858ae608b75dbdd896fa41";


sBtn.click(function(e){
    e.preventDefault();
    var city = sbar.val().trim().replace(/ /g,"_");
    var latLon = [];

    var gQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + wAPIKey
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){
        //console.log(data)
        latLon = [data[0].lat, data[0].lon, data[0].state]

        makeBtn(city, latLon[2], true)
        updatePage(latLon, city);
    })
});


function updatePage(locale, city){
    var allH2 = bigWeather.find("h2");
    for(i = 0; i < 6; i++){
        allH2.first().text(city.replace("_"," ") + ', ' + locale[2]);
        allH2 = allH2.slice(1);
    }

    var allH3 = bigWeather.find("h3");
    for(i = 0; i < 6; i++){
        allH3.first().text(moment().add(i,'days').format("M-D-YYYY"));
        allH3 = allH3.slice(1);
    }

    var gQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + locale[0] + "&lon=" + locale[1] + "&appid=" + wAPIKey + "&units=imperial";ay
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){
        today.children().eq(0).children().eq(0).text(toEmoji(data.weather[0].icon));
        today.children().eq(1).children().eq(0).text("Temp: " + data.main.temp + "°F");
        today.children().eq(1).children().eq(1).text("Wind: " + data.wind.speed + " Mph");
        today.children().eq(1).children().eq(2).text("Humidity: " + data.main.humidity + " g.m-3");

    })

    var gQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + locale[0] + "&lon=" + locale[1] + "&appid=" + wAPIKey + "&units=imperial";
    fetch(gQueryURL)
    .then((response) => response.json())
    .then(function (data){
        for(i = 3; i < 39 ; i += 8){
            wallet.children().eq((i - 3)/8).children().eq(0).text(toEmoji(data.list[i].weather[0].icon));
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(0).text("Temp: " + data.list[i].main.temp + "°F");
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(1).text("Wind: " + data.list[i].wind.speed + " Mph");
            wallet.children().eq((i - 3)/8).children().eq(3).children().eq(2).text("Humidity: " + data.list[i].main.humidity + " g.m-3");
        }

    })

}


function makeBtn(city, state, data){
    var fullName = (city.replace("_"," ") + ', ' + state);

    if (state == ""){
        return;
    }

    var allBtn = btnList.find("button");
    for (i = 0; i < allBtn.length; i++){
        if(allBtn[i].textContent.toUpperCase() == fullName.toUpperCase()){
            return;
        }
    }

    if(allBtn.length >= 8){
        btnList.children().eq(17).remove();
        btnList.children().eq(16).remove();
    }

    var newBtn = $('<button>')
    newBtn.text(fullName);
    btnList.prepend('<br>');
    btnList.prepend(newBtn)

    newBtn.on('click', clickevent => {

        console.log(newBtn)
        var selCity = newBtn[0].innerText.split(",");

        var gQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + wAPIKey
        fetch(gQueryURL)
        .then((response) => response.json())
        .then(function (data){
            //console.log(data)
            latLon = [data[0].lat, data[0].lon, data[0].state]
    
            updatePage(latLon, selCity[0]);
        })
    })
}

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