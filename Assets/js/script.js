var apiKey = "8a0eb90b4ecc1522012357f471d8d087";

var cityName = document.querySelector("#city-name")
var searchButton = document.querySelector("#button-addon2")
var cityList = document.querySelector("#cityList")
var currentLocation = document.querySelector("#currLocation")
var currentDate = document.querySelector("#currDate")
var currentTemp = document.querySelector("#temperature")
var currentHumid = document.querySelector("#humidity")
var currentWind = document.querySelector("#windSpeed")
var currentUV = document.querySelector("#uvIndex")
var cnt = 5;

var weather = {
    lat:'',
    lon:'',
    city:''
}

//convert temperature from Fahrenheit to Celcius
function convert(value) {
    var x = Math.floor((value - 32) * 5 / 9)
    return x;
}

//eventhandler to alert user if the box is empty
var formSubmitHandler = function(event) {
    event.preventDefault();

    var stamps = document.querySelectorAll(".days")
    for (i = 0; i < stamps; i++) {
        stamps[i].innerHTML = ''
    }

    var name = ''
    if (cityName.value) {
        //convert the first digit of the number to uppercase and the rest to lowercase
        name = cityName.value[0].toUpperCase() + cityName.value.slice(1).toLowerCase();

    } else {
        return
    }
    //store searched city to local storage
    localStorage.setItem('city', name)
    cityName.value = ''

    //store searched city to a list
    addList(name)

    //get the current weather of the searched city
    getWeather(name)
    
}

//function to get the weather foecast of the day
var getWeather = function(name){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + name + '&appid=' + apiKey;

    fetch(apiUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            
            currentLocation.textContent = data.name + ", " + data.sys.country
            currentDate.textContent = new Date(data.dt * 1000).toLocaleDateString("en-US")
            document.querySelector('#weather-icon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
            currentHumid.textContent = data.main.humidity //access the humidity data
            currentTemp.textContent = convert(data.main.temp) //access the main temperature data
            currentWind.textContent = data.wind.speed //access the wind speed data
            weather.lat = data.coord.lat
            weather.lon = data.coord.lon
            weather.city = data.name
        }).then(()=>{
            getIndex(weather.lat, weather.lon)
        }).then(()=>{
            getforecast(weather.city)
        })
    }

//function to get the uv index number from lat and long 
var getIndex = function(latitude,longitude){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

    fetch(apiUrl)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            currentUV.textContent = ''

            var uvNum = data.nodeValue
            currentUV.textContent = uvNum

            if (uvNum >= 0 && uvNum <= 2) {
                currentUV.textContent = uvNum
                currentUV.classList.remove("bg-warning")
                currentUV.classList.remove("bg-danger")
                currentUV.classList.add("bg-success")
            } else if (uvNum >= 3 && uvNum <= 8) {
                currentUV.textContent = uvNum
                currentUV.classList.remove("bg-success")
                currentUV.classList.remove("bg-danger")
                currentUV.classList.add("bg-warning")
            } else {
                currentUV.textContent = uvNum
                currentUV.classList.remove("bg-warning")
                currentUV.classList.remove("bg-success")
                currentUV.classList.add("bg-danger")
            }
        })
}

//function to generate the forecast for the next 5 days
var  getforecast = function(name){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + name + '&appid=' + apiKey;

    fetch(apiUrl)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
            var temperature = document.querySelectorAll(".days");

            var weatherIndex = 0;
            var day = 1;

            for (var i = 0; i < temperature.length; i++) {
                //increase the date by 1
                var date = moment().add(day, 'days').format("MM/DD/YYYY")

                //change the html text to the date
                temperature[i].children[0].textContent = date

                //set the src attribute of the html element to the weather icon
                temperature[i].children[1].src = "https://openweathermap.org/img/wn/" + data.list[weatherIndex].weather[0].icon + "@2x.png"

                //change the html element text to the humidity value
                temperature[i].children[2].textContent = "Humidity: " + data.list[weatherIndex].main.humidity + "%"

                //change the html element text to the temperature value
                temperature[i].children[3].textContent = 'Temp: ' + convert(data.list[weatherIndex].main.temp) + "°F"

                weatherIndex += 8 //increase the weather index by every 8 arrays (8 arrays per day)
                day++ //increase the day count
            }

        })
}


//fucntion to add a city to the history
var addList = function(temp) { 
    var item = document.createElement('li')
    item.classList.add('list-group-item')
    item.textContent = temp;
    item.addEventListener('click', function(event){
        var item = event.target.textContent
        var stamps = document.querySelectorAll(".days")
        getWeather(item)
    })
    cityList.prepend(item)
}


searchButton.addEventListener('click', formSubmitHandler)

//display the last recently searched city when page
const lcity = localStorage.getItem('city')
if (lcity) {
    getWeather(lcity)
}