import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Shield, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  History,
  CreditCard,
  PieChart as PieIcon,
  RefreshCcw,
  ArrowRight
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useStore } from '@/store/useStore'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const mockTransactions = [
  { id: 1, type: 'credit', amount: 450.00, status: 'completed', description: 'Project Bounty: Chat App', date: '2024-03-28' },
  { id: 2, type: 'debit', amount: 20.00, status: 'completed', description: 'DevPool Pro Subscription', date: '2024-03-25' },
  { id: 3, type: 'credit', amount: 120.00, status: 'pending', description: 'Milestone 1: Dashboard UI', date: '2024-03-30' },
]

export default function WalletPage() {
  const { profile } = useStore()
  const [balance, setBalance] = useState(3240.50)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast.success('Wallet synced with blockchain')
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Secure Escrow Wallet
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Financial Center</h1>
            <p className="text-white/40">Manage your earnings, bounties, and platform subscriptions.</p>
          </div>
          
          <Button 
            variant="outline" 
            className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6 gap-2"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Balance
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden group bg-gradient-to-br from-primary/20 via-transparent to-transparent">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Available Balance</p>
                    <h2 className="text-6xl font-bold tracking-tight">${balance.toLocaleString()}</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button className="rounded-2xl h-12 px-8 bg-white text-black font-bold hover:bg-white/90">
                      Withdraw Funds
                    </Button>
                    <Button variant="ghost" className="rounded-2xl h-12 px-6 text-white/60 hover:text-white hover:bg-white/5">
                      Transaction History
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    <p className="text-2xl font-bold text-white">$1,240</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Total Earned</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <p className="text-2xl font-bold text-white">$450</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">In Escrow</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transactions */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                <Button variant="ghost" className="text-white/40 hover:text-white text-xs">View All</Button>
              </div>
              
              <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
                <div className="divide-y divide-white/5">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{tx.description}</p>
                          <p className="text-xs text-white/30">{new Date(tx.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                        <Badge variant="outline" className={`rounded-full border-none px-2 py-0 text-[10px] uppercase font-bold tracking-widest ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            {/* Rewards Card */}
            <Card className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  DevRewards
                </h4>
                <Badge className="bg-primary text-white text-[10px]">Level 4</Badge>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">XP to Level 5</span>
                    <span className="text-white font-bold">840 / 1000</span>
                  </div>
                  <Progress value={84} className="h-1.5 bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <RewardItem label="5% Bonus on next bounty" active />
                  <RewardItem label="Zero withdrawal fees" active={false} />
                  <RewardItem label="Priority support access" active={false} />
                </div>
                
                <Button className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs h-10 border border-white/10">
                  Browse Perk Shop
                </Button>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="glass-card p-8 rounded-[2.5rem] border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Payout Methods</h4>
                <CreditCard className="w-4 h-4 text-white/40" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Stripe Connect</p>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                </div>
                
                <Button variant="ghost" className="w-full rounded-2xl border border-dashed border-white/10 text-xs text-white/30 h-14 hover:border-white/20 hover:text-white transition-all">
                  + Add New Method
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function RewardItem({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${active ? 'bg-primary/5 border-primary/20 text-white' : 'bg-white/5 border-white/5 text-white/30'}`}>
      <Shield className={`w-4 h-4 ${active ? 'text-primary' : 'text-white/10'}`} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}
