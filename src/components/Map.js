"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

// Component that listens to map movement and updates center
function MapController({ setCenterPos }) {
  const map = useMapEvents({
    moveend: () => {
      setCenterPos(map.getCenter());
    },
  });
  return null;
}

// Search Control
function SearchField() {
  const map = useMapEvents({});
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Search for address or place...'
    });

    map.addControl(searchControl);
    
    // When a search result is found, move the center map pin
    map.on('geosearch/showlocation', function (result) {
      map.setView([result.location.y, result.location.x], 16);
    });

    return () => map.removeControl(searchControl);
  }, [map]);
  
  return null;
}

export default function Map({ initialPosition = [43.651070, -79.347015], onLocationSelect }) {
  const [centerPos, setCenterPos] = useState({ lat: initialPosition[0], lng: initialPosition[1] });
  const [address, setAddress] = useState("Drag map to select location");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://photon.komoot.io/reverse?lon=${centerPos.lng}&lat=${centerPos.lat}`);
        const data = await res.json();
        
        if (data.features && data.features.length > 0) {
          const p = data.features[0].properties;
          let parts = [];
          if (p.housenumber) parts.push(p.housenumber);
          if (p.street) parts.push(p.street);
          if (p.name && p.name !== p.street) parts.push(`(${p.name})`);
          
          let addr = parts.join(" ");
          if (!addr) addr = p.city || p.state || "Unknown location";
          
          setAddress(addr);
          onLocationSelect(addr, centerPos);
        } else {
          setAddress("Unknown location");
        }
      } catch (err) {
        console.error(err);
        setAddress("Error fetching address");
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchAddress, 400);
    return () => clearTimeout(timer);
  }, [centerPos]);

  return (
    <div className="map-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer 
        center={initialPosition} 
        zoom={15} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        <MapController setCenterPos={setCenterPos} />
        <SearchField />
      </MapContainer>
      
      {/* Stationary Center Pin */}
      <div className="center-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="var(--accent)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>

      <div className="map-overlay-address glass-card">
        {loading ? "Locating..." : address}
      </div>
    </div>
  );
}
