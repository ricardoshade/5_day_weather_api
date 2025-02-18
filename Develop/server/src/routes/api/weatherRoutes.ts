import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const city = req.body.cityName;
    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);
  console.log("Weather Data from API:", weatherData); // For debugging
    if (!weatherData) {
      return res.status(404).json({ error: "Weather data not found" });
    }
  // TODO: save city to search history
  await historyService.addCity(city);
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" }); // Ensure return in catch block
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getHistory();
    return res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await historyService.removeCity(id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found in history' });
    }
    return res.json({ message: 'City removed from history' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
