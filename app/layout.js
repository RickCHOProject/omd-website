import './globals.css'
import Link from 'next/link'
import './nav.css'

export const metadata = {
  title: 'Off Market Daily | AI-Powered Real Estate Intelligence Platform',
  description: 'AI-driven real estate intelligence platform with market data dashboards, prediction engine, and creator credibility tracking.',
  keywords: 'off market properties, real estate data, market analysis, investment intelligence',
  openGraph: {
    title: 'Off Market Daily | AI-Powered RE Intelligence',
    description: 'Real estate intelligence platform with market data, predictions, and creator analysis.',
    type: 'website',
    url: 'https://offmarketdaily.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off Market Daily | AI-Powered RE Intelligence',
    description: 'Real estate intelligence platform with market data, predictions, and creator analysis.',
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
    "description": "Off Market Daily is a deal flow platform that sends off market investment properties directly to real estate investors. Properties include BRRRR deals, rental properties, and fix & flip opportunities across Arizona, Georgia, Florida, Texas, Colorado, North Carolina, and South Carolina.",
    "url": "https://offmarketdaily.com",
    "areaServed": [
      "Arizona", "Georgia", "Florida", "Texas", "Colorado", "North Carolina", "South Carolina"
    ],
    "serviceType": "Off Market Real Estate Deals"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Off Market Daily?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Off Market Daily is a deal flow platform that sends off market investment properties directly to real estate investors. We source properties across Arizona, Georgia, Florida, Texas, Colorado, North Carolina, and South Carolina — delivering deals with real margins for BRRRR, rentals, and fix & flip strategies."
        }
      },
      {
        "@type": "Question",
        "name": "What are off market properties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Off market properties are real estate deals that are not listed on the MLS or public marketplaces. These properties often come with built-in equity and better margins because they are sourced directly before reaching the open market."
        }
      },
      {
        "@type": "Question",
        "name": "Who is Off Market Daily for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Off Market Daily is for cash buyers, real estate investors, BRRRR investors, rental property buyers, and fix & flip operators looking for investment properties with real margins."
        }
      },
      {
        "@type": "Question",
        "name": "What states do you have off market deals in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently source off market properties in Arizona, Georgia, Florida, Texas, Colorado, North Carolina, and South Carolina."
        }
      },
      {
        "@type": "Question",
        "name": "Is it free to join Off Market Daily?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, joining the Off Market Daily buyer list is completely free. You will receive off market investment properties sent directly to you as they become available in your selected markets."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      </head>
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              OMD
            </Link>
            <div className="nav-menu">
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/predictions" className="nav-link">
                Predictions
              </Link>
              <Link href="/creators" className="nav-link">
                Creators
              </Link>
              <Link href="/feed" className="nav-link">
                Feed
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
