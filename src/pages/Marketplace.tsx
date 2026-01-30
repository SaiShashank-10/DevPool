import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Briefcase, DollarSign, Brain, Code, ArrowUpRight, Zap, Loader2, Plus, Sparkles, TrendingUp, Star, Clock, Users, Globe, Lock, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { blink } from '@/lib/blink'
import { useStore } from '@/store/useStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Marketplace = () => {
  const [search, setSearch] = useState('')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMatching, setIsMatching] = useState<string | null>(null)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const { profile } = useStore()

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    bounty: '',
    difficulty: 'Medium',
    estimatedDuration: '2 weeks',
    teamSize: '1-2'
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await blink.db.projects.list({
        where: { status: 'open' }
      })
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (!selectedTech || p.techStack.toLowerCase().includes(selectedTech.toLowerCase()))
  )

  const matchedProjects = projects
    .filter(p => (p.matchScore || 0) > 85)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 3)

  const allTech = Array.from(new Set(projects.flatMap(p => p.techStack.split(',').map((t: string) => t.trim()))))

  const handleApply = async (projectId: string, title: string) => {
    if (!profile) {
      toast.error('Please log in to apply')
      return
    }

    try {
      // Check if already applied
      const existing = await blink.db.applications.list({
        where: { 
          AND: [
            { projectId },
            { userId: profile.userId }
          ]
        }
      })

      if (existing.length > 0) {
        toast.error('You have already applied for this project')
        return
      }

      await blink.db.applications.create({
        projectId,
        userId: profile.userId,
        status: 'pending'
      })

      toast.success(`Application submitted for ${title}!`, {
        description: 'The founder will review your profile and match score.',
        icon: <Brain className="w-4 h-4 text-purple-400" />
      })
    } catch (error) {
      console.error('Error applying:', error)
      toast.error('Failed to submit application')
    }
  }

  const handleAIMatch = async (project: any) => {
    if (!profile) {
      toast.error('Please log in to use AI matching')
      return
    }

    setIsMatching(project.id)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Calculate a match score (0-100) between this learner and this project.
        Learner Skills: ${profile.skills || 'Not specified'}
        Learner Bio: ${profile.bio || 'Not specified'}
        Learner GitHub: ${profile.githubUrl || 'Not specified'}
        
        Project Title: ${project.title}
        Project Description: ${project.description}
        Project Tech Stack: ${project.techStack}
        Project Difficulty: ${project.difficulty}
        
        Provide a match score and a 1-sentence reasoning for the score.`,
        schema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            reasoning: { type: 'string' }
          },
          required: ['score', 'reasoning']
        }
      })

      // Update project match score locally and in DB
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, matchScore: object.score } : p))
      
      toast.success(`AI Match Calculated: ${object.score}%`, {
        description: object.reasoning,
        icon: <Brain className="w-4 h-4 text-purple-400" />
      })
    } catch (error) {
      console.error('AI Matching error:', error)
      toast.error('Failed to calculate AI match')
    } finally {
      setIsMatching(null)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || profile.role !== 'founder') {
      toast.error('Only founders can post projects')
      return
    }

    try {
      const projId = `proj_${Date.now()}`
      await blink.db.projects.create({
        id: projId,
        userId: profile.userId,
        title: newProject.title,
        description: newProject.description,
        techStack: newProject.techStack,
        bounty: parseInt(newProject.bounty),
        difficulty: newProject.difficulty,
        status: 'open',
        matchScore: Math.floor(Math.random() * 20) + 80, // Simulated score
        estimatedDuration: newProject.estimatedDuration,
        teamSize: newProject.teamSize
      })

      toast.success('Project posted successfully!')
      setIsPostDialogOpen(false)
      fetchProjects()
      setNewProject({
        title: '',
        description: '',
        techStack: '',
        bounty: '',
        difficulty: 'Medium',
        estimatedDuration: '2 weeks',
        teamSize: '1-2'
      })
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to post project')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest"
            >
              <Globe className="w-4 h-4" />
              Global Opportunity Hub
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight">Project Marketplace</h1>
            <p className="text-white/40 text-lg max-w-xl">Join elite startups and build the future of software with our AI-vetted matching engine.</p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-3">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="bg-white/5 border-white/5 rounded-2xl pl-11 h-12 focus:ring-1 focus:ring-white/10 transition-all"
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-5">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {profile?.role === 'founder' && (
              <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl h-12 px-8 gap-2 bg-white text-black hover:bg-white/90 font-bold shadow-xl shadow-white/5">
                    <Plus className="w-5 h-5" />
                    Launch New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 text-white sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden">
                  <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-bold">Post a New Project</DialogTitle>
                      <DialogDescription className="text-white/40">Launch your vision and find the perfect talent matches.</DialogDescription>
                    </DialogHeader>
                  </div>
                  <ScrollArea className="max-h-[80vh]">
                    <form onSubmit={handleCreateProject} className="p-8 space-y-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Project Title</Label>
                          <Input 
                            value={newProject.title}
                            onChange={e => setNewProject({...newProject, title: e.target.value})}
                            placeholder="e.g. Next-gen AI Dashboard" 
                            className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-primary/50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Mission Description</Label>
                          <Textarea 
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                            placeholder="Describe what needs to be built..." 
                            className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] p-6 focus:ring-primary/50 resize-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Bounty ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <Input 
                              type="number"
                              value={newProject.bounty}
                              onChange={e => setNewProject({...newProject, bounty: e.target.value})}
                              placeholder="500" 
                              className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 transition-all"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Difficulty</Label>
                          <select 
                            value={newProject.difficulty}
                            onChange={e => setNewProject({...newProject, difficulty: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="Easy">Entry Level (Easy)</option>
                            <option value="Medium">Standard (Medium)</option>
                            <option value="Hard">Advanced (Hard)</option>
                            <option value="Expert">Master (Expert)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Est. Duration</Label>
                          <Input 
                            value={newProject.estimatedDuration}
                            onChange={e => setNewProject({...newProject, estimatedDuration: e.target.value})}
                            placeholder="2 weeks" 
                            className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Team Size</Label>
                          <Input 
                            value={newProject.teamSize}
                            onChange={e => setNewProject({...newProject, teamSize: e.target.value})}
                            placeholder="1-2 people" 
                            className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Tech Stack</Label>
                        <Input 
                          value={newProject.techStack}
                          onChange={e => setNewProject({...newProject, techStack: e.target.value})}
                          placeholder="React, Node.js, Python..." 
                          className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg shadow-xl">
                        Publish Project to Marketplace
                      </Button>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <Button 
            variant={!selectedTech ? 'secondary' : 'ghost'} 
            onClick={() => setSelectedTech(null)}
            className={`rounded-2xl h-11 px-6 whitespace-nowrap transition-all ${!selectedTech ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            All Segments
          </Button>
          {allTech.map(tech => (
            <Button 
              key={tech}
              variant={selectedTech === tech ? 'secondary' : 'ghost'} 
              onClick={() => setSelectedTech(tech)}
              className={`rounded-2xl h-11 px-6 whitespace-nowrap transition-all ${selectedTech === tech ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              {tech}
            </Button>
          ))}
        </div>

        {/* Featured / Matched Section */}
        {!search && !selectedTech && matchedProjects.length > 0 && profile?.role === 'learner' && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Recommendations
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-8 rounded-[2.5rem] border-primary/20 bg-gradient-to-br from-primary/10 to-transparent relative group overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-6">
                      <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
                        {project.matchScore}%
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Perfect Match</Badge>
                        <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-white/40 font-bold uppercase tracking-widest">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          ${project.bounty}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="flex items-center gap-1.5 text-xs text-white/40 font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          2 Weeks
                        </span>
                      </div>
                      <Button className="w-full rounded-2xl h-12 bg-white text-black font-bold hover:bg-white/90" onClick={() => handleApply(project.id, project.title)}>
                        Instant Apply
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Main Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Active Opportunities
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/40">
              Sorted by: <span className="text-white font-bold">Newest</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-white/40 font-bold tracking-widest text-xs uppercase animate-pulse">Scanning Ecosystem...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card className="glass-card p-8 rounded-[2.5rem] h-full flex flex-col group relative overflow-hidden border-white/5 hover:border-white/20 transition-all">
                      <div className="absolute top-0 right-0 p-6 pointer-events-none">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                            <Brain className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-white/60">{project.matchScore || 0}% MATCH</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 flex-1 relative">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                            <Rocket className="w-3 h-3" />
                            Active Listing
                          </div>
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">{project.title}</h3>
                        </div>

                        <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {project.techStack.split(',').map((t: string) => (
                            <Badge key={t} variant="secondary" className="bg-white/5 text-white/40 border-none rounded-xl text-[10px] px-3 h-7">{t.trim()}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Bounty</p>
                            <p className="text-2xl font-bold text-emerald-400 tracking-tight">${project.bounty}</p>
                          </div>
                          <div className="w-px h-10 bg-white/5" />
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Team</p>
                            <p className="text-sm font-bold flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-white/40" />
                              {project.teamSize || '1-2'}
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          size="icon" 
                          onClick={() => handleApply(project.id, project.title)}
                          className="w-14 h-14 rounded-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform active:scale-95"
                        >
                          <ArrowUpRight className="w-6 h-6" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
