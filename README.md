# 🌍 Trip Planner

Projekt nowoczesnego planera podróży. Aplikacja pozwala na interaktywne planowanie tras na mapie, automatyczne rozpoznawanie nazw miejscowości oraz sprawdzanie prognozy pogody.

## 🚀 Technologie
* **Frontend:** React + Vite, Leaflet (Mapy), Tailwind CSS
* **Backend:** Node.js + Express
* **Baza danych:** PostgreSQL (Docker) + Prisma ORM
* **API zewnętrzne:** Nominatim (OpenStreetMap), OpenWeatherMap

## 🛠️ Instrukcja instalacji (Quick Start)

Aby uruchomić projekt lokalnie, wykonaj poniższe kroki w podanej kolejności.

### Wymagania
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Klucz API do [OpenWeatherMap](https://openweathermap.org/api) (darmowa rejestracja)

### 1. Pobranie projektu
```bash
git clone https://github.com/rakomppl-source/trip-planner-final.git
cd trip-planner-final
```

### 2. Baza danych (Docker)
```bash
docker-compose up -d
```

### 3. Backend
```bash
cd backend

# Skopiuj plik zmiennych środowiskowych
cp .env.example .env

# Zainstaluj zależności
npm install

# Wygeneruj klienta Prisma i zastosuj migracje
npm run prisma:generate
npm run prisma:migrate

# Uruchom serwer deweloperski
npm run dev
```
Backend działa na `http://localhost:4000`.

### 4. Frontend
W nowym terminalu:
```bash
cd frontend

# Skopiuj plik zmiennych środowiskowych
cp .env.example .env
# Otwórz frontend/.env i ustaw swój klucz API:
# VITE_OPENWEATHERMAP_API_KEY=twoj_klucz_api

# Zainstaluj zależności
npm install

# Uruchom aplikację
npm run dev
```
Frontend działa na `http://localhost:5173`.

> **Uwaga:** Jeśli pojawia się błąd autoryzacji do bazy danych, uruchom `docker-compose down -v` a następnie ponownie `docker-compose up -d`, aby usunąć stary wolumin i odtworzyć bazę od nowa.
