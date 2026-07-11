"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, CheckCircle, Package, MapPin, Search } from "lucide-react";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [trackingData, setTrackingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/track?id=${trackingId.toUpperCase()}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Tracking ID not found. Please verify and try again.");
        throw new Error("Unable to fetch tracking data.");
      }
      
      const data = await res.json();
      setTrackingData(data);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  // Status mapping
  const stages = ["Pending", "On the Way", "Just Dropped", "Delivered"];
  const currentStageIndex = trackingData ? stages.indexOf(trackingData.status) : -1;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '800px', flex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          style={{ marginBottom: '3rem' }}
        >
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>Track Your Delivery</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Enter your PrimeRoute Tracking ID below to see the latest updates.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
              <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="e.g. PR-123456" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem', border: '1px solid var(--border)', borderRadius: '12px', outline: 'none' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === "loading"} style={{ padding: '0 2rem', borderRadius: '12px' }}>
              {status === "loading" ? "Searching..." : "Track Package"}
            </button>
          </form>

          {status === "error" && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {status === "success" && trackingData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: '3rem' }}
            >
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</p>
                    <h2 style={{ color: 'var(--primary)', margin: 0 }}>{trackingData.trackingId}</h2>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}><strong>Service:</strong> {trackingData.service}</p>
                  </div>
                </div>

                {/* Progress Bar Timeline */}
                <div style={{ position: 'relative', padding: '2rem 0', margin: '2rem 0' }}>
                  {/* Background Line */}
                  <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '4px', background: '#e2e8f0', transform: 'translateY(-50%)', borderRadius: '2px', zIndex: 0 }}></div>
                  
                  {/* Active Line */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '0', 
                    width: `${Math.max(0, currentStageIndex) * (100 / (stages.length - 1))}%`, 
                    height: '4px', background: 'var(--accent)', transform: 'translateY(-50%)', 
                    borderRadius: '2px', zIndex: 1, transition: 'width 0.5s ease-in-out' 
                  }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    {stages.map((stage, idx) => {
                      const isActive = idx <= currentStageIndex;
                      return (
                        <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '25%' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            background: isActive ? 'var(--accent)' : 'white', 
                            border: `3px solid ${isActive ? 'var(--accent)' : '#cbd5e1'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isActive ? 'white' : '#cbd5e1',
                            transition: 'all 0.3s ease'
                          }}>
                            {idx === 0 && <Package size={20} />}
                            {idx === 1 && <Truck size={20} />}
                            {idx === 2 && <MapPin size={20} />}
                            {idx === 3 && <CheckCircle size={20} />}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: isActive ? '600' : '400', color: isActive ? 'var(--text-dark)' : 'var(--text-muted)', textAlign: 'center' }}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Route Details */}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pickup</p>
                    <p style={{ color: 'var(--text-dark)', fontWeight: '500', margin: 0 }}>{trackingData.pickup}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Scheduled: {trackingData.date} at {trackingData.time}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '250px', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Drop-off</p>
                    <p style={{ color: 'var(--text-dark)', fontWeight: '500', margin: 0 }}>{trackingData.dropoff}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
