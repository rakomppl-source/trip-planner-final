import axios from "axios";

const NOMINATIM_BASE_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org";

// Template for Nominatim integration in the place search bar.
export const searchPlaces = async (query) => {
  if (!query) {
    return [];
  }

  const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
    params: {
      q: query,
      format: "json",
      addressdetails: 1,
      limit: 5
    }
  });

  return response.data;
};
