import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/landing/Hero'
import { BentoGrid } from '@/components/landing/BentoGrid'
import { LiveTicker } from '@/components/landing/LiveTicker'
import { motion } from 'framer-motion'

export const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Navbar />
      <main>
        <Hero />
        <LiveTicker />
        <BentoGrid />
        
        {/* Simple Footer Placeholder */}
        <footer className="py-20 border-t border-white/5 bg-black/50">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold">DevPool</span>
              <span className="text-white/20">© 2026</span>
            </div>
            <div className="flex gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </motion.div>
  )
}
