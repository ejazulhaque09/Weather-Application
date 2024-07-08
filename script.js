const apiKey = 'c05fb24f435f452baba50023240607';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const weatherData = document.getElementById('weatherData');
const locationName = document.getElementById('LocationName');
const currentWeatherIcon = document.getElementById('CurrentWeatherIcon');
const CurrentWeatherText = document.getElementById('currentWeatherText');
const extendedForecast = document.getElementById('extendedForecast');
const errorMessage = document.getElementById('errorMessage');


searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeatherDataByCity(cityName);
    }
    else {
        showError('Please enter a city name.')
    }
});

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


function fetchWeatherDataByCity(city) {

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => showError('Failed to fetch weather data.'))
}

function fetchWeatherDataByCoordinates(latitude, longitude) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => showError('Failed to fetch weather data. '))
}

function displayWeatherData(data) {
    weatherData.classList.remove('hidden'); // Displaying the weather Data
    errorMessage.classList.add('hidden'); // Removing the error message

    locationName.textContent = `${data.location.name}, ${data.location.country}`;
    currentWeatherIcon.src = `https:${data.current.condition.icon}`;
    CurrentWeatherText.textContent = `Current: ${data.current.temp_c}°C,${data.current.condition.text}`;

    extendedForecast.innerHTML = data.forecast.forecastday.map(day => `
        <div class="p-4 bg-grey-100 rounded-lg shadow-md">
            <div class="flex flex-col items-center">
                <img src="https:${day.day.condition.icon}" alt="weather icon" class="w-16 h-16">
                <p class="mt-2">${day.date}<p>
                <p>${day.day.avgtemp_c}°C, ${day.day.condition.text} </p>
                <p>Wind: ${day.day.maxwind_kph} kmph</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
            </div>
        </div>`).join('');
}

function showError(message){
    weatherData.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = message;
}

