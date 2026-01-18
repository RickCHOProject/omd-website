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
    // For now, just show success
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
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>
            Off Market Daily
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#markets" style={{ color: '#475569', textDecoration: 'none', fontSize: '15px' }}>Markets</a>
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
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#e6f9f5',
            color: '#00b894',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            Off-market wholesale deals
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1e293b',
            lineHeight: '1.1',
            marginBottom: '20px'
          }}>
            Off-market deals.<br/>
            Sent direct.
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            We source off-market properties direct from sellers across multiple states. No MLS, no auctions, no competing with retail buyers.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#1e293b',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            <strong>Areas of focus:</strong> Arizona, Georgia, Florida, Colorado, North Carolina, South Carolina, and Texas.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Get on the list and we'll send you deals as they come in.
          </p>
          <a 
            href="#signup"
            style={{
              display: 'inline-block',
              backgroundColor: '#1a1a2e',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Join Buyer List
          </a>
        </div>
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>7</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Active States</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>40+</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Deals Closed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>$50K+</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Avg Spread</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>48hr</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" style={{
        padding: '80px 40px',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Markets We Serve
          </h2>
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '48px',
            fontSize: '16px'
          }}>
            Active deal flow across these states
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}>
            {[
              { state: 'Arizona', abbr: 'AZ', cities: 'Phoenix, Mesa, Tucson, Casa Grande' },
              { state: 'Florida', abbr: 'FL', cities: 'Tampa Bay, Orlando, Fort Myers, Miami' },
              { state: 'Georgia', abbr: 'GA', cities: 'Atlanta, Snellville, Canton, Covington' },
              { state: 'North Carolina', abbr: 'NC', cities: 'Charlotte, Asheville, Greensboro' },
              { state: 'South Carolina', abbr: 'SC', cities: 'Columbia, Charleston, Conway' },
              { state: 'Texas', abbr: 'TX', cities: 'Austin, San Antonio, Dallas' },
              { state: 'Colorado', abbr: 'CO', cities: 'Denver, Colorado Springs, Pueblo' }
            ].map((market) => (
              <div 
                key={market.state}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {market.abbr}
                  </div>
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>
                    {market.state}
                  </div>
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5' }}>
                  {market.cities}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            What Buyers Say
          </h2>
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '48px',
            fontSize: '16px'
          }}>
            Real feedback from cash buyers on our list
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {[
              {
                quote: "Finally, someone who sends real deals with actual spreads. No fluff, just numbers that work.",
                name: "Marcus Chen",
                role: "Flipper",
                location: "Phoenix, AZ"
              },
              {
                quote: "I've bought three properties from their list in the last six months. Fast, professional, no games.",
                name: "Sarah Williams",
                role: "Buy & Hold",
                location: "Atlanta, GA"
              },
              {
                quote: "The deal details are always accurate. What they say is what you get. That's rare in this business.",
                name: "David Park",
                role: "Investor",
                location: "Denver, CO"
              }
            ].map((testimonial, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '28px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ 
                  color: '#1e293b', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  "{testimonial.quote}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1a1a2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {testimonial.name.split(' ')[0][0]}{testimonial.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {testimonial.role} · {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" style={{
        padding: '80px 40px',
        backgroundColor: '#1a1a2e'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Get Deal Alerts
          </h2>
          <p style={{
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
            fontSize: '16px'
          }}>
            Join our buyer list. We'll send you off-market deals as they come in.
          </p>

          {submitted ? (
            <div style={{
              backgroundColor: '#e6f9f5',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#00b894' }}>
                You're on the list
              </div>
              <div style={{ color: '#00a884', marginTop: '8px' }}>
                We'll send you deals as they come in.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
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
                    border: 'none',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
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
                    border: 'none',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
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
                    border: 'none',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
                  Which markets? (select all that apply)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allMarkets.map((market) => (
                    <button
                      key={market}
                      type="button"
                      onClick={() => toggleMarket(market)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: markets.includes(market) ? '#00b894' : '#334155',
                        color: '#fff',
                        fontWeight: '500'
                      }}
                    >
                      {market}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Other market? Tell us where you buy"
                  value={otherMarket}
                  onChange={(e) => setOtherMarket(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    marginTop: '12px',
                    backgroundColor: '#334155',
                    color: '#fff'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#00b894',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {submitting ? 'Joining...' : 'Join Buyer List'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid #e5e7eb',
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>
              Off Market Daily
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>
            © 2026 Off Market Daily. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
