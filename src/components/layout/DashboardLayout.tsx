import { motion } from 'framer-motion'
import { Layout, Briefcase, MessageSquare, Target, Wallet, Bell, LogOut, ChevronLeft, ChevronRight, Menu, Search, Settings, HelpCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { blink } from '@/lib/blink'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navItems = useMemo(() => [
    { icon: Layout, label: 'Overview', path: '/dashboard' },
    { icon: Briefcase, label: profile?.role === 'founder' ? 'My Projects' : 'Projects', path: '/marketplace' },
    { icon: MessageSquare, label: 'Workspace', path: '/chat' },
    { icon: Target, label: 'Focus Mode', path: '/focus' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ], [profile?.role])

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 84 : 280 }}
        className="relative border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-30 transition-all duration-500 ease-in-out"
      >
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-lg shadow-white/10"
          >
            <Layout className="w-6 h-6 text-black" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-heading font-bold tracking-tight text-white">DevPool</span>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium leading-none">Ecosystem</span>
            </motion.div>
          )}
        </div>

        <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-4 rounded-xl h-12 transition-all group relative overflow-hidden ${location.pathname === item.path ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'} ${isCollapsed ? 'px-0 justify-center' : ''}`}
                >
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-primary' : ''}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-4">
          {!isCollapsed && profile?.role === 'learner' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl space-y-4 bg-white/5 border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Focus Level</p>
                  <p className="text-xl font-bold text-white">{profile?.focusScore}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.focusScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
              </div>
            </motion.div>
          )}
          
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-4 rounded-xl h-12 text-white/40 hover:text-white hover:bg-white/5 group ${isCollapsed ? 'px-0 justify-center' : ''}`}
            >
              <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {!isCollapsed && <span>Help Center</span>}
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-4 rounded-xl h-12 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 group ${isCollapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => { blink.auth.logout(); navigate('/'); }}
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center border border-white/10 shadow-xl hover:scale-125 transition-all z-40 active:scale-90"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-10 z-20">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <Input 
                placeholder="Search projects, members, tasks..." 
                className="bg-white/5 border-white/5 rounded-2xl h-11 pl-11 w-full focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/30 hidden md:block">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-white/40 hover:text-white hover:bg-white/5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
              </Button>
            </div>
            
            <div className="h-8 w-px bg-white/10" />
            
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/settings')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{profile?.displayName}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${profile?.role === 'founder' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{profile?.role}</p>
                </div>
              </div>
              <div className="relative">
                <Avatar className="w-11 h-11 border-2 border-white/5 group-hover:border-primary/50 transition-all duration-500 p-1 bg-gradient-to-br from-white/10 to-transparent">
                  <AvatarFallback className="bg-white/5 text-white">{profile?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-10 max-w-[1600px] mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
