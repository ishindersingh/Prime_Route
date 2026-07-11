"use client";

import dynamic from 'next/dynamic';
import { X, Check } from 'lucide-react';
import { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';

// Dynamically import the map to avoid Next.js SSR "window is not defined" issues
const Map = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading Map...</p>
    </div>
  ) 
});

export default function MapPickerModal({ isOpen, onClose, onConfirm, title }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <div className="map-modal-header">
          <h3>{title || "Select Location"}</h3>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>
        
        <div className="map-modal-body" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'white', position: 'relative', zIndex: 2000 }}>
            <AddressAutocomplete 
              name="mapSearch" 
              placeholder="Search address or place..." 
              value=""
              onChange={() => {}}
              onSelectLocation={(coords) => setMapCenter(coords)}
            />
          </div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <Map onLocationSelect={(addr) => setSelectedAddress(addr)} centerTo={mapCenter} />
          </div>
        </div>
        
        <div className="map-modal-footer">
          <button 
            className="btn btn-primary w-100" 
            onClick={() => {
              if (selectedAddress && selectedAddress !== "Unknown location" && selectedAddress !== "Locating...") {
                onConfirm(selectedAddress);
              }
            }}
            disabled={!selectedAddress || selectedAddress === "Unknown location" || selectedAddress === "Locating..."}
          >
            <Check size={20} style={{ marginRight: '8px' }} />
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
