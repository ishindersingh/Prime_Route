"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Calendar, Clock, Truck, Navigation, MessageCircle, Lock, Loader2, CheckCircle, Trash2, BarChart, DollarSign, Package } from "lucide-react";
import "../globals.css";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, pending, completed

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
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(bookings.filter(b => b.id !== id));
      } else {
        alert("Failed to delete booking");
      }
    } catch (err) {
      console.error("Failed to delete booking", err);
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

  const filteredBookings = bookings.filter(b => {
    const s = b.status || "Pending";
    if (activeTab === "pending") {
      return s !== "Delivered";
    } else if (activeTab === "completed") {
      return s === "Delivered";
    }
    return true; // For overview, we handle data differently
  });

  // Analytics Calculations
  const totalOrders = bookings.length;
  const completedOrders = bookings.filter(b => b.status === "Delivered").length;
  const activeOrders = totalOrders - completedOrders;
  
  // Estimate revenue based on service base price
  const estimatedRevenue = bookings.reduce((sum, b) => {
    if (b.service.includes("$60")) return sum + 60;
    if (b.service.includes("$80")) return sum + 80;
    if (b.service.includes("$110")) return sum + 110;
    return sum + 60; // default base fallback
  }, 0);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>PrimeRoute Bookings</h1>
        <button onClick={fetchBookings} className="btn btn-secondary">Refresh</button>
      </header>

      <div className="admin-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} /> Overview
        </button>
        <button 
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pending')}
        >
          <Truck size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} /> Active Bookings
        </button>
        <button 
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} /> History
        </button>
      </div>

      <div className="container" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          </div>
        ) : activeTab === 'overview' ? (
          <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
              <Package size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</p>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', margin: 0 }}>{totalOrders}</h2>
            </div>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
              <Truck size={32} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Orders</p>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)', margin: 0 }}>{activeOrders}</h2>
            </div>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
              <CheckCircle size={32} color="#25D366" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</p>
              <h2 style={{ fontSize: '2.5rem', color: '#25D366', margin: 0 }}>{completedOrders}</h2>
            </div>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'white' }}>
              <DollarSign size={32} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Est. Revenue</p>
              <h2 style={{ fontSize: '2.5rem', color: '#f59e0b', margin: 0 }}>${estimatedRevenue}</h2>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No bookings yet</h3>
          </div>
        ) : (
          <div className="admin-grid">
            {filteredBookings.map((booking) => (
              <motion.div 
                key={booking.id} 
                className="admin-booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-card-header">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: 0 }}>{booking.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.25rem' }}>{booking.trackingId}</span>
                  </div>
                  
                  <select 
                    value={booking.status || "Pending"} 
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                    style={{ 
                      padding: '0.5rem', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border)', 
                      background: booking.status === "Delivered" ? '#e6f4ea' : '#f8fafc',
                      color: booking.status === "Delivered" ? '#1e8e3e' : 'var(--text-dark)',
                      fontWeight: '600',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="On the Way">On the Way</option>
                    <option value="Just Dropped">Just Dropped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                
                <div className="admin-card-body">
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <p style={{ flex: 1, minWidth: '150px' }}><Phone size={16} /> Sender: {booking.phone}</p>
                    {booking.receiverPhone && booking.receiverPhone !== booking.phone && (
                      <p style={{ flex: 1, minWidth: '150px', color: 'var(--accent)' }}><Phone size={16} /> Receiver: {booking.receiverPhone}</p>
                    )}
                  </div>
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
                  {booking.addressDetails && (
                    <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem', borderLeft: '3px solid var(--primary)' }}>
                      <strong>Details:</strong> {booking.addressDetails}
                    </div>
                  )}
                </div>

                  <div className="admin-card-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openNavigation(booking.pickup, booking.dropoff)}
                      className="action-btn nav-btn"
                      style={{ flex: 1 }}
                    >
                      <Navigation size={18} /> Navigate
                    </button>
                    <button 
                      onClick={() => openWhatsApp(booking)}
                      className="action-btn wa-btn"
                      style={{ flex: 1 }}
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </button>
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="action-btn"
                      style={{ flex: '0 0 auto', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                      title="Delete Order"
                    >
                      <Trash2 size={18} />
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
