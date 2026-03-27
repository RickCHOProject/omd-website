import './globals.css'
import './nav.css'
import Navbar from './components/Navbar'
import BootScreen from './components/BootScreen'

export const metadata = {
  title: 'Off Market Daily | AI-Powered Real Estate Intelligence',
  description: 'AI-driven real estate intelligence platform. Public predictions, creator credibility tracking, and market data — all pressure-tested against real data.',
  keywords: 'real estate intelligence, market predictions, housing data, creator credibility, off market',
  openGraph: {
    title: 'Off Market Daily | AI-Powered RE Intelligence',
    description: 'Public predictions. Public accountability. Every claim pressure-tested against real market data.',
    type: 'website',
    url: 'https://offmarketdaily.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off Market Daily | AI-Powered RE Intelligence',
    description: 'Public predictions. Public accountability. Every claim pressure-tested against real market data.',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://offmarketdaily.com',
  },
}

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Off Market Daily",
    "description": "AI-powered real estate intelligence platform with public predictions, creator credibility tracking, and market data analysis.",
    "url": "https://offmarketdaily.com",
    "serviceType": "Real Estate Intelligence Platform"
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Navbar />
        <BootScreen>
          {children}
        </BootScreen>
      </body>
    </html>
  )
}
