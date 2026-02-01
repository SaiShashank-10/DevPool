import { motion } from 'framer-motion'
import { Layout, Search, User, LogIn, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from '@/lib/blink'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useBlinkAuth()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Layout className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight">DevPool</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/explore" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Explore Projects</Link>
          <Link to="/founders" className="text-sm font-medium text-white/70 hover:text-white transition-colors">For Founders</Link>
          <Link to="/learners" className="text-sm font-medium text-white/70 hover:text-white transition-colors">For Learners</Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/dashboard">
                <Layout className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="hidden md:flex" onClick={() => blink.auth.login(window.location.origin + '/auth-check')}>
                Log in
              </Button>
              <Button 
                onClick={() => blink.auth.login(window.location.origin + '/auth-check')}
                className="bg-white text-black hover:bg-white/90 rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                Join DevPool
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
