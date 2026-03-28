import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
      onMapClick?.(event.latlng);
    }
  });

  return null;
};

const MapView = ({ destinations, onMapClick, routeCoords }) => {
  return (
    <MapContainer center={[52.2297, 21.0122]} zoom={5} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {routeCoords && routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="#2563eb" weight={4} opacity={0.8} />
      )}

      {destinations.map((destination) => (
        <Marker key={destination.id} position={[destination.latitude, destination.longitude]}>
          <Popup>
            <strong>{destination.nazwa_miejsca}</strong>
            <br />
            Kolejność: {destination.kolejnosc}
          </Popup>
        </Marker>
      ))}

      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default MapView;
