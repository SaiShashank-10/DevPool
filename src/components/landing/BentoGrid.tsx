import { motion } from 'framer-motion'
import { Eye, Users, Shield, Zap, Target, BarChart3, Globe } from 'lucide-react'

const features = [
  {
    title: "AI Focus Monitor",
    description: "Our intelligent gaze detection ensures you stay in the zone during deep work sessions.",
    icon: Eye,
    className: "md:col-span-2",
    color: "bg-blue-500/10 text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Smart Escrow",
    description: "Secured payments for every milestone achieved.",
    icon: Shield,
    className: "md:col-span-1",
    color: "bg-emerald-500/10 text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Team Sentiment",
    description: "Monitor team health and morale in real-time.",
    icon: BarChart3,
    className: "md:col-span-1",
    color: "bg-amber-500/10 text-amber-400",
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    title: "Real-time Collab",
    description: "Seamlessly work together with integrated chat and code visualizers.",
    icon: Users,
    className: "md:col-span-1",
    color: "bg-purple-500/10 text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Global Network",
    description: "Connect with a world-wide community of founders and learners.",
    icon: Globe,
    className: "md:col-span-1",
    color: "bg-cyan-500/10 text-cyan-400",
    gradient: "from-cyan-500/20 to-blue-500/20"
  }
]

export const BentoGrid = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Everything You Need <br /> To Build The Future</h2>
          <p className="text-white/50 max-w-xl mx-auto">Advanced tools powered by AI to help you manage, collaborate, and scale your projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-card rounded-3xl p-8 flex flex-col justify-between group relative overflow-hidden ${feature.className}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-white/40 group-hover:text-white/60 transition-colors line-clamp-3 leading-relaxed">{feature.description}</p>
                </div>
                
                <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest">
                  Learn more <Zap className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
