import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Instrument_Serif, Indie_Flower } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-handwritten',
})

export const metadata: Metadata = {
  title: 'findCollege',
  description: 'Find, compare, and choose the right college.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} ${indieFlower.variable} font-sans bg-black text-white`}
      >
        {children}
      </body>
    </html>
  )
}