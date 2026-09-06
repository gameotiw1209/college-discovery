import Link from 'next/link'
import GlitterWrap from '@/components/glitterwrap'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <GlitterWrap />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center justify-between px-10 py-6 max-w-6xl mx-auto">
          <span className="font-heading text-2xl font-bold tracking-tight">
            findCollege
          </span>
          <div className="flex items-center gap-16 font-heading">
            <Link
              href="/colleges"
              className="px-6 py-2 rounded-full border border-white/20 text-sm tracking-wide hover:border-white/50 transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="px-6 py-2 rounded-full border border-white/20 text-sm tracking-wide hover:border-white/50 transition-colors"
            >
              Compare
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="font-serif text-5xl md:text-6xl leading-tight max-w-2xl">
          Discover, compare, and choose the right college
        </h1>
        <p className="font-handwritten mt-6 text-white/70 max-w-md text-xl">
          Browse colleges, see what they offer, and compare your options with ease.
        </p>

        <Link
          href="/"
          className="font-heading mt-10 px-8 py-3 rounded-full border border-white/30 text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}