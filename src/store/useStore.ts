import { create } from 'zustand'

interface UserProfile {
  id?: string
  userId: string
  displayName: string
  role: 'founder' | 'learner'
  githubUrl?: string
  skills?: string
  companyName?: string
  fundingStage?: string
  energyLevel?: string
  bio?: string
  twitterUrl?: string
  focusScore: number
}

interface AppState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  activeProjectId: string | null
  setActiveProjectId: (id: string | null) => void
  isDeepWorkMode: boolean
  setDeepWorkMode: (isDeepWork: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  isDeepWorkMode: false,
  setDeepWorkMode: (isDeepWork) => set({ isDeepWorkMode: isDeepWork }),
}))
