'use client';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [markets, setMarkets] = useState([]);
  const [otherMarket, setOtherMarket] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allMarkets = [
    'Arizona',
    'Florida', 
    'Georgia',
    'North Carolina',
    'South Carolina',
    'Texas',
    'Colorado'
  ];

  const toggleMarket = (market) => {
    if (markets.includes(market)) {
      setMarkets(markets.filter(m => m !== market));
    } else {
      setMarkets([...markets, market]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // TODO: Connect to GHL webhook
    await new Promise(r => setTimeout(r, 1000));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fff'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>
            Off Market Daily
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#markets" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Markets</a>
          <a href="#about" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>About</a>
          <a 
            href="#signup"
            style={{ 
              backgroundColor: '#00b894', 
              color: '#fff', 
              padding: '10px 20px', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Get Deal Alerts
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 40px 100px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '52px',
          fontWeight: '800',
          color: '#1e293b',
          lineHeight: '1.1',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          First Access to<br/>
          <span style={{ color: '#00b894' }}>Off-Market Deals</span>
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px'
        }}>
          Investment properties across 7 states. Delivered before they hit the open market.
        </p>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          marginBottom: '48px'
        }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e' }}>Hundreds</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Deals Sent Monthly</div>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e' }}>7</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Active Markets</div>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e' }}>First Look</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Before Open Market</div>
          </div>
        </div>

        {/* Signup Form */}
        <div id="signup" style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          margin: '0 auto',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', fontWeight: '500', letterSpacing: '0.5px' }}>
            GET DEALS BEFORE THEY HIT THE MARKET
          </div>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#00b894', marginBottom: '8px' }}>
                You're on the list
              </div>
              <div style={{ color: '#64748b' }}>
                We'll send you deals as they come in.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '10px', textAlign: 'left' }}>
                  Which markets?
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allMarkets.map((market) => (
                    <button
                      key={market}
                      type="button"
                      onClick={() => toggleMarket(market)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '13px',
                        cursor: 'pointer',
                        backgroundColor: markets.includes(market) ? '#00b894' : '#e2e8f0',
                        color: markets.includes(market) ? '#fff' : '#475569',
                        fontWeight: '500',
                        transition: 'all 0.15s'
                      }}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#1a1a2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {submitting ? 'Joining...' : 'Join the Buyer List'}
              </button>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '12px' }}>
                Free. Unsubscribe anytime.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" style={{
        padding: '80px 40px',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Active Markets
          </h2>
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '48px',
            fontSize: '16px'
          }}>
            Deals coming in from these states every week
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px'
          }}>
            {[
              { state: 'Arizona', cities: 'Phoenix · Mesa · Tucson' },
              { state: 'Florida', cities: 'Tampa · Orlando · Miami' },
              { state: 'Georgia', cities: 'Atlanta · Macon · Snellville' },
              { state: 'North Carolina', cities: 'Charlotte · Greensboro' },
              { state: 'South Carolina', cities: 'Columbia · Charleston' },
              { state: 'Texas', cities: 'Dallas · Austin · San Antonio' },
              { state: 'Colorado', cities: 'Denver · Colorado Springs' }
            ].map((market) => (
              <div 
                key={market.state}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '20px 28px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  minWidth: '200px'
                }}
              >
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px', marginBottom: '4px' }}>
                  {market.state}
                </div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>
                  {market.cities}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: '80px 40px',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            What is Off Market Daily?
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '18px',
            lineHeight: '1.8',
            marginBottom: '24px'
          }}>
            Off Market Daily is a deal flow platform for serious investors. We deliver vetted investment opportunities before they hit the open market — directly to your phone.
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            lineHeight: '1.8'
          }}>
            No MLS listings. No bidding wars. Just off-market properties with real upside, sent to buyers who move fast.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: '#1a1a2e',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '16px'
          }}>
            Ready to see deals?
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '32px',
            fontSize: '16px'
          }}>
            Join thousands of investors getting off-market deals monthly.
          </p>
          <a 
            href="#signup"
            style={{
              display: 'inline-block',
              backgroundColor: '#00b894',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Join the Buyer List
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
              Off Market Daily
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>
            © 2026 Off Market Daily
          </div>
        </div>
      </footer>
    </div>
  );
}
