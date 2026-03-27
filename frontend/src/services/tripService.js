import api from "../api/axios";

export const fetchTrips = async () => {
  const response = await api.get("/trips");
  return response.data;
};

export const createTrip = async (payload) => {
  const response = await api.post("/trips", payload);
  return response.data;
};

export const deleteTrip = async (tripId) => {
  await api.delete(`/trips/${tripId}`);
};

export const fetchDestinations = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/destinations`);
  return response.data;
};

export const createDestination = async (tripId, payload) => {
  const response = await api.post(`/trips/${tripId}/destinations`, payload);
  return response.data;
};

export const deleteDestination = async (destinationId) => {
  await api.delete(`/destinations/${destinationId}`);
};
