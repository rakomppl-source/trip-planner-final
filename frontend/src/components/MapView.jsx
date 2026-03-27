import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
      onMapClick?.(event.latlng);
    }
  });

  return null;
};

const MapView = ({ destinations, onMapClick }) => {
  return (
    <MapContainer center={[52.2297, 21.0122]} zoom={5} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
