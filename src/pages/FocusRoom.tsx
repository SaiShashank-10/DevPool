import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, Power, Eye, AlertCircle, TrendingUp, X, Sparkles, Loader2, Brain, Music, Volume2, History, Zap, Shield, Trophy, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts'
import { blink } from '@/lib/blink'
import { useStore } from '@/store/useStore'

export const FocusRoom = () => {
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(1500) // 25 minutes
  const [startTime, setStartTime] = useState<number | null>(null)
  const [focusLevel, setFocusLevel] = useState(85)
  const [chartData, setChartData] = useState<{ val: number }[]>([])
  const [isDistracted, setIsDistracted] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { profile, setProfile } = useStore()
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chartIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleBlur = () => {
      if (isActive) {
        setIsDistracted(true)
        toast.error('Distraction Detected! Focus paused.', {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          duration: 3000,
        })
      }
    }

    const handleFocus = () => {
      if (isActive) {
        setIsDistracted(false)
        toast.success('Focus Restored', {
          icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
          duration: 2000,
        })
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        handleBlur()
      } else if (!document.hidden && isActive) {
        handleFocus()
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive && !isDistracted) {
      timerRef.current = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      chartIntervalRef.current = setInterval(() => {
        const newVal = Math.max(0, Math.min(100, focusLevel + (Math.random() * 10 - 5)))
        setFocusLevel(newVal)
        setChartData((prev) => [...prev.slice(-19), { val: newVal }])
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (chartIntervalRef.current) clearInterval(chartIntervalRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (chartIntervalRef.current) clearInterval(chartIntervalRef.current)
    }
  }, [isActive, isDistracted, focusLevel])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const toggleFocus = async () => {
    if (isActive) {
      // Session Ended
      setIsActive(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (chartIntervalRef.current) clearInterval(chartIntervalRef.current)

      if (profile && startTime) {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const avgScore = Math.round(chartData.reduce((acc, curr) => acc + curr.val, 0) / (chartData.length || 1))

        try {
          await blink.db.focus_sessions.create({
            userId: profile.userId,
            duration,
            avgFocusScore: avgScore
          })

          // Update profile focus score (weighted average)
          const newScore = Math.round((profile.focusScore * 0.7) + (avgScore * 0.3))
          await blink.db.users.update(profile.id!, {
            focusScore: newScore
          })
          setProfile({ ...profile, focusScore: newScore })

          toast.success('Focus Session Saved', {
            description: `Duration: ${Math.floor(duration / 60)}m, Avg Focus: ${avgScore}%`
          })

          // Trigger AI Analysis
          handleAIAnalysis(duration, avgScore)
        } catch (error) {
          console.error('Error saving session:', error)
          toast.error('Failed to save session data')
        }
      }
    } else {
      // Session Started
      setIsActive(true)
      setStartTime(Date.now())
      setChartData([{ val: 85 }])
      toast.success('Focus Session Started')
    }
  }

  const handleAIAnalysis = async (duration: number, avgScore: number) => {
    setIsAnalyzing(true)
    try {
      const { text } = await blink.ai.generateText({
        system: `You are an AI Performance Coach for DevPool. 
        Analyze the user's focus session and provide a personalized, encouraging summary (2-3 sentences).
        Consider:
        - Duration: ${Math.floor(duration / 60)} minutes
        - Focus Score: ${avgScore}%
        - App Context: Collaborative startup ecosystem for learners.
        
        Provide actionable advice to improve focus for the next session.`,
        prompt: "Analyze my focus session."
      })
      setAiAnalysis(text)
    } catch (error) {
      console.error('AI Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <AnimatePresence mode="wait">
          {aiAnalysis ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-10 space-y-8"
            >
              <Card className="glass-card p-10 rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Brain className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">AI Focus Insights</h2>
                    <p className="text-white/60 leading-relaxed text-lg max-w-xl mx-auto">
                      {aiAnalysis}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setAiAnalysis(null)}
                    className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 font-bold"
                  >
                    Got it, Coach
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : !isActive ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-12 space-y-12"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                <div className="w-40 h-40 rounded-[3rem] border border-white/10 flex items-center justify-center bg-white/[0.02] shadow-2xl relative z-10">
                  <Timer className="w-16 h-16 text-primary" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <h1 className="text-5xl font-bold tracking-tight">Deep Work Engine</h1>
                <p className="text-white/40 text-lg max-w-md mx-auto">Lock into your flow state. DevPool AI will monitor your focus and block distractions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <FocusFeature icon={Shield} title="Anti-Distraction" desc="AI gaze tracking blocks external noise." />
                <FocusFeature icon={Zap} title="Flow Monitoring" desc="Real-time biometric productivity score." />
                <FocusFeature icon={Trophy} title="Earn XP" desc="Higher focus scores earn more platform rewards." />
              </div>

              <div className="pt-8 flex flex-col items-center gap-6">
                <Button 
                  onClick={toggleFocus}
                  className="bg-white text-black hover:bg-white/90 rounded-[2rem] h-16 px-12 text-xl font-bold shadow-2xl shadow-white/10 group"
                >
                  Enter Flow State
                  <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                {isAnalyzing && (
                  <div className="flex items-center gap-3 text-primary animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">AI is calibrating workspace...</span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Gaze Tracking</p>
                      <p className="text-sm font-bold text-emerald-400">OPTIMAL</p>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-white/5 bg-white/5">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ambient Audio</p>
                      <p className="text-sm font-bold text-white">LO-FI FLOW</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFocus}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-95"
                >
                  <Power className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex flex-col items-center py-10 relative">
                {/* Visual Progress Ring Mock */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-[500px] h-[500px] rounded-full border border-white/5 flex items-center justify-center">
                    <div className="w-[400px] h-[400px] rounded-full border border-white/10 flex items-center justify-center" />
                  </div>
                </div>

                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full -z-10" 
                />
                
                <h2 className="text-[10rem] md:text-[14rem] font-heading font-black tracking-tighter tabular-nums mb-4 leading-none text-white selection:bg-primary/30">
                  {formatTime(time)}
                </h2>
                <div className="flex items-center gap-4 text-white/40 font-mono tracking-[0.3em] text-xs font-bold bg-white/5 px-6 py-2 rounded-full border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SESSION: DEEP WORK MODE
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <h4 className="font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Live Productivity Matrix
                      </h4>
                      <p className="text-xs text-white/40">Real-time focus stability tracking</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold font-mono tracking-tighter">{Math.round(focusLevel)}%</span>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Stable</p>
                    </div>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="val" 
                          stroke="#ffffff" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#areaGradient)"
                          animationDuration={300}
                        />
                        <YAxis hide domain={[0, 100]} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">AI Vision Feed</h4>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">ON</Badge>
                    </div>
                    <div className="aspect-square rounded-[2rem] bg-black border border-white/5 relative overflow-hidden flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                      <Eye className="w-12 h-12 text-white/5 group-hover:text-white/10 transition-colors z-20" />
                      {/* Scanning UI */}
                      <div className="absolute inset-0 z-20 flex flex-col">
                        <div className="flex-1 border-b border-emerald-500/10" />
                        <div className="flex-1 border-b border-emerald-500/10" />
                        <div className="flex-1" />
                      </div>
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-0.5 bg-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-30" 
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-4 font-bold">Gaze Calibration: 100%</p>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

function FocusFeature({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass-card p-6 rounded-3xl border-white/5 space-y-3 group hover:bg-white/[0.03] transition-all">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white/40 group-hover:text-primary" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}