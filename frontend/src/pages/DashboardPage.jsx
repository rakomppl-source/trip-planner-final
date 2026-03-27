import { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  createDestination,
  createTrip,
  deleteDestination,
  deleteTrip,
  fetchDestinations,
  fetchTrips
} from "../services/tripService";
import { getWeatherForLocation } from "../services/weatherService";
import { fetchRoute } from "../services/routeService";

const DashboardPage = () => {
  const { clearAuth, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedTripId) || null,
    [trips, selectedTripId]
  );

  const loadTrips = async () => {
    const nextTrips = await fetchTrips();
    setTrips(nextTrips);

    if (nextTrips.length > 0 && !selectedTripId) {
      setSelectedTripId(nextTrips[0].id);
    }

    if (nextTrips.length === 0) {
      setSelectedTripId(null);
      setDestinations([]);
    }
  };

  const loadDestinations = async (tripId) => {
    if (!tripId) {
      setDestinations([]);
      return;
    }

    const nextDestinations = await fetchDestinations(tripId);
    setDestinations(nextDestinations);
  };

  useEffect(() => {
    loadTrips().catch(console.error);
  }, []);

  useEffect(() => {
    loadDestinations(selectedTripId).catch(console.error);
  }, [selectedTripId]);

  useEffect(() => {
    if (destinations.length < 2) {
      setRouteInfo(null);
      return;
    }

    fetchRoute(destinations)
      .then((result) => setRouteInfo(result ? { ...result, error: null } : null))
      .catch((error) => {
        console.error("Błąd pobierania trasy:", error);
        const message =
          error.response?.status === 403
            ? "Nieprawidłowy klucz ORS API."
            : error.response?.status === 400
            ? "Nie można wyznaczyć trasy między wybranymi punktami."
            : "Błąd pobierania trasy.";
        setRouteInfo({ coords: null, distance: null, duration: null, error: message });
      });
  }, [destinations]);

  const handleCreateTrip = async () => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);

    await createTrip({
      nazwa: `Nowa wycieczka ${today.toLocaleDateString()}`,
      data_rozpoczecia: today.toISOString(),
      data_zakonczenia: end.toISOString()
    });

    await loadTrips();
  };

  const handleDeleteTrip = async (tripId) => {
    await deleteTrip(tripId);
    if (tripId === selectedTripId) {
      setSelectedTripId(null);
    }
    await loadTrips();
  };

  const getLocationName = async (lat, lon) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location name");
    }

    const data = await response.json();

    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.name ||
      "Nieznana lokalizacja"
    );
  };

  const handleMapClick = async (latlng) => {
    if (!selectedTripId) {
      return;
    }

    const defaultName = `Punkt ${destinations.length + 1}`;
    let locationName = defaultName;

    try {
      locationName = await getLocationName(latlng.lat, latlng.lng);
    } catch (error) {
      console.error("Failed to reverse geocode destination", error);
    }

    await createDestination(selectedTripId, {
      nazwa_miejsca: locationName,
      latitude: latlng.lat,
      longitude: latlng.lng,
      kolejnosc: destinations.length + 1
    });

    await loadDestinations(selectedTripId);
  };

  const handleDeleteDestination = async (destinationId) => {
    await deleteDestination(destinationId);
    await loadDestinations(selectedTripId);
  };

  const handleAddByAddress = async ({ kraj, miasto, adres }) => {
    if (!selectedTripId) return;

    const parts = [adres, miasto, kraj].filter(Boolean);
    const query = parts.join(", ");

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) throw new Error("Błąd połączenia z serwisem geokodowania.");

    const results = await response.json();
    if (results.length === 0) throw new Error("Nie znaleziono lokalizacji. Sprawdź wpisane dane.");

    const { lat, lon, display_name } = results[0];
    const locationName = miasto || display_name;

    await createDestination(selectedTripId, {
      nazwa_miejsca: locationName,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      kolejnosc: destinations.length + 1,
    });

    await loadDestinations(selectedTripId);
  };

  const handleDestinationClick = async (destination) => {
    const weatherData = await getWeatherForLocation(destination.latitude, destination.longitude);
    setWeather(weatherData);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Planer podróży</p>
          <h1 className="text-lg font-bold text-slate-900">Witaj, {user?.email}</h1>
          {selectedTrip && <p className="text-sm text-slate-600">Aktywna wycieczka: {selectedTrip.nazwa}</p>}
        </div>

        <button
          onClick={clearAuth}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Wyloguj się
        </button>
      </header>

      <main className="flex min-h-0 flex-1">
        <Sidebar
          trips={trips}
          selectedTripId={selectedTripId}
          onSelectTrip={setSelectedTripId}
          onCreateTrip={handleCreateTrip}
          onDeleteTrip={handleDeleteTrip}
          destinations={destinations}
          onDeleteDestination={handleDeleteDestination}
          onDestinationClick={handleDestinationClick}
          weather={weather}
          routeInfo={routeInfo}
          onAddByAddress={handleAddByAddress}
        />

        <section className="flex-1">
          <MapView
            destinations={destinations}
            onMapClick={handleMapClick}
            routeCoords={routeInfo?.coords ?? null}
          />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
