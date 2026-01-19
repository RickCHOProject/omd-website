import './globals.css'

export const metadata = {
  title: 'Off Market Properties for Investors | BRRRR, Rentals & Flips | 7 States',
  description: 'Get first access to off market investment properties across Arizona, Georgia, Florida, Texas, Colorado & more. Real margins for BRRRR, rentals, and fix & flip deals. Join free.',
  keywords: 'off market properties, off market deals, investment properties, BRRRR properties, rental properties for sale, fix and flip deals, real estate investors, Arizona investment properties, Georgia investment properties, Florida investment properties, Texas investment properties, Colorado investment properties',
  openGraph: {
    title: 'Off Market Investment Properties | 7 States | Join Free',
    description: 'First access to off market properties with real margins. BRRRR, rentals, and flip deals across AZ, GA, FL, TX, CO, NC, SC.',
    type: 'website',
    url: 'https://offmarketdaily.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off Market Investment Properties | Join Free',
    description: 'First access to off market deals with real margins. BRRRR, rentals, flips across 7 states.',
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
      <body>{children}</body>
    </html>
  )
}
