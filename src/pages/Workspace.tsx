import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  MessageSquare, 
  Users, 
  Mic, 
  MicOff, 
  Send, 
  FileText, 
  Play, 
  Settings,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Bot,
  Hash,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  Circle,
  Clock,
  Video,
  Share2,
  X
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { blink } from '@/lib/blink'
import { useStore } from '@/store/useStore'
import { Progress } from '@/components/ui/progress'

export const Workspace = () => {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'team' | 'ai'>('team')
  const [isMicActive, setIsMicActive] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [aiMessages, setAiMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I am your AI Workspace Assistant. How can I help you with this project today?' }
  ])
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [project, setProject] = useState<any>(null)
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const { profile, activeProjectId } = useStore()
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (activeProjectId && profile) {
      checkAccess()
    }
  }, [activeProjectId, profile])

  const checkAccess = async () => {
    if (!profile || !activeProjectId) return

    if (profile.role === 'founder') {
      // Founders have access to their own projects
      const proj = await blink.db.projects.get(activeProjectId)
      if (proj && proj.userId === profile.userId) {
        setHasAccess(true)
        return
      }
    }

    // Learners must have an accepted application
    const apps = await blink.db.applications.list({
      where: {
        AND: [
          { projectId: activeProjectId },
          { userId: profile.userId },
          { status: 'accepted' }
        ]
      }
    })

    setHasAccess(apps.length > 0)
  }

  useEffect(() => {
    if (activeProjectId && profile?.userId && hasAccess) {
      fetchProject()
      
      let channel: any = null
      let mounted = true

      const connectToChat = async () => {
        try {
          channel = blink.realtime.channel(`project-${activeProjectId}`)
          channelRef.current = channel

          await channel.subscribe({
            userId: profile.userId,
            metadata: { displayName: profile.displayName }
          })

          if (!mounted) return

          // Load message history from DB
          const history = await blink.db.messages.list({
            where: { projectId: activeProjectId },
            orderBy: { createdAt: 'asc' }
          })
          
          if (!mounted) return
          setMessages(history.map((m: any) => ({
            id: m.id,
            content: m.content,
            userId: m.userId,
            displayName: m.displayName || 'Dev',
            createdAt: m.createdAt
          })))

          // Listen for new messages
          channel.onMessage((msg: any) => {
            if (!mounted) return
            if (msg.type === 'chat') {
              setMessages(prev => [...prev, {
                id: msg.id,
                content: msg.data.content,
                userId: msg.userId,
                displayName: msg.metadata?.displayName || 'Dev',
                createdAt: msg.timestamp
              }])
            }
          })
        } catch (error) {
          console.error('Failed to connect to chat:', error)
        }
      }

      connectToChat()

      return () => {
        mounted = false
        channel?.unsubscribe()
        channelRef.current = null
      }
    }
  }, [activeProjectId, profile?.userId, hasAccess])

  const fetchProject = async () => {
    try {
      const data = await blink.db.projects.get(activeProjectId!)
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !profile || !activeProjectId) return

    const content = newMessage.trim()
    setNewMessage('')

    if (activeTab === 'team') {
      if (!channelRef.current) return
      try {
        // 1. Save to DB
        await blink.db.messages.create({
          projectId: activeProjectId,
          userId: profile.userId,
          content: content,
          displayName: profile.displayName
        })

        // 2. Publish to Realtime
        await channelRef.current.publish('chat', {
          content: content
        }, {
          userId: profile.userId,
          metadata: { displayName: profile.displayName }
        })
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error('Failed to send message')
      }
    } else {
      // AI Assistant Flow
      const userMsg = { role: 'user', content }
      setAiMessages(prev => [...prev, userMsg])
      setIsAiTyping(true)

      try {
        const { text } = await blink.ai.generateText({
          system: `You are an expert technical advisor for a collaborative project called "${project?.title || 'DevPool'}".
          Project Description: ${project?.description || 'N/A'}
          Tech Stack: ${project?.techStack || 'N/A'}
          Difficulty: ${project?.difficulty || 'N/A'}
          
          Help the user with technical questions, implementation details, or understanding project requirements.
          Be concise, professional, and encouraging.`,
          prompt: content
        })

        setAiMessages(prev => [...prev, { role: 'assistant', content: text }])
      } catch (error) {
        console.error('AI Assistant error:', error)
        toast.error('AI Assistant is currently unavailable')
      } finally {
        setIsAiTyping(false)
      }
    }
  }

  return (
    <DashboardLayout>
      {!activeProjectId ? (
        <div className="h-full flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
            <Code2 className="w-10 h-10 text-white/10" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">No Active Project</h2>
            <p className="text-white/40 max-w-xs mx-auto">You need to be part of a project to enter the collaborative workspace.</p>
          </div>
          <Button className="rounded-2xl h-12 px-8 bg-white text-black font-bold" asChild>
            <a href="/marketplace">Explore Marketplace</a>
          </Button>
        </div>
      ) : hasAccess === false ? (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-red-400/40" />
          </div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-white/40">You must be an accepted collaborator to access this workspace.</p>
          <Button variant="outline" className="rounded-full" asChild>
            <a href="/marketplace">Back to Marketplace</a>
          </Button>
        </div>
      ) : hasAccess === null ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
        </div>
      ) : (
        <div className="h-[calc(100vh-10rem)] flex gap-6 overflow-hidden">
          {/* Left Sidebar: Milestones & Members */}
          <div className="hidden xl:flex w-72 flex-col gap-6 shrink-0">
            <Card className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Workspace</p>
                <h3 className="text-xl font-bold line-clamp-1">{project?.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Overall Progress</span>
                  <span className="text-white font-bold">65%</span>
                </div>
                <Progress value={65} className="h-1.5 bg-white/5" />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Milestones</p>
                <div className="space-y-3">
                  <MilestoneItem title="Foundation API" status="done" />
                  <MilestoneItem title="Dashboard UI" status="active" />
                  <MilestoneItem title="Auth Webhooks" status="pending" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 rounded-[2rem] border-white/5 flex-1 flex flex-col gap-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Online Now</p>
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-3">
                  <MemberItem name={profile?.displayName || 'You'} role={profile?.role || 'Learner'} online />
                  <MemberItem name="Sarah K." role="Founder" online />
                  <MemberItem name="Marcus J." role="Learner" online />
                  <MemberItem name="Elena V." role="Learner" online={false} />
                </div>
              </ScrollArea>
              <Button variant="ghost" className="w-full rounded-xl h-10 text-xs text-white/40 hover:text-white border border-white/5">
                Manage Team
              </Button>
            </Card>
          </div>

          {/* Center: Editor & Workspace */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="flex-1 flex flex-col gap-6 min-h-0">
              <Card className="glass-card flex-1 flex flex-col rounded-[2.5rem] overflow-hidden bg-[#050505] border-white/5 relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
                
                {/* Editor Toolbar */}
                <div className="p-4 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="h-6 w-px bg-white/5" />
                    <div className="flex items-center gap-1">
                      <TabItem active title="index.tsx" />
                      <TabItem title="types.d.ts" />
                      <TabItem title="styles.css" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 text-white/40 hover:text-white hover:bg-white/5">
                      <Share2 className="w-4 h-4" />
                      Collaborate
                    </Button>
                    <Button className="h-9 px-4 rounded-xl gap-2 bg-emerald-500 text-white hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-500/20">
                      <Play className="w-4 h-4 fill-current" />
                      Run Build
                    </Button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex min-h-0 relative z-10">
                  {/* Line Numbers */}
                  <div className="w-12 py-6 flex flex-col items-center text-white/10 font-mono text-xs select-none bg-black/20 border-r border-white/5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <span key={i} className="leading-6">{i + 1}</span>
                    ))}
                  </div>
                  
                  <ScrollArea className="flex-1 font-mono text-[13px] leading-6 p-6 overflow-hidden">
                    <div className="space-y-0.5">
                      <p><span className="text-[#c678dd]">import</span> {'{ motion, AnimatePresence }'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'framer-motion'</span></p>
                      <p><span className="text-[#c678dd]">import</span> {'{ useStore }'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'@/store'</span></p>
                      <p><span className="text-[#c678dd]">import</span> {'{ blink }'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'@/lib/blink'</span></p>
                      <br />
                      <p><span className="text-[#5c6370] italic">// AI-matching score for this project: 94%</span></p>
                      <p><span className="text-[#61afef]">export const</span> <span className="text-[#e5c07b]">ProjectContainer</span> = () ={'>'} {'{'}</p>
                      <p className="pl-6"><span className="text-[#61afef]">const</span> {'{ profile }'} = <span className="text-[#e5c07b]">useStore</span>()</p>
                      <p className="pl-6"><span className="text-[#61afef]">const</span> [active, setActive] = <span className="text-[#e5c07b]">useState</span>(<span className="text-[#d19a66]">true</span>)</p>
                      <br />
                      <p className="pl-6"><span className="text-[#c678dd]">return</span> (</p>
                      <p className="pl-12 text-[#abb2bf]">{'<motion.div'}</p>
                      <p className="pl-18 text-[#abb2bf]">{'initial={{ opacity: 0, scale: 0.9 }}'}</p>
                      <p className="pl-18 text-[#abb2bf]">{'animate={{ opacity: 1, scale: 1 }}'}</p>
                      <p className="pl-18 text-[#abb2bf]">{`className="glass-card"`}</p>
                      <p className="pl-12 text-[#abb2bf]">{'>'}</p>
                      <p className="pl-18 text-[#abb2bf]">{'<Header title={profile.displayName} />'}</p>
                      <p className="pl-18 text-[#abb2bf]">{'<div className="p-8">'}</p>
                      <p className="pl-24 text-[#abb2bf]">{'<Outlet />'}</p>
                      <p className="pl-18 text-[#abb2bf]">{'</div>'}</p>
                      <p className="pl-12 text-[#abb2bf]">{'</motion.div>'}</p>
                      <p className="pl-6">)</p>
                      <p>{'}'}</p>
                    </div>
                    {/* Simulated Cursor */}
                    <motion.div 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-[1.5px] h-[18px] bg-primary shadow-[0_0_10px_rgba(255,255,255,0.8)] inline-block ml-1 align-middle"
                    />
                  </ScrollArea>
                </div>

                {/* Status Bar */}
                <div className="h-8 px-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] bg-black/40 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      <span>UTF-8</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      <span>TypeScript React</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-500/80 animate-pulse">Syncing...</span>
                    <span>Ln 12, Col 24</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Bottom Toolbar */}
            <Card className="glass-card p-4 px-8 rounded-[2rem] border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <Avatar key={i} className="w-10 h-10 border-4 border-black ring-1 ring-white/10">
                        <AvatarFallback className="bg-white/5 text-[10px]">{i}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-white/5 border-4 border-black ring-1 ring-white/10 flex items-center justify-center text-[10px] text-white/40 font-bold">
                      +4
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant={isMicActive ? 'destructive' : 'secondary'} 
                    onClick={() => setIsMicActive(!isMicActive)}
                    className="rounded-2xl h-11 px-6 gap-3 transition-all active:scale-95 font-bold shadow-lg shadow-black/20"
                  >
                    {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isMicActive ? 'Mute' : 'Join Voice'}
                  </Button>
                  
                  {isMicActive && (
                    <div className="flex items-center gap-1 h-6 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['30%', '100%', '30%'] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-emerald-500 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                  
                  <Button variant="ghost" size="icon" className="w-11 h-11 rounded-2xl text-white/40 hover:text-white hover:bg-white/5">
                    <Video className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className={`rounded-2xl h-11 px-6 gap-3 transition-all ${isChatOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`} 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-bold">Project Intel</span>
                  <Badge className="bg-white/10 text-[10px] px-1.5 h-5 border-none">12</Badge>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Chat & AI */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 350, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="h-full"
              >
                <Card className="h-full glass-card flex flex-col rounded-3xl overflow-hidden border-l border-white/5">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setActiveTab('team')}
                        className={`text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'team' ? 'text-white' : 'text-white/40'}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Team
                      </button>
                      <button 
                        onClick={() => setActiveTab('ai')}
                        className={`text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'ai' ? 'text-white' : 'text-white/40'}`}
                      >
                        <Bot className="w-4 h-4" />
                        AI Assistant
                      </button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    {activeTab === 'team' ? (
                      <div className="space-y-6">
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {msg.userId === profile?.userId ? 'You' : (msg.displayName || 'Dev')}
                              </span>
                              <span className="text-[10px] text-white/20">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.userId === profile?.userId ? 'bg-white/10 text-white' : 'bg-white/5 text-white/70'}`}>
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {aiMessages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-1"
                          >
                            <div className="flex items-center gap-2">
                              {msg.role === 'assistant' ? (
                                <Sparkles className="w-3 h-3 text-purple-400" />
                              ) : null}
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {msg.role === 'assistant' ? 'AI ASSISTANT' : 'YOU'}
                              </span>
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.role === 'assistant' ? 'bg-purple-500/10 text-white/90 border border-purple-500/20' : 'bg-white/5 text-white/70'}`}>
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                        {isAiTyping && (
                          <div className="flex items-center gap-2 px-2">
                            <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                            <span className="text-[10px] text-purple-400 font-bold tracking-widest animate-pulse uppercase">AI is thinking...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="relative">
                      <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-white/5 border-white/10 rounded-2xl pr-12 h-12"
                      />
                      <Button 
                        type="submit"
                        size="icon" 
                        className="absolute right-1 top-1 h-10 w-10 rounded-xl bg-white text-black hover:bg-white/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  )
}

function MilestoneItem({ title, status }: { title: string, status: 'done' | 'active' | 'pending' }) {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${status === 'done' ? 'bg-emerald-500/10 text-emerald-500' : status === 'active' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-white/5 text-white/20'}`}>
        {status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      </div>
      <span className={`text-sm font-medium ${status === 'done' ? 'text-white/30' : status === 'active' ? 'text-white' : 'text-white/40'}`}>{title}</span>
    </div>
  )
}

function MemberItem({ name, role, online }: { name: string, role: string, online: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-9 h-9 border border-white/5 group-hover:border-white/20 transition-all">
            <AvatarFallback className="bg-white/5 text-[10px]">{name[0]}</AvatarFallback>
          </Avatar>
          {online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black" />}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{name}</p>
          <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{role}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-white/0 group-hover:text-white/20 hover:text-white/60">
        <MoreVertical className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}

function TabItem({ title, active }: { title: string, active?: boolean }) {
  return (
    <div className={`px-4 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all border ${active ? 'bg-white/10 border-white/10 text-white' : 'bg-transparent border-transparent text-white/20 hover:text-white/40'}`}>
      <span className="text-xs font-mono">{title}</span>
      {active && <X className="w-3 h-3 text-white/40 hover:text-white" />}
    </div>
  )
}
