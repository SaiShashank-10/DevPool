import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Rocket, Sparkles, ArrowRight, Code, Shield, Zap, Globe, Target, DollarSign, Eye } from 'lucide-react'
import { blink } from '@/lib/blink'

export const Hero = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <div className="relative pt-40 pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -z-10" />

      {/* Floating Icons Background */}
      <motion.div style={{ y: y1 }} className="absolute top-40 left-[15%] opacity-20 hidden lg:block">
        <div className="p-4 rounded-2xl glass-card rotate-12">
          <Code className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-40 right-[15%] opacity-20 hidden lg:block">
        <div className="p-4 rounded-2xl glass-card -rotate-12">
          <Target className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>AI-Driven Ecosystem for Builders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-heading font-black mb-6 tracking-tighter leading-[0.95]"
          >
            Bridge the Gap <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">Between Reality</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/40 mb-10 max-w-3xl leading-relaxed font-medium"
          >
            DevPool is the first collaborative platform where <span className="text-white/80">AI manages deep focus</span> and elite startups scale with emerging talent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Button 
              size="lg" 
              onClick={() => blink.auth.login(window.location.origin + '/auth-check')}
              className="bg-white text-black hover:bg-white/90 rounded-[2rem] h-16 px-10 text-lg font-bold shadow-[0_0_50px_rgba(255,255,255,0.2)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center">
                Launch Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => blink.auth.login(window.location.origin + '/auth-check')}
              className="rounded-[2rem] h-16 px-10 text-lg font-bold border-white/10 hover:bg-white/5 backdrop-blur-xl"
            >
              Start Learning
            </Button>
          </motion.div>
        </div>

        {/* Floating Visual: Workspace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 relative max-w-6xl mx-auto group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 group-hover:bg-primary/30 transition-colors duration-1000" />
          
          <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/10 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Code size={300} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                    <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                    <div className="h-3 w-4/6 bg-white/5 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-video rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white/10" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 text-center lg:border-l border-white/5">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"
                  />
                  <div className="w-32 h-32 rounded-[2.5rem] bg-black border-2 border-emerald-500/30 flex items-center justify-center relative z-10">
                    <Eye className="w-14 h-14 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase">AI Gaze Detection</p>
                  <p className="text-3xl font-black tabular-nums">98.4%</p>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Focus Stability</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard floating cards */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl border-white/10 hidden xl:block shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40 font-bold uppercase">Bounty Earned</p>
                <p className="text-xl font-bold">$1,250.00</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl border-white/10 hidden xl:block shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40 font-bold uppercase">Network Health</p>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
