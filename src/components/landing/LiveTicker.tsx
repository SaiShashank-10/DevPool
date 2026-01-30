export const LiveTicker = () => {
  const stats = [
    "500+ Projects Completed",
    "12,000 Focus Hours Tracked",
    "$50k Paid to Learners",
    "98% Satisfaction Rate",
    "200+ Active Founders",
    "1,500+ Skilled Learners",
    "500+ Projects Completed",
    "12,000 Focus Hours Tracked",
    "$50k Paid to Learners",
    "98% Satisfaction Rate",
  ]

  return (
    <div className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap flex group">
      <div className="animate-marquee flex items-center gap-12 px-12">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-sm font-mono font-medium text-white/40 tracking-widest uppercase">
              {stat}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
      <div className="animate-marquee flex items-center gap-12 px-12">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-sm font-mono font-medium text-white/40 tracking-widest uppercase">
              {stat}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  )
}
