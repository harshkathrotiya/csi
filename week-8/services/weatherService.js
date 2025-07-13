const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeatherByCity(city) {
    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const { main, weather, name } = response.data;
      
      return {
        city: name,
        temperature: main.temp,
        description: weather[0].description,
        humidity: main.humidity,
        feelsLike: main.feels_like
      };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const { main, weather, name } = response.data;
      
      return {
        city: name,
        temperature: main.temp,
        description: weather[0].description,
        humidity: main.humidity,
        feelsLike: main.feels_like
      };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch weather data');
    }
  }
}

module.exports = new WeatherService();