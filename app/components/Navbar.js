'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from './Logo'

const navLinks = [
  { href: '/market', label: 'Market' },
  { href: '/predictions', label: 'Predictions' },
  { href: '/creators', label: 'Creators' },
  { href: '/feed', label: 'Feed' },
]

const bottomTabIcons = {
  '/': { icon: '◈', label: 'Home' },
  '/market': { icon: '▦', label: 'Market' },
  '/predictions': { icon: '◎', label: 'Predictions' },
  '/creators': { icon: '◉', label: 'Creators' },
  '/feed': { icon: '⚡', label: 'Feed' },
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen])

  // Determine if a link is active
  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Left: Logo + Brand */}
          <Link href="/" className="nav-logo">
            <div className="logo-wrapper">
              <Logo size={32} />
            </div>
            <span className="nav-brand-text">OFF MARKET DAILY</span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="nav-menu">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: LIVE Badge + CTA + Mobile Toggle */}
          <div className="nav-right">
            <div className="live-badge">
              <span className="pulse-dot"></span>
              <span>LIVE</span>
            </div>
            <Link href="/#subscribe" className="nav-cta">
              GET INTEL
            </Link>

            {/* Mobile Hamburger */}
            <button
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Mobile Nav Links */}
            <nav className="mobile-nav-menu">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-link ${isActive(link.href) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile LIVE Badge + CTA */}
            <div className="mobile-nav-footer">
              <div className="live-badge">
                <span className="pulse-dot"></span>
                <span>LIVE</span>
              </div>
              <Link href="/#subscribe" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>
                GET INTEL
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Mobile Tab Bar */}
      <div className="bottom-tab-bar">
        <Link href="/" className={`bottom-tab ${isActive('/') ? 'active' : ''}`} title="Home">
          <div className="bottom-tab-icon">◈</div>
          <div className="bottom-tab-label">Home</div>
        </Link>
        <Link href="/market" className={`bottom-tab ${isActive('/market') ? 'active' : ''}`} title="Market">
          <div className="bottom-tab-icon">▦</div>
          <div className="bottom-tab-label">Market</div>
        </Link>
        <Link href="/predictions" className={`bottom-tab ${isActive('/predictions') ? 'active' : ''}`} title="Predictions">
          <div className="bottom-tab-icon">◎</div>
          <div className="bottom-tab-label">Predictions</div>
        </Link>
        <Link href="/creators" className={`bottom-tab ${isActive('/creators') ? 'active' : ''}`} title="Creators">
          <div className="bottom-tab-icon">◉</div>
          <div className="bottom-tab-label">Creators</div>
        </Link>
        <Link href="/feed" className={`bottom-tab ${isActive('/feed') ? 'active' : ''}`} title="Feed">
          <div className="bottom-tab-icon">⚡</div>
          <div className="bottom-tab-label">Feed</div>
        </Link>
      </div>
    </>
  )
}
