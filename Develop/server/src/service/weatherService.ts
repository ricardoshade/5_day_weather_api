import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

if (!API_BASE_URL || !API_KEY) {
  throw new Error('Missing API_BASE_URL or API_KEY in environment variables');
}

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public temperature: number,
    public description: string,
    public forecast: { date: string; temp: number; description: string }[]
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  
  static async getWeatherForCity(city: string) {
    try {
        if (!city) {
            throw new Error('City name is required');
        }

        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}`;

        const response = await axios.get(url);

        return response.data; 
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}
  
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.API_KEY || '';

  private async fetchLocationData(city: string): Promise<Coordinates | null> {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
      );
      if (response.data.length === 0) return null;
      return { lat: response.data[0].lat, lon: response.data[0].lon };
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  async getWeatherForCity(city: string): Promise<Weather | null> {
    const coordinates = await this.fetchLocationData(city);
    if (!coordinates) return null;

    const weatherData = await this.fetchWeatherData(coordinates);
    if (!weatherData) return null;

    const currentWeather = weatherData.list[0]; // First item is current weather
    const forecast = weatherData.list.slice(1, 6).map((item: any) => ({
      date: item.dt_txt,
      temp: item.main.temp,
      description: item.weather[0].description,
    }));

    return new Weather(
      city,
      currentWeather.main.temp,
      currentWeather.weather[0].description,
      forecast
    );
  }
}

export default new WeatherService();
