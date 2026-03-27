import axios from "axios";

const ORS_BASE_URL = "https://api.openrouteservice.org";

export const fetchRoute = async (destinations) => {
  if (destinations.length < 2) return null;

  const apiKey = import.meta.env.VITE_ORS_API_KEY;
  if (!apiKey) {
    throw new Error("Brak klucza VITE_ORS_API_KEY w pliku .env");
  }

  const coordinates = [...destinations]
    .sort((a, b) => a.kolejnosc - b.kolejnosc)
    .map((d) => [d.longitude, d.latitude]);

  const response = await axios.post(
    `${ORS_BASE_URL}/v2/directions/driving-car/geojson`,
    { coordinates },
    {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  const feature = response.data.features[0];
  const leafletCoords = feature.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  const { distance, duration } = feature.properties.summary;

  return {
    coords: leafletCoords,
    distance,
    duration,
  };
};
