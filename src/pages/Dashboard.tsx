import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle2, Circle, Timer, Zap, Layout as LayoutIcon, Code, BarChart3, TrendingUp, Briefcase, Users, DollarSign, Award, Star, ArrowUpRight, Plus, ExternalLink, Activity, Rocket, MessageSquare, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { blink } from '@/lib/blink'
import { useStore } from '@/store/useStore'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { AIProjectGenerator } from '@/components/dashboard/AIProjectGenerator'

export const Dashboard = () => {
  const [activeProject, setActiveProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [focusHistory, setFocusHistory] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [myProjects, setMyProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAIGenOpen, setIsAIGenOpen] = useState(false)
  const { profile, activeProjectId, setActiveProjectId } = useStore()

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
    }
  }, [profile, activeProjectId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (profile?.role === 'founder') {
        // 1. Fetch Founder's Projects
        const projects = await blink.db.projects.list({
          where: { userId: profile.userId }
        })
        setMyProjects(projects)
        
        // 2. Fetch Applications for my projects
        if (projects.length > 0) {
          const apps = await blink.db.applications.list({
            where: {
              projectId: { IN: projects.map(p => p.id) }
            },
            orderBy: { createdAt: 'desc' }
          })
          
          // Enrich applications with project titles and user names
          const enrichedApps = await Promise.all(apps.map(async (app: any) => {
            const proj = projects.find(p => p.id === app.projectId)
            const applicant = await blink.db.users.get(app.userId)
            return {
              ...app,
              projectTitle: proj?.title,
              applicantName: applicant?.displayName || 'Anonymous',
              applicantBio: applicant?.bio,
              applicantSkills: applicant?.skills?.split(','),
              applicantAvatar: applicant?.githubUrl ? `https://github.com/${applicant.githubUrl.split('/').pop()}.png` : null
            }
          }))
          setApplications(enrichedApps)
        }
      } else {
        // Learner Flow
        // 1. Fetch Active Project
        if (activeProjectId) {
          const proj = await blink.db.projects.get(activeProjectId)
          setActiveProject(proj)
          
          // 2. Fetch Tasks for active project
          const projTasks = await blink.db.tasks.list({
            where: { projectId: activeProjectId },
            limit: 3
          })
          setTasks(projTasks)
        } else {
          // Find latest project user is assigned to (simulated for now by finding first accepted application)
          const apps = await blink.db.applications.list({
            where: { 
              AND: [
                { userId: profile.userId },
                { status: 'accepted' }
              ]
            },
            limit: 1
          })
          
          if (apps.length > 0) {
            setActiveProjectId(apps[0].projectId)
          }
        }
      }

      // 3. Fetch Focus Sessions for Trend Chart
      const sessions = await blink.db.focus_sessions.list({
        where: { userId: profile.userId },
        orderBy: { createdAt: 'desc' },
        limit: 7
      })
      
      const chartData = sessions.reverse().map((s: any) => ({
        time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit' }),
        focus: s.avgFocusScore
      }))
      
      setFocusHistory(chartData.length > 0 ? chartData : [
        { time: '9am', focus: 85 },
        { time: '10am', focus: 72 },
        { time: '11am', focus: 90 },
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationStatus = async (appId: string, status: 'accepted' | 'rejected') => {
    try {
      await blink.db.applications.update(appId, { status })
      toast.success(`Application ${status}`)
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest"
            >
              <Activity className="w-4 h-4" />
              Live Dashboard
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{profile?.displayName?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/40">Here's what's happening in your {profile?.role} ecosystem today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6">
              View Analytics
            </Button>
            {profile?.role === 'founder' && (
              <Button 
                className="rounded-2xl bg-white text-black hover:bg-white/90 h-12 px-6 shadow-xl shadow-white/10"
                onClick={() => setIsAIGenOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile?.role === 'founder' ? (
            <>
              <StatCard label="Total Bounties" value="$12.4k" trend="+8.2%" icon={DollarSign} color="emerald" />
              <StatCard label="Active Projects" value={myProjects.length.toString()} trend="0%" icon={Briefcase} color="blue" />
              <StatCard label="Pending Apps" value={applications.filter(a => a.status === 'pending').length.toString()} trend="+2" icon={Users} color="purple" />
              <StatCard label="Avg. Delivery" value="4.8/5" trend="+0.2" icon={Star} color="amber" />
            </>
          ) : (
            <>
              <StatCard label="Total Earned" value="$3.2k" trend="+$450" icon={DollarSign} color="emerald" />
              <StatCard label="Focus Hours" value="142h" trend="+12.4h" icon={Timer} color="blue" />
              <StatCard label="Completed" value="8" trend="+1" icon={CheckCircle2} color="purple" />
              <StatCard label="Avg. Match" value="94%" trend="+2%" icon={Award} color="amber" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            {profile?.role === 'founder' ? (
              /* Founder: Projects & Applications */
              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Active Project Hub
                    </h3>
                    <Button variant="link" className="text-primary p-0 h-auto">View All Projects</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myProjects.length > 0 ? myProjects.slice(0, 2).map((project) => (
                      <Card key={project.id} className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Code className="w-6 h-6 text-white/60" />
                          </div>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none rounded-full">Active</Badge>
                        </div>
                        <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 4 Learners</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${project.bounty}</span>
                        </div>
                      </Card>
                    )) : (
                      <Card className="glass-card p-10 rounded-[2rem] border-dashed border-white/10 flex flex-col items-center justify-center text-center col-span-2">
                        <Rocket className="w-12 h-12 text-white/10 mb-4" />
                        <h4 className="font-bold">No projects yet</h4>
                        <p className="text-sm text-white/30 max-w-xs mx-auto mb-6">Start by launching your first AI-generated project roadmap.</p>
                        <Button variant="outline" onClick={() => setIsAIGenOpen(true)} className="rounded-xl">Create Project</Button>
                      </Card>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Incoming Talent
                    </h3>
                    <Badge variant="outline" className="rounded-full bg-white/5 border-white/10 px-3 py-1">{applications.filter(a => a.status === 'pending').length} New</Badge>
                  </div>
                  <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
                    <div className="divide-y divide-white/5">
                      {applications.length > 0 ? applications.map((app) => (
                        <div key={app.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                              <Avatar className="w-14 h-14 rounded-2xl border border-white/10">
                                <AvatarImage src={app.applicantAvatar} />
                                <AvatarFallback className="bg-white/5">{app.applicantName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-lg">{app.applicantName}</h5>
                                  <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0">Learner</Badge>
                                </div>
                                <p className="text-sm text-white/40 line-clamp-1">{app.applicantBio || 'No bio provided.'}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {app.applicantSkills?.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/60">{skill.trim()}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {app.status === 'pending' ? (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    className="rounded-xl h-10 px-4 text-red-400 hover:bg-red-400/5"
                                    onClick={() => handleApplicationStatus(app.id, 'rejected')}
                                  >
                                    Ignore
                                  </Button>
                                  <Button 
                                    className="rounded-xl h-10 px-6 bg-white text-black hover:bg-white/90 font-bold"
                                    onClick={() => handleApplicationStatus(app.id, 'accepted')}
                                  >
                                    Review & Hire
                                  </Button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className={`rounded-xl px-4 py-1.5 font-bold ${app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {app.status.toUpperCase()}
                                  </Badge>
                                  <Button variant="ghost" size="icon" className="rounded-xl text-white/20 hover:text-white">
                                    <ArrowUpRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="py-24 text-center space-y-4">
                          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-white/10" />
                          </div>
                          <h4 className="font-bold text-white/60">Waiting for talent...</h4>
                          <p className="text-sm text-white/30 max-w-xs mx-auto">Projects with clear requirements attract the best learners.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </section>
              </div>
            ) : (
              /* Learner: Active Project & Marketplace */
              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Active Workspace
                    </h3>
                    <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate('/chat')}>Open Workspace</Button>
                  </div>
                  <Card className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                    
                    {activeProject ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-primary/20 text-primary border-none rounded-full px-3">In Progress</Badge>
                              <span className="text-xs text-white/30">ID: {activeProject.id?.slice(0, 8)}</span>
                            </div>
                            <h4 className="text-3xl font-bold tracking-tight">{activeProject.title}</h4>
                            <p className="text-white/40 text-sm leading-relaxed">{activeProject.description?.slice(0, 100)}...</p>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div>
                              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-1">Time Spent</p>
                              <p className="text-xl font-bold">12.4h</p>
                            </div>
                            <div className="h-8 w-px bg-white/5" />
                            <div>
                              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-1">Bounty</p>
                              <p className="text-xl font-bold text-emerald-400">${activeProject.bounty}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 bg-white/5 rounded-3xl p-6 border border-white/5">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Overall Completion</span>
                              <span className="text-white font-bold">65%</span>
                            </div>
                            <div className="h-2.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary to-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Next Tasks</p>
                            {tasks.slice(0, 2).map((task, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Circle className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-medium text-white/80">{task.title}</span>
                              </div>
                            ))}
                          </div>

                          <Button className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-bold h-11" onClick={() => navigate('/chat')}>
                            Continue Working
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                          <Rocket className="w-10 h-10 text-white/10" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-bold">No active project found</h4>
                          <p className="text-white/40 max-w-xs mx-auto text-sm">Applications you've submitted will appear here once accepted.</p>
                        </div>
                        <Button className="rounded-xl h-12 px-8 bg-white text-black font-bold" onClick={() => navigate('/marketplace')}>
                          Find Your First Project
                        </Button>
                      </div>
                    )}
                  </Card>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Recommended for You
                    </h3>
                    <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => navigate('/marketplace')}>
                      Browse More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Placeholder for matched projects */}
                    {[1, 2].map((i) => (
                      <Card key={i} className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-none rounded-full px-3 py-1 text-[10px] font-bold">9{i}% MATCH</Badge>
                        </div>
                        <h4 className="text-lg font-bold mb-2">Build {i === 1 ? 'Real-time Chat' : 'Dashboard Kit'}</h4>
                        <p className="text-xs text-white/40 mb-4 line-clamp-2">Develop a high-performance system using our established boilerplate...</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-emerald-400 font-bold text-sm">$450</span>
                          <Button variant="ghost" size="sm" className="rounded-xl text-xs hover:bg-white/5">Details</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* Productivity Widget */}
            <Card className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Productivity
                </h4>
                <Badge variant="secondary" className="bg-white/5 text-white/60 border-none">Last 7 Days</Badge>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={focusHistory}>
                    <defs>
                      <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff10', borderRadius: '16px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="focus" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#focusGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Peak Flow</p>
                  <p className="text-lg font-bold">11:30 AM</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Avg Score</p>
                  <p className="text-lg font-bold">82%</p>
                </div>
              </div>
            </Card>

            {/* System Status / Health */}
            <Card className="glass-card p-8 rounded-[2.5rem] border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold">Ecosystem Health</h4>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
              </div>
              
              <div className="space-y-6">
                <HealthItem label="Project Escrow" status="Active" icon={DollarSign} />
                <HealthItem label="AI Matching" status="Synced" icon={Zap} />
                <HealthItem label="Code Analysis" status="Ready" icon={Code} />
                <HealthItem label="Live Collaboration" status="Stable" icon={MessageSquare} />
              </div>

              <div className="mt-8 p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Network Update</p>
                <p className="text-[11px] text-white/60 leading-relaxed">System upgrade v2.4 successfully deployed. Real-time focus tracking is now 15% more precise.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AIProjectGenerator 
        isOpen={isAIGenOpen} 
        onClose={() => setIsAIGenOpen(false)} 
        onProjectCreated={fetchDashboardData}
      />
    </DashboardLayout>
  )
}

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => {
  const colorMap: any = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  }

  return (
    <Card className="glass-card p-6 rounded-[2rem] border-white/5 hover:bg-white/[0.03] transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-emerald-400">{trend}</p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Trend</p>
        </div>
      </div>
      <div className="mt-6 relative z-10">
        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">{label}</p>
      </div>
    </Card>
  )
}

const HealthItem = ({ label, status, icon: Icon }: any) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <Icon className="w-4 h-4 text-white/40" />
      </div>
      <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
    </div>
    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{status}</span>
  </div>
)