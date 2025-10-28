import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default marker icon paths for TypeScript safely
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });

    map.on("locationfound", (e: L.LocationEvent) => {
      setPosition(e.latlng);
    });

    map.on("locationerror", () => {
      alert("Location access denied. Showing default area.");
      map.setView([20.5937, 78.9629], 5); // Default India center
    });
  }, [map]);

  return position ? (
    <Marker position={position}>
      <Popup>You are here 🧭</Popup>
    </Marker>
  ) : null;
}

export default function LiveMap() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}