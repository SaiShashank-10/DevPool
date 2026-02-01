import { Navbar } from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Zap, Target, Award, Code, GraduationCap, DollarSign, ArrowRight, Star } from 'lucide-react'
import { blink } from '@/lib/blink'

export const LearnersLanding = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1400px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
          
          <div className="container mx-auto px-4 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60"
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>For Emerging Developers</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-[1.1]"
            >
              Turn Your Skills Into <br />
              <span className="text-primary italic">Real Experience</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/40 max-w-2xl mx-auto font-medium"
            >
              Skip the tutorials. Join real startup teams, build production code, and get paid while building your ultimate career portfolio.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button 
                size="lg"
                onClick={() => blink.auth.login()}
                className="bg-white text-black hover:bg-white/90 rounded-full h-16 px-10 text-lg font-bold shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-24 border-y border-white/5 bg-black/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8 text-primary" />,
                  title: "Learn by Doing",
                  description: "Work on real feature requests and bug fixes in actual startup codebases."
                },
                {
                  icon: <Target className="w-8 h-8 text-primary" />,
                  title: "Focus-First UI",
                  description: "Our AI Focus Room helps you stay in the zone and maximize your productivity."
                },
                {
                  icon: <DollarSign className="w-8 h-8 text-primary" />,
                  title: "Get Paid",
                  description: "Earn bounties in stablecoins or fiat for every milestone you successfully complete."
                }
              ].map((prop, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-10 rounded-[2.5rem] border-white/10 hover:border-primary/20 transition-all group"
                >
                  <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
                    {prop.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{prop.title}</h3>
                  <p className="text-white/40 leading-relaxed">{prop.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learner Perks */}
        <section className="py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">More than just <span className="text-primary italic">freelancing</span>.</h2>
                <div className="space-y-6">
                  {[
                    "Gamified leveling system based on focus & quality",
                    "Personalized career roadmaps from AI matching",
                    "Direct mentorship from startup technical leads",
                    "A verified GitHub-linked portfolio of real work"
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg text-white/60">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="glass-card rounded-[3rem] p-1 w-full aspect-video overflow-hidden border-white/10 bg-gradient-to-br from-white/10 to-transparent">
                  <div className="w-full h-full bg-black/40 rounded-[2.8rem] flex items-center justify-center">
                    <Code className="w-20 h-20 text-white/10" />
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl border-white/10 shadow-2xl animate-pulse">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                       <Award size={20} />
                     </div>
                     <div>
                       <p className="text-xs text-white/40 font-bold uppercase">Reputation</p>
                       <p className="text-lg font-bold">Lvl 42 Architect</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-4 text-center text-white/20 text-sm">
          © 2026 DevPool. Built for Learners.
        </div>
      </footer>
    </div>
  )
}
