import axios from "axios";

const OPEN_WEATHER_BASE_URL =
  import.meta.env.VITE_OPENWEATHERMAP_BASE_URL || "https://api.openweathermap.org/data/2.5";

// Template for OpenWeatherMap integration after selecting a destination.
export const getWeatherForLocation = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return { message: "Brakuje VITE_OPENWEATHERMAP_API_KEY w pliku .env" };
  }

  const response = await axios.get(`${OPEN_WEATHER_BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units: "metric"
    }
  });

  return response.data;
};
