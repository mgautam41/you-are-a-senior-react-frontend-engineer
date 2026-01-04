import { useState, useEffect } from 'react';
import { Zap, TrendingUp, FileText, Image as ImageIcon, Eye, Share2 } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: typeof Zap;
}

const fakeStats: StatCard[] = [
  { label: 'Total Shares', value: '1,247', change: '+12%', trend: 'up', icon: Share2 },
  { label: 'Text Shares', value: '892', change: '+8%', trend: 'up', icon: FileText },
  { label: 'Image Shares', value: '355', change: '+18%', trend: 'up', icon: ImageIcon },
  { label: 'Total Views', value: '4,821', change: '+24%', trend: 'up', icon: Eye },
];

const fakeActivityData = [
  { day: 'Mon', shares: 45, views: 120 },
  { day: 'Tue', shares: 62, views: 145 },
  { day: 'Wed', shares: 38, views: 98 },
  { day: 'Thu', shares: 71, views: 189 },
  { day: 'Fri', shares: 55, views: 156 },
  { day: 'Sat', shares: 29, views: 78 },
  { day: 'Sun', shares: 41, views: 112 },
];

export const StatsSection = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [activity, setActivity] = useState<typeof fakeActivityData>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(fakeStats);
      setActivity(fakeActivityData);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const maxViews = Math.max(...activity.map((d) => d.views));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Statistics</h1>
          <p className="text-sm text-muted-foreground">Your sharing activity overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-200 animate-scale-in"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className={`
                flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                ${stat.trend === 'up' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}
              `}>
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-semibold mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-medium mb-4">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {activity.map((day, index) => (
            <div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-2 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-full flex flex-col gap-1 items-center">
                {/* Views bar */}
                <div
                  className="w-full max-w-[28px] bg-primary/20 rounded-t transition-all duration-500"
                  style={{ height: `${(day.views / maxViews) * 100}px` }}
                />
                {/* Shares bar */}
                <div
                  className="w-full max-w-[28px] bg-primary rounded-t transition-all duration-500"
                  style={{ height: `${(day.shares / maxViews) * 100}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-xs text-muted-foreground">Shares</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span className="text-xs text-muted-foreground">Views</span>
          </div>
        </div>
      </div>

      {/* Top Codes */}
      <div className="bg-card rounded-xl border border-border p-5 mt-4">
        <h3 className="text-sm font-medium mb-4">Most Viewed Codes</h3>
        <div className="space-y-3">
          {[
            { code: '4821', views: 342, type: 'text' },
            { code: '7293', views: 256, type: 'image' },
            { code: '1056', views: 189, type: 'text' },
          ].map((item, index) => (
            <div
              key={item.code}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
              <span className="font-mono font-semibold">{item.code}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${item.type === 'text' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                {item.type}
              </span>
              <span className="ml-auto text-sm text-muted-foreground">{item.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
