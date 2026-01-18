import './globals.css'

export const metadata = {
  title: 'Off Market Daily | Off-Market Wholesale Deals',
  description: 'Get exclusive access to off-market wholesale real estate deals in Atlanta, Phoenix, Denver, Charlotte, and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
