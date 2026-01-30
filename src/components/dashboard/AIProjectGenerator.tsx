import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Wand2, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { useStore } from '@/store/useStore'

export const AIProjectGenerator = ({ isOpen, onClose, onProjectCreated }: { 
  isOpen: boolean, 
  onClose: () => void,
  onProjectCreated: () => void 
}) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProject, setGeneratedProject] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { profile } = useStore()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Create a startup project for DevPool based on this idea: "${prompt}". 
        The project should be suitable for learners. 
        Provide a title, a detailed description, a recommended tech stack (comma separated), a fair bounty amount in USD, and a difficulty level (Beginner, Intermediate, Advanced).`,
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            techStack: { type: 'string' },
            bounty: { type: 'number' },
            difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] }
          },
          required: ['title', 'description', 'techStack', 'bounty', 'difficulty']
        }
      })
      
      setGeneratedProject(object)
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate project. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveProject = async () => {
    if (!generatedProject || !profile) return
    
    setIsSaving(true)
    try {
      await blink.db.projects.create({
        userId: profile.userId,
        title: generatedProject.title,
        description: generatedProject.description,
        techStack: generatedProject.techStack,
        bounty: generatedProject.bounty,
        difficulty: generatedProject.difficulty,
        matchScore: 0, // Initial score, AI smart matcher will update it
        status: 'open'
      })
      
      toast.success('Project published successfully!')
      onProjectCreated()
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save project.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl z-10"
          >
            <Card className="glass-card p-8 rounded-3xl border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5 text-white/40" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Project Builder</h2>
                    <p className="text-white/40">Describe your vision, and we'll draft the project details.</p>
                  </div>
                </div>

                {!generatedProject ? (
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="e.g., A minimalist dashboard for tracking carbon emissions with React and D3.js..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[150px] bg-white/5 border-white/10 rounded-2xl resize-none focus:ring-primary/20"
                    />
                    <Button 
                      className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-[1.02] transition-all group"
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Synthesizing Vision...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                          Generate Project
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-white">{generatedProject.title}</h3>
                        <Badge className="bg-primary/20 text-primary border-none rounded-full">
                          {generatedProject.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{generatedProject.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {generatedProject.techStack.split(',').map((tech: string, i: number) => (
                          <Badge key={i} variant="outline" className="rounded-full border-white/10 text-xs">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm text-white/40 uppercase tracking-widest">Proposed Bounty</span>
                        <span className="text-xl font-bold text-emerald-400">${generatedProject.bounty}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-12 rounded-xl border-white/10"
                        onClick={() => setGeneratedProject(null)}
                      >
                        Try Another Idea
                      </Button>
                      <Button 
                        className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold"
                        onClick={handleSaveProject}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Publish Project
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
