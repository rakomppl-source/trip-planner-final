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
  weather // Zostawiamy to, jeśli na dole nadal chcesz mieć zbiorczą pogodę po kliknięciu
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

      <div className="mt-8">
        <h3 className="font-semibold text-slate-800 border-b pb-2">Punkty podróży</h3>
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