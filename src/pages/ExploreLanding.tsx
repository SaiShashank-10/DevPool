import { Navbar } from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Globe, Search, Filter, Rocket, Zap, Sparkles, ArrowRight, Briefcase } from 'lucide-react'
import { blink } from '@/lib/blink'

export const ExploreLanding = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
          
          <div className="container mx-auto px-4 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Explore the Ecosystem</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-[1.1]"
            >
              Discover Your Next <br />
              <span className="text-primary italic">Big Breakthrough</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/40 max-w-2xl mx-auto font-medium"
            >
              A curated marketplace of real-world projects from verified startups. Filter by stack, bounty, and difficulty to find your perfect match.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button 
                size="lg"
                onClick={() => window.location.href = '/marketplace'}
                className="bg-white text-black hover:bg-white/90 rounded-full h-16 px-10 text-lg font-bold shadow-xl"
              >
                Browse All Projects
                <Search className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 border-y border-white/5 bg-black/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-primary" />,
                  title: "AI Matching",
                  description: "Projects ranked by your unique skill profile."
                },
                {
                  icon: <Briefcase className="w-6 h-6 text-primary" />,
                  title: "Verified Teams",
                  description: "Every founder is vetted for legitimacy."
                },
                {
                  icon: <Filter className="w-6 h-6 text-primary" />,
                  title: "Advanced Filters",
                  description: "Find exactly what you're looking for."
                },
                {
                  icon: <Zap className="w-6 h-6 text-primary" />,
                  title: "Instant Bounties",
                  description: "Transparent pay scales for every task."
                }
              ].map((prop, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-3xl border-white/10 hover:border-primary/20 transition-all"
                >
                  <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">
                    {prop.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                  <p className="text-white/40 text-sm">{prop.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-heading font-bold">Project <span className="text-primary italic">Hotspots</span></h2>
                <p className="text-white/40">The most active sectors in our ecosystem right now.</p>
              </div>
              <Button variant="ghost" className="text-primary font-bold group">
                View All Categories
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "AI & Machine Learning", count: "142 Projects", color: "bg-blue-500" },
                { label: "Fintech & Web3", count: "89 Projects", color: "bg-emerald-500" },
                { label: "SaaS & Productivity", count: "256 Projects", color: "bg-purple-500" }
              ].map((cat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="glass-card p-1 rounded-[2.5rem] border-white/10 group cursor-pointer"
                >
                  <div className="bg-white/5 rounded-[2.3rem] p-8 space-y-4 group-hover:bg-white/10 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl ${cat.color}/20 flex items-center justify-center`}>
                      <Rocket className={`w-6 h-6 ${cat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{cat.label}</h3>
                      <p className="text-white/40 font-medium">{cat.count}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-4 text-center text-white/20 text-sm">
          © 2026 DevPool. Explore the Future.
        </div>
      </footer>
    </div>
  )
}
