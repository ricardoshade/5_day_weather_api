import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('http://localhost:3001/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const rawResponse = await response.text();
    console.log('Raw API Response:', rawResponse); // Log response before parsing

    const weatherData = JSON.parse(rawResponse);
    console.log('Parsed Weather Data:', weatherData);

    if (!weatherData || weatherData.cod !== "200") {
      alert('No weather data found for this city.');
      return;
    }

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error fetching weather:', error);
    alert('Failed to fetch weather. Please try again later.');
  }
};



const fetchSearchHistory = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/weather/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    const historyData = await response.json();
    console.log('Search History:', historyData); // Debugging log

    return historyData;
  } catch (error) {
    console.error(error);
    return [];
  }
};


const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  if (!currentWeather) return;
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');

  tempEl.textContent = `Temperature: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  todayContainer.innerHTML = '';
  todayContainer.append(heading, weatherIcon, tempEl, windEl, humidityEl);
};


// const renderCurrentWeather = (currentWeather: any): void => {
//   if (!currentWeather) {
//     console.error('No current weather data available');
//     return;
//   }
//   const { city, date, icon, iconDescription, tempF, windSpeed, humidity } =
//     currentWeather;

    

//   if (!heading || !weatherIcon || !tempEl || !windEl || !humidityEl) {
//     console.error('One or more DOM elements are missing');
//     return;
//   }
//   // convert the following to typescript

//   heading.textContent = `${city} (${date})`;
//   weatherIcon.setAttribute(
//     'src',
//     `https://openweathermap.org/img/w/${icon}.png`
//   );
//   weatherIcon.setAttribute('alt', iconDescription);
//   weatherIcon.setAttribute('class', 'weather-img');
//   heading.append(weatherIcon);
//   tempEl.textContent = `Temp: ${tempF}°F`;
//   windEl.textContent = `Wind: ${windSpeed} MPH`;
//   humidityEl.textContent = `Humidity: ${humidity} %`;

//   if (todayContainer) {
//     todayContainer.innerHTML = '';
//     todayContainer.append(heading, tempEl, windEl, humidityEl);
//   } else {
//     console.error('todayContainer is missing in the DOM');
//   }
// };


const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  for (let i = 0; i < forecast.length; i++) {
    renderForecastCard(forecast[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: any) => {
  const historyList = await searchHistory;

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = historyList.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(historyList[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const saveSearchToHistory = (city: string) => {
  let searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  if (!searches.includes(city)) {
    searches.push(city);
    if (searches.length > 5) searches.shift(); // Keep only last 5 searches
    localStorage.setItem('searchHistory', JSON.stringify(searches));
  }
};

const renderLocalSearchHistory = () => {
  if (!searchHistoryContainer) return;

  searchHistoryContainer.innerHTML = '';
  const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');

  searches.forEach((city: string) => {
    const btn = createHistoryButton(city);
    searchHistoryContainer.appendChild(btn);
  });
};

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();
  const search = searchInput.value.trim();

  if (!search) {
    alert('City cannot be blank');
    return;
  }

  fetchWeather(search).then(() => {
    saveSearchToHistory(search);
    renderLocalSearchHistory();
  });

  searchInput.value = ''; // Clears input field after search
};

// Run on page load
renderLocalSearchHistory();


const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
