
// API key
const apiKey = 'c05fb24f435f452baba50023240607';

// Dom elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const weatherData = document.getElementById('weatherData');
const locationName = document.getElementById('LocationName');
const currentWeatherIcon = document.getElementById('CurrentWeatherIcon');
const CurrentWeatherText = document.getElementById('currentWeatherText');
const extendedForecast = document.getElementById('extendedForecast');
const errorMessage = document.getElementById('errorMessage');
const recentCitiesDropdown = document.getElementById('recentCities')
const loadingMessage = document.getElementById('loadingMessage')


// Event listener for search button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeatherDataByCity(cityName);
        addCityToRecent(cityName);  // will add city to recent cities list
    }
    else {
        showError('Please enter a city name.')  // Shows error if no city name entered
    }
});


// Event listener for the current location button
currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoordinates(latitude, longitude);
            }
        );
    }
    else {
        showError('GeoLocation is not supported by this browser.')
    }
});



// Event listener for recent cities dropdown
recentCitiesDropdown.addEventListener('change', () => {
    const cityName = recentCitiesDropdown.value;
    fetchWeatherDataByCity(cityName);
})


// Function to fetch weather data by city name
function fetchWeatherDataByCity(city) {

    showLoading();
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => showError('Failed to fetch weather data.'))
        .finally(hideLoading);
}


// Function to fetch weather data by coordinates
function fetchWeatherDataByCoordinates(latitude, longitude) {

    showLoading();
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => showError('Failed to fetch weather data. '))
        .finally(hideLoading);

}


// Function to display the weather data
function displayWeatherData(data) {

    console.log(data);
    weatherData.classList.remove('hidden'); // Display the weather Data
    errorMessage.classList.add('hidden'); // Hide the error messages
    locationName.innerHTML = `<p>${data.location.name}</p>
                              <p>${data.location.country}</p>
                              </p>${data.location.localtime}</p>`;
    currentWeatherIcon.src = `https:${data.current.condition.icon}`;
    CurrentWeatherText.innerHTML = `<div class="p-4 rounded-lg mx-2">
                                    <p>Current: ${data.current.temp_c} °C"</p>
                                    <p">${data.current.condition.text}</p>
                                    <p>Wind: ${data.current.wind_kph} kmph</p>
                                    <p>Humidity: ${data.current.humidity} %</p>
                                    </div>`;

    extendedForecast.innerHTML = data.forecast.forecastday.map(day => `
        <div class="rounded-lg border m-1">
            <div class="pb-1 flex flex-col items-center ">
                <p class="mt-1 font-bold">${day.date}<p>
                <img src="https:${day.day.condition.icon}" alt="weather icon" class="w-16 h-16">
                <!-- <p>Sunrise: ${day.astro.sunrise}<p> -->
                <p>${day.day.avgtemp_c}°C</p>
                <p>${day.day.condition.text} </p>
                <p>Wind: ${day.day.maxwind_kph} kmph</p>
                <p>Humidity: ${day.day.avghumidity} %</p>
            </div>
        </div>`).join('');
}


// Function to show error message
function showError(message) {
    weatherData.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = message;
}


// Fucntion to add city
function addCityToRecent(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    if (!recentCities.includes(city)) {
        if (recentCities.length >= 5) {  // maximum cities in recent will be 5
            recentCities.pop();
        }
        recentCities.unshift(city);  // adding cities
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateRecentCitiesDropdown();
    }
}


// Function to update recent cities dropdown
function updateRecentCitiesDropdown() {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDropdown.innerHTML = '<option value="">Select a recent city </option>'
    recentCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });

    if (recentCities.length === 0) {
        recentCitiesDropdown.classList.add('hidden')
    }
    else {
        recentCitiesDropdown.classList.remove('hidden')
    }
}


// Function to show the loading message
function showLoading() {
    loadingMessage.classList.remove('hidden')
}

// Function to hide the loading message
function hideLoading() {
    loadingMessage.classList.add('hidden')
}


//Updates the recent cities dropdown when the page loads
updateRecentCitiesDropdown();