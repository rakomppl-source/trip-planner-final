import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SUB-KOMPONENT: Pojedynczy punkt na liście ---
const DestinationItem = ({ destination, onDestinationClick, onDeleteDestination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
        if (!apiKey) {
          console.error("Brak klucza API OpenWeatherMap!");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${destination.latitude}&lon=${destination.longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania pogody:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination.latitude, destination.longitude]);

  return (
    <li className="flex flex-col rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
      <div className="flex items-center justify-between">
        
        {/* Lewa strona: Dane o lokalizacji */}
        <button
          className="flex-1 text-left"
          onClick={() => onDestinationClick(destination)}
        >
          <p className="font-medium text-slate-800">
            {destination.kolejnosc}. {destination.nazwa_miejsca}
          </p>
          <p className="text-xs text-slate-500">
            {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
          </p>
        </button>

        {/* Prawa strona: Pogoda */}
        <div className="ml-4 flex min-w-[60px] flex-col items-center justify-center rounded-md bg-white p-2 shadow-sm border border-slate-100">
          {loading ? (
            <span className="text-[10px] text-slate-400">...</span>
          ) : weather ? (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="weather icon"
                className="h-8 w-8"
              />
              <span className="text-sm font-bold text-slate-700">
                {Math.round(weather.main.temp)}°C
              </span>
            </>
          ) : (
            <span className="text-[10px] text-red-400">Błąd</span>
          )}
        </div>

      </div>

      {/* Przycisk usuwania */}
      <button
        className="mt-3 w-fit text-xs text-red-500 hover:text-red-700 font-medium"
        onClick={() => onDeleteDestination(destination.id)}
      >
        Usuń punkt
      </button>
    </li>
  );
};

// --- SUB-KOMPONENT: Formularz ręcznego dodawania punktu ---
const AddDestinationForm = ({ onAdd, disabled }) => {
  const [kraj, setKraj] = useState("");
  const [miasto, setMiasto] = useState("");
  const [adres, setAdres] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!miasto.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await onAdd({ kraj: kraj.trim(), miasto: miasto.trim(), adres: adres.trim() });
      setKraj("");
      setMiasto("");
      setAdres("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        placeholder="Kraj (np. Poland)"
        value={kraj}
        onChange={(e) => setKraj(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Miasto *"
        value={miasto}
        onChange={(e) => setMiasto(e.target.value)}
        required
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Adres / ulica (opcjonalnie)"
        value={adres}
        onChange={(e) => setAdres(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={disabled || loading || !miasto.trim()}
        className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Szukam..." : "+ Dodaj punkt"}
      </button>
    </form>
  );
};

const formatDistance = (meters) => (meters / 1000).toFixed(1) + " km";

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} godz. ${m} min`;
  return `${m} min`;
};

// --- GŁÓWNY KOMPONENT: Sidebar ---
const Sidebar = ({
  trips,
  selectedTripId,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
  destinations,
  onDeleteDestination,
  onDestinationClick,
  weather,
  routeInfo,
  onAddByAddress
}) => {
  return (
    <aside className="h-full w-full max-w-md overflow-y-auto border-r border-slate-200 bg-white/95 p-5 shadow-lg z-10">
      <h2 className="text-2xl font-bold text-slate-900">Planer podróży</h2>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-800">Utwórz nową wycieczkę</h3>
        <button
          onClick={onCreateTrip}
          className="mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-500"
        >
          + Dodaj przykładową wycieczkę
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-slate-800 border-b pb-2">Twoje wycieczki</h3>
        <div className="mt-4 space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`rounded-lg border p-3 transition ${
                selectedTripId === trip.id
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <button className="w-full text-left" onClick={() => onSelectTrip(trip.id)}>
                <p className="font-semibold text-slate-800">{trip.nazwa}</p>
              </button>
              <button
                className="mt-2 text-xs font-medium text-red-500 hover:text-red-700"
                onClick={() => onDeleteTrip(trip.id)}
              >
                Usuń wycieczkę
              </button>
            </div>
          ))}
        </div>
      </div>

      {(routeInfo || destinations.length >= 2) && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-800">Podsumowanie trasy</h3>
          {routeInfo?.error ? (
            <p className="mt-2 text-sm text-red-600">{routeInfo.error}</p>
          ) : routeInfo?.distance != null ? (
            <div className="mt-2 flex gap-6">
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide">Dystans</p>
                <p className="text-lg font-bold text-blue-900">{formatDistance(routeInfo.distance)}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide">Czas jazdy</p>
                <p className="text-lg font-bold text-blue-900">{formatDuration(routeInfo.duration)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-blue-500">Obliczanie trasy...</p>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-slate-800 border-b pb-2">Punkty podróży</h3>
        <p className="mt-3 text-xs text-slate-500">Dodaj punkt ręcznie lub kliknij na mapie.</p>
        <AddDestinationForm onAdd={onAddByAddress} disabled={!selectedTripId} />
        <ul className="mt-4 space-y-3">
          {destinations.map((destination) => (
            <DestinationItem
              key={destination.id}
              destination={destination}
              onDestinationClick={onDestinationClick}
              onDeleteDestination={onDeleteDestination}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;