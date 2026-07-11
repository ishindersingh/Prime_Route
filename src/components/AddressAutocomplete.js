"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export default function AddressAutocomplete({ placeholder, name, required, value, onChange, onSelectLocation }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (!query || query.length < 3 || !isOpen) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Restrict search to Canada using bounding box (bbox=minLon,minLat,maxLon,maxLat)
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&bbox=-142,41,-52,84`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        
        if (data.features) {
          const formattedSuggestions = data.features.map(f => {
            const p = f.properties;
            let parts = [];
            
            if (p.name && p.name !== p.street) parts.push(p.name);
            
            let streetPart = "";
            if (p.housenumber) streetPart += p.housenumber + " ";
            if (p.street) streetPart += p.street;
            if (streetPart) parts.push(streetPart.trim());
            
            if (p.city) parts.push(p.city);
            if (p.state) parts.push(p.state);
            
            const addressString = parts.join(", ");
            // Geometry coordinates are [lon, lat]
            const coords = f.geometry && f.geometry.coordinates 
              ? [f.geometry.coordinates[1], f.geometry.coordinates[0]] // Convert to [lat, lon]
              : null;
              
            return { address: addressString, coords };
          }).filter(s => s.address); // remove empties

          // Remove duplicates based on address string
          const unique = [];
          const seen = new Set();
          for (const item of formattedSuggestions) {
            if (!seen.has(item.address)) {
              seen.add(item.address);
              unique.push(item);
            }
          }
          setSuggestions(unique);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.address);
    setIsOpen(false);
    if (onChange) {
      onChange(suggestion.address);
    }
    if (onSelectLocation && suggestion.coords) {
      onSelectLocation(suggestion.coords);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (query.length >= 3) setIsOpen(true); }}
        autoComplete="off"
      />
      
      {isOpen && (suggestions.length > 0 || loading) && (
        <ul className="autocomplete-dropdown">
          {loading && <li className="autocomplete-loading">Searching...</li>}
          {!loading && suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              className="autocomplete-item"
              onClick={() => handleSelect(suggestion)}
            >
              <MapPin size={16} className="text-muted" style={{ marginRight: '8px', flexShrink: 0, marginTop: '2px' }} />
              <span>{suggestion.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
