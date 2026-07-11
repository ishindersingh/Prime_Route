"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Calendar, Clock, Truck, Navigation, MessageCircle, Lock, Loader2 } from "lucide-react";
import "../globals.css";

let gunInstance = null;
const getGun = async () => {
  if (typeof window !== "undefined" && !gunInstance) {
    const Gun = (await import('gun')).default;
    gunInstance = Gun(['https://gun-manhattan.herokuapp.com/gun']);
  }
  return gunInstance;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "prime123") {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const db = await getGun();
      if (!db) return;

      // Listen for data coming into 'primeroute_bookings'
      db.get('primeroute_bookings').map().on((booking, id) => {
        if (booking && booking.name) {
          setBookings((prevBookings) => {
            // Check if it already exists in the list to avoid duplicates
            const exists = prevBookings.find((b) => b.id === booking.id);
            if (exists) return prevBookings;
            
            const newBookings = [booking, ...prevBookings];
            // Sort by createdAt descending
            return newBookings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          });
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNavigation = (pickup, dropoff) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`;
    window.open(url, "_blank");
  };

  const openWhatsApp = (booking) => {
    const message = `Hi ${booking.name}, this is PrimeRoute Logistics. We got your booking info for ${booking.date} at ${booking.time}.\n\nYour work will be done safely and securely. Let us know if you have any questions!`;
    const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form app-form-card">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Admin Access</h2>
          <div className="app-input-row">
            <Lock className="input-icon" size={22} />
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{error}</p>}
          <button type="submit" className="btn btn-primary w-100 btn-lg" style={{ borderRadius: 0 }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>PrimeRoute Bookings</h1>
        <button onClick={fetchBookings} className="btn btn-secondary">Refresh</button>
      </header>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No bookings yet</h3>
          </div>
        ) : (
          <div className="admin-grid">
            {bookings.map((booking) => (
              <motion.div 
                key={booking.id} 
                className="admin-booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-card-header">
                  <h3>{booking.name}</h3>
                  <span className="badge-new">New</span>
                </div>
                
                <div className="admin-card-body">
                  <p><Phone size={16} /> {booking.phone}</p>
                  <p><Calendar size={16} /> {booking.date} at {booking.time}</p>
                  <p><Truck size={16} /> {booking.service}</p>
                  
                  <div className="route-box">
                    <div className="route-point">
                      <div className="dot pickup-dot"></div>
                      <p>{booking.pickup}</p>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point">
                      <div className="dot dropoff-dot"></div>
                      <p>{booking.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="admin-card-actions">
                  <button 
                    onClick={() => openNavigation(booking.pickup, booking.dropoff)}
                    className="action-btn nav-btn"
                  >
                    <Navigation size={18} /> Navigate
                  </button>
                  <button 
                    onClick={() => openWhatsApp(booking)}
                    className="action-btn wa-btn"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
