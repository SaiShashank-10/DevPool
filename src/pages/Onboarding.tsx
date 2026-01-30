import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from '@/lib/blink'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Layout, Users, Github, Briefcase, Zap, Rocket, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const Onboarding = () => {
  const { user } = useBlinkAuth()
  const { setProfile } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'founder' | 'learner' | null>(null)
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    githubUrl: '',
    skills: '',
    companyName: '',
    fundingStage: 'Pre-seed',
    energyLevel: 'Medium',
    bio: '',
    twitterUrl: ''
  })

  const handleComplete = async () => {
    if (!user) return

    try {
      const profileData = {
        id: user.id,
        user_id: user.id,
        display_name: formData.displayName,
        role: role,
        github_url: formData.githubUrl,
        skills: formData.skills,
        company_name: formData.companyName,
        funding_stage: formData.fundingStage,
        energy_level: formData.energyLevel,
        bio: formData.bio,
        twitter_url: formData.twitterUrl,
        focus_score: 85 // Initial mock score
      }

      await blink.db.users.create(profileData as any)
      setProfile(profileData as any)
      toast.success('Welcome to DevPool!')
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create profile')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <div className="w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50"
                >
                  <Rocket className="w-3 h-3" />
                  Step 1: Choose Your Path
                </motion.div>
                <h1 className="text-5xl font-heading font-bold tracking-tight">How will you <span className="text-primary italic">DevPool</span>?</h1>
                <p className="text-white/50 text-lg max-w-md mx-auto">Select the role that best defines your journey on the platform.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRole('founder'); setStep(2); }}
                  className={`glass-card p-10 rounded-[2.5rem] flex flex-col items-center gap-6 group transition-all duration-500 ${role === 'founder' ? 'ring-2 ring-primary bg-primary/10 shadow-2xl shadow-primary/20' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${role === 'founder' ? 'bg-primary text-white' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <Rocket className="w-10 h-10" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Founder</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Launch projects, hire emerging talent, and scale your vision.</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRole('learner'); setStep(2); }}
                  className={`glass-card p-10 rounded-[2.5rem] flex flex-col items-center gap-6 group transition-all duration-500 ${role === 'learner' ? 'ring-2 ring-primary bg-primary/10 shadow-2xl shadow-primary/20' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${role === 'learner' ? 'bg-primary text-white' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <Zap className="w-10 h-10" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Learner</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Join real startups, build your portfolio, and earn rewards.</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card p-10 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                {role === 'founder' ? <Rocket size={200} /> : <Zap size={200} />}
              </div>

              <div className="space-y-2 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 mb-2">
                  Step 2: Core Details
                </div>
                <h2 className="text-3xl font-bold">Tell us about {role === 'founder' ? 'your company' : 'your skills'}</h2>
                <p className="text-white/40">These details help us match you with the right opportunities.</p>
              </div>

              <div className="space-y-5 relative">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Public Name</Label>
                  <Input 
                    value={formData.displayName} 
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g. Alex Chen"
                    className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-primary/50 transition-all"
                  />
                </div>

                {role === 'learner' ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <Input 
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                          placeholder="github.com/alexchen"
                          className="bg-white/5 border-white/10 rounded-2xl h-14 pl-14 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Primary Skills</Label>
                      <Input 
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        placeholder="React, Next.js, TypeScript..."
                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 transition-all"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Company Name</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <Input 
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          placeholder="DevPool Inc."
                          className="bg-white/5 border-white/10 rounded-2xl h-14 pl-14 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Funding Stage</Label>
                      <select 
                        value={formData.fundingStage}
                        onChange={(e) => setFormData({...formData, fundingStage: e.target.value})}
                        className="w-full bg-white/5 border-white/10 rounded-2xl h-14 px-5 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="Pre-seed">Pre-seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Series B+">Series B+</option>
                        <option value="Bootstrapped">Bootstrapped</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-4 relative">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-2xl h-14 text-white/60 hover:text-white hover:bg-white/5">Back</Button>
                <Button onClick={() => setStep(3)} className="flex-[2] bg-white text-black hover:bg-white/90 rounded-2xl h-14 font-bold shadow-xl">
                  Next Step
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card p-10 rounded-[3rem] space-y-8 shadow-2xl"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 mb-2">
                  Final Step: Personalization
                </div>
                <h2 className="text-3xl font-bold">Almost there!</h2>
                <p className="text-white/40">Add a bit of personality to your profile.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Bio / Intro</Label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about your background or what you're building..."
                    className="w-full bg-white/5 border-white/10 rounded-2xl h-32 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Twitter / X Handle</Label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 font-medium text-lg">@</span>
                    <Input 
                      value={formData.twitterUrl}
                      onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
                      placeholder="username"
                      className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Energy Level (Availability)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({...formData, energyLevel: level})}
                        className={`py-3 rounded-xl border text-sm transition-all ${formData.energyLevel === level ? 'bg-primary border-primary text-white font-bold shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 rounded-2xl h-14 text-white/60 hover:text-white hover:bg-white/5">Back</Button>
                <Button onClick={handleComplete} className="flex-[2] bg-white text-black hover:bg-white/90 rounded-2xl h-14 font-bold shadow-xl">
                  Finish Setup
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
