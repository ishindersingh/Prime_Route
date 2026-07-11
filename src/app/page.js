"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Truck, DollarSign, UserCheck, Clock, Shield, 
  Home, Monitor, Moon, ShoppingBag, Archive, Box, Key, Layers,
  Check, CheckCircle, MapPin, Star, ChevronDown, Phone, Mail, MessageCircle, Calendar, User
} from "lucide-react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const libraries = ["places"];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [bookingStatus, setBookingStatus] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus("loading");
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("bookName"),
      phone: formData.get("bookPhone"),
      date: formData.get("bookDate"),
      time: formData.get("bookTime"),
      pickup: pickupLocation || formData.get("bookPickupFallback"),
      dropoff: dropoffLocation || formData.get("bookDropoffFallback"),
      service: formData.get("bookService"),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setBookingStatus("success");
        e.target.reset();
        setPickupLocation("");
        setDropoffLocation("");
        alert("Your work will be done, we got your info in our backend!");
      } else {
        setBookingStatus("error");
      }
    } catch (err) {
      console.error(err);
      setBookingStatus("error");
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : "glass-effect"}`}>
        <div className="container nav-content">
          <a href="#" className="logo">
            <Truck className="logo-icon" size={24} />
            <span className="logo-text">PrimeRoute<span className="logo-accent">Logistics</span></span>
          </a>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#book">Book</a>
            <a href="#why-us">Why Us</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <a href="#book" className="btn btn-primary">Book Now</a>
          </div>
          <button
            className={`hamburger ${mobileMenuOpen ? 'menu-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`ham-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`ham-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`ham-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay fade-in visible">
          <div className="mobile-overlay-content">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#book" onClick={() => setMobileMenuOpen(false)}>Book</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)}>Why Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a href="#book" className="btn btn-primary mobile-book-btn" onClick={() => setMobileMenuOpen(false)}>Book Now</a>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-bg">
            <Image 
              src="/images/premium_hero.jpg" 
              alt="Premium Silver Moving Van in Downtown Toronto" 
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="hero-overlay"></div>
          </div>
          
          <div className="hero-bottom-sheet">
            <div className="container hero-content-center">
              <motion.div 
                className="hero-text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="hero-badge">PrimeRoute Logistics</div>
                <h1 className="hero-title-massive">
                  Moving Made <br/><span className="text-gradient">Simple.</span>
                </h1>
                <p className="hero-subtitle-large">Premium local moving across the GTA.<br/>Transparent pricing. No hidden fees.</p>
                
                <div className="hero-quick-book glass-card hover-lift">
                  <div className="quick-book-inputs">
                    <div className="qb-input">
                      <MapPin size={20} className="text-accent" />
                      <input type="text" placeholder="Pickup location" />
                    </div>
                    <div className="qb-divider"></div>
                    <div className="qb-input">
                      <MapPin size={20} className="text-accent" />
                      <input type="text" placeholder="Drop-off location" />
                    </div>
                    <a href="#book" className="btn btn-primary qb-btn">Get Quote</a>
                  </div>
                </div>
                
                <div className="hero-trust">
                  <div className="trust-item"><CheckCircle size={18} className="text-accent" /> Fully Insured</div>
                  <div className="trust-item"><CheckCircle size={18} className="text-accent" /> Same-Day Available</div>
                  <div className="trust-item"><CheckCircle size={18} className="text-accent" /> 5-Star Rated</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section bg-light">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">Everything you need for a smooth and stress-free move.</p>
            </motion.div>
            
            <motion.div 
              className="services-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { 
                  icon: Layers, 
                  title: "Condo & Apartment Moves",
                  desc: "We are experts at navigating tricky service elevators, tight hallways, and strict concierge loading dock schedules in Toronto."
                },
                { 
                  icon: ShoppingBag, 
                  title: "Marketplace & Kijiji Pickups",
                  desc: "Found the perfect couch but it won't fit in your car? We offer rapid, same-day delivery for local furniture purchases."
                },
                { 
                  icon: Monitor, 
                  title: "Office Relocations",
                  desc: "Careful and efficient transport of desks, monitors, and sensitive office equipment so your team experiences minimal downtime."
                },
                { 
                  icon: Archive, 
                  title: "Storage Unit Transfers",
                  desc: "Whether you're downsizing or storing seasonal items, we pack your storage unit efficiently to maximize every square foot."
                },
                { 
                  icon: Box, 
                  title: "Packing & Unpacking",
                  desc: "Save hours of stress. Our team will meticulously pack your belongings with high-quality supplies and unpack them at your destination."
                },
                { 
                  icon: Shield, 
                  title: "Specialty Item Transport",
                  desc: "From delicate artwork to heavy fitness equipment, we have the specialized straps and expertise to move your most precious items safely."
                }
              ].map((item, idx) => (
                <motion.div key={idx} className="service-card glass-card hover-lift" variants={fadeInUp}>
                  <div className="icon-wrapper"><item.icon size={28} /></div>
                  <h3>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">Transparent Pricing</h2>
              <p className="section-subtitle">No hidden fees. Premium service at competitive rates.</p>
            </motion.div>

            <motion.div 
              className="pricing-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="pricing-card glass-card hover-lift" variants={fadeInUp}>
                <div className="pricing-header">
                  <h3>Local Pickup</h3>
                  <p className="price">Starting at <span>$60</span></p>
                </div>
                <ul className="pricing-features">
                  <li><Check size={20} /> Up to 10 km distance</li>
                  <li><Check size={20} /> Curb-to-curb delivery</li>
                  <li><Check size={20} /> Ideal for Kijiji/Marketplace</li>
                </ul>
                <a href="#book" className="btn btn-outline w-100">Select Plan</a>
              </motion.div>

              <motion.div className="pricing-card glass-card hover-lift popular" variants={fadeInUp}>
                <div className="popular-badge">Most Popular</div>
                <div className="pricing-header">
                  <h3>Van + Driver</h3>
                  <p className="price"><span>$80</span>/hr</p>
                </div>
                <ul className="pricing-features">
                  <li><Check size={20} /> Professional driver</li>
                  <li><Check size={20} /> Spacious moving van</li>
                  <li><Check size={20} /> Blankets & straps included</li>
                </ul>
                <a href="#book" className="btn btn-primary w-100">Select Plan</a>
              </motion.div>

              <motion.div className="pricing-card glass-card hover-lift" variants={fadeInUp}>
                <div className="pricing-header">
                  <h3>Van + Helper</h3>
                  <p className="price"><span>$110</span>/hr</p>
                </div>
                <ul className="pricing-features">
                  <li><Check size={20} /> Full moving assistance</li>
                  <li><Check size={20} /> Loading & unloading</li>
                  <li><Check size={20} /> Heavy lifting handled</li>
                </ul>
                <a href="#book" className="btn btn-outline w-100">Select Plan</a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="why-us" className="section bg-light">
          <div className="container">
            <motion.div 
              className="why-us-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="why-us-text" variants={fadeInUp}>
                <h2 className="section-title text-left">Navigating the GTA shouldn't be your headache.</h2>
                <p className="section-subtitle text-left">Traffic on the 401, finding parking downtown, navigating condo elevators—we handle the heavy lifting. PrimeRoute brings precision, care, and full transparency to every move.</p>
                
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon"><CheckCircle size={24} /></div>
                    <div>
                      <h4>Fully Equipped Vans</h4>
                      <p>Blankets, straps, and dollies always included to secure your items.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon"><CheckCircle size={24} /></div>
                    <div>
                      <h4>Straightforward Pricing</h4>
                      <p>Our hourly rates start when we arrive. No truck fees, no gas surcharges.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon"><CheckCircle size={24} /></div>
                    <div>
                      <h4>Condo Move Specialists</h4>
                      <p>We know how to work with concierges, loading docks, and tight elevator bookings.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon"><CheckCircle size={24} /></div>
                    <div>
                      <h4>Same-Day Dispatch</h4>
                      <p>Last minute Kijiji find? We often have drivers available for immediate pickup.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div className="why-us-visual glass-card image-placeholder-container" variants={fadeInUp}>
                <Image 
                  src="/images/Mover_carrying_flat-screen_TV_2K_202607111434.jpeg" 
                  alt="Mover carefully carrying a TV" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="placeholder-img"
                />
                <div className="stats floating-stats">
                  <div className="stat-item">
                    <h3>Toronto</h3>
                    <p>Locally Owned</p>
                  </div>
                  <div className="stat-item">
                    <h3>4.9/5</h3>
                    <p>Google Reviews</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Service Areas */}
        <section id="areas" className="section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">Areas We Serve</h2>
              <p className="section-subtitle">Covering the Greater Toronto Area with speed and reliability.</p>
            </motion.div>

            <motion.div 
              className="areas-map-container glass-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.2793132715975!2d-79.38535182312642!3d43.64761407110263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34cd53c662dd%3A0xc61ab08f6d2e6ab4!2sDowntown%20Toronto%2C%20ON!5e0!3m2!1sen!2sca!4v1689254000000!5m2!1sen!2sca" 
                className="map-iframe"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="map-overlay"></div>
              <div className="area-tags">
                <span className="glass-tag"><MapPin size={18} /> Toronto</span>
                <span className="glass-tag"><MapPin size={18} /> Brampton</span>
                <span className="glass-tag"><MapPin size={18} /> Mississauga</span>
                <span className="glass-tag"><MapPin size={18} /> Etobicoke</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section bg-light">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">What Our Clients Say</h2>
            </motion.div>
            
            <motion.div 
              className="testimonials-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { 
                  text: "The most seamless moving experience I've ever had. The driver was exactly on time and incredibly professional. Highly recommended!",
                  initials: "SJ", name: "Sarah Jenkins", loc: "Toronto", bg: "#e0e7ff", color: "#3730a3"
                },
                { 
                  text: "I found a great West Elm sofa on Marketplace but it wouldn't fit in my SUV. PrimeRoute picked it up from Liberty Village and brought it to Mississauga within two hours.",
                  initials: "MC", name: "Michael Chen", loc: "Mississauga", bg: "#ffedd5", color: "#9a3412"
                },
                { 
                  text: "The crew was fantastic. They safely wrapped my vintage credenza and navigated the tight corners of my old Victorian apartment without a scratch. Truly transparent hourly pricing.",
                  initials: "DL", name: "David Lee", loc: "Toronto", bg: "#dcfce7", color: "#166534"
                }
              ].map((review, idx) => (
                <motion.div key={idx} className="testimonial-card glass-card hover-lift" variants={fadeInUp}>
                  <div className="stars">
                    <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <div className="reviewer">
                    <div className="avatar" style={{ backgroundColor: review.bg, color: review.color }}>{review.initials}</div>
                    <div className="reviewer-info">
                      <h4>{review.name}</h4>
                      <p>{review.loc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="book" className="section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">Book Your Move</h2>
              <p className="section-subtitle">Secure your date instantly. We'll confirm the details with you via WhatsApp.</p>
            </motion.div>
            
            <motion.div 
              className="booking-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <form onSubmit={handleBooking} className="app-booking-form">
                <div className="app-form-card">
                  <div className="app-input-row">
                    <User className="input-icon" size={22} />
                    <input type="text" id="bookName" name="bookName" placeholder="Your Name" required />
                  </div>
                  <div className="app-input-row">
                    <Phone className="input-icon" size={22} />
                    <input type="tel" id="bookPhone" name="bookPhone" placeholder="Your Phone Number" required />
                  </div>
                  <div className="app-input-row">
                    <Calendar className="input-icon" size={22} />
                    <input type="date" id="bookDate" name="bookDate" required aria-label="Date" />
                  </div>
                  <div className="app-input-row">
                    <Clock className="input-icon" size={22} />
                    <input type="time" id="bookTime" name="bookTime" required aria-label="Preferred Time" />
                  </div>
                  <div className="app-input-row">
                    <MapPin className="input-icon" size={22} />
                    {isLoaded && GOOGLE_MAPS_API_KEY ? (
                      <Autocomplete onPlaceChanged={() => {}} className="w-100">
                        <input type="text" placeholder="Pickup Address (e.g. 100 Queen St W)" required onChange={(e) => setPickupLocation(e.target.value)} />
                      </Autocomplete>
                    ) : (
                      <input type="text" name="bookPickupFallback" placeholder="Pickup Address" required onChange={(e) => setPickupLocation(e.target.value)} />
                    )}
                  </div>
                  <div className="app-input-row">
                    <MapPin className="input-icon" size={22} />
                    {isLoaded && GOOGLE_MAPS_API_KEY ? (
                      <Autocomplete onPlaceChanged={() => {}} className="w-100">
                        <input type="text" placeholder="Drop-off Address" required onChange={(e) => setDropoffLocation(e.target.value)} />
                      </Autocomplete>
                    ) : (
                      <input type="text" name="bookDropoffFallback" placeholder="Drop-off Address" required onChange={(e) => setDropoffLocation(e.target.value)} />
                    )}
                  </div>
                  <div className="app-input-row select-row">
                    <Truck className="input-icon" size={22} />
                    <select id="bookService" name="bookService" defaultValue="" required aria-label="Service Needed">
                      <option value="" disabled>Select a service</option>
                      <option value="Local Pickup (Starting at $60)">Local Pickup (Starting at $60)</option>
                      <option value="Van + Driver ($80/hr)">Van + Driver ($80/hr)</option>
                      <option value="Van + Driver + Helper ($110/hr)">Van + Driver + Helper ($110/hr)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-whatsapp w-100 btn-lg">
                  <MessageCircle size={22} /> Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section bg-light">
          <div className="container">
            <motion.div 
              className="section-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="section-title">Frequently Asked Questions</h2>
            </motion.div>
            
            <motion.div 
              className="faq-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { q: "Do you provide moving supplies?", a: "We provide moving blankets and straps to secure your items during transit. If you need boxes or packing materials, please let us know in advance." },
                { q: "Is there a minimum hourly charge?", a: "Yes, we have a 2-hour minimum charge for our hourly moving services to cover travel and dispatch costs." },
                { q: "Can I ride in the van?", a: "For liability reasons, passengers are not permitted in the moving van. You will need to arrange your own transportation to the destination." }
              ].map((faq, idx) => (
                <motion.div key={idx} className={`faq-item glass-card ${activeFaq === idx ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} variants={fadeInUp}>
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    <ChevronDown className="faq-icon" size={20} />
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="section">
          <div className="container">
            <motion.div 
              className="contact-cta glass-card hover-lift"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="cta-content">
                <h2>Ready to Move?</h2>
                <p>Get in touch today for a stress-free moving experience.</p>
                <div className="contact-info">
                  <div className="contact-method">
                    <Phone size={24} />
                    <span>306-501-3800</span>
                  </div>
                  <div className="contact-method">
                    <Mail size={24} />
                    <span>quotes@primeroute.ca</span>
                  </div>
                </div>
                <div className="cta-actions">
                  <a href="tel:3065013800" className="btn btn-secondary btn-lg">Call Us Now</a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <a href="#" className="logo">
              <Truck className="logo-icon" size={24} />
              <span className="logo-text">PrimeRoute<span className="logo-accent">Logistics</span></span>
            </a>
            <p>Professional Local Moving Services in the Greater Toronto Area.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 PrimeRoute Logistics. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
