const weatherService = require('../services/weatherService');

exports.getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a city name'
      });
    }

    const weatherData = await weatherService.getWeatherByCity(city);
    
    res.status(200).json({
      status: 'success',
      data: weatherData
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both latitude and longitude'
      });
    }

    const weatherData = await weatherService.getWeatherByCoordinates(lat, lon);
    
    res.status(200).json({
      status: 'success',
      data: weatherData
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};