import React, { useMemo, useState } from 'react';
import { Activity, Flame, BookOpen, BatteryCharging, Sparkles, X, Loader2 } from 'lucide-react';
import { Interaction } from '../types';
import { auth } from '../firebase';

export default function CognitiveAnalytics({ interactions = [] }: { interactions: Interaction[] }) {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [weeklyInsight, setWeeklyInsight] = useState<{ title: string; summary: string } | null>(null);

  // Compute 7-day stats and sparkline coordinates
  const stats = useMemo(() => {
    const totalEntries = interactions.length;
    
    // Total word count calculation across entries
    const wordsLogged = interactions.reduce((acc, curr) => {
      const text = curr.analysis?.transcribed_text || curr.content || '';
      return acc + (text.trim() ? text.trim().split(/\s+/).length : 0);
    }, 0);

    // Track mood frequency
    const moodCounts: Record<string, number> = {
      '⚡ High Focus': 0,
      '☁️ Brain Fog': 0,
      '🔋 Low Battery': 0,
      'Neutral': 0
    };

    interactions.forEach(entry => {
      const m = entry.cognitiveState || 'Neutral';
      if (moodCounts[m] !== undefined) moodCounts[m]++;
      else moodCounts['Neutral']++;
    });

    // Find dominant mood
    let dominant = 'Neutral';
    let maxCount = -1;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount && count > 0) {
        maxCount = count;
        dominant = mood;
      }
    });

    // Generate 7-day trend buckets (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        label: days[d.getDay()],
        dateStr: d.toDateString(),
        score: 0 // higher score = balanced/focused; lower = cognitive fatigue
      };
    });

    interactions.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      const match = last7Days.find(d => d.dateStr === entryDate.toDateString());
      if (match) {
        if (entry.cognitiveState?.includes('Focus')) match.score += 2;
        else if (entry.cognitiveState?.includes('Fog') || entry.cognitiveState?.includes('Battery')) match.score -= 1;
        else match.score += 1;
      }
    });

    // Normalize sparkline points for a 200x50 SVG viewBox
    const scores = last7Days.map(d => d.score);
    const min = Math.min(...scores, -2);
    const max = Math.max(...scores, 4);
    const range = max - min || 1;
    const points = last7Days.map((d, index) => {
      const x = (index / 6) * 180 + 10;
      const y = 45 - ((d.score - min) / range) * 35;
      return `${x},${y}`;
    }).join(' ');

    return { totalEntries, wordsLogged, dominant, last7Days, points };
  }, [interactions]);

  const handleSynthesize = async () => {
    if (!auth.currentUser || interactions.length === 0) return;
    setIsSynthesizing(true);
    setWeeklyInsight(null);
    try {
      const token = await auth.currentUser.getIdToken();
      // Format history for summarize endpoint (limit to recent 15 entries for the week)
      const recentHistory = interactions.slice(0, 15).map(i => ({
        role: "user",
        content: i.analysis?.transcribed_text || i.content
      }));

      // @ts-ignore
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gemini/summarize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ history: recentHistory })
      });
      const data = await res.json();
      if (data.title && data.summary) {
        setWeeklyInsight(data);
      } else {
        alert("Could not generate summary.");
      }
    } catch (err) {
      console.error(err);
      alert("Error synthesizing week.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <section className="rounded-2xl bg-sanctuary-bg border border-sanctuary-border p-5 space-y-4 shadow-soft">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sanctuary-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-sanctuary-blue shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-sanctuary-text uppercase font-mono">
              7-Day Cognitive Rhythm
            </h3>
            <p className="text-[11px] text-sanctuary-muted mt-0.5">Aggregated load and energy trajectory</p>
          </div>
        </div>
        <button 
          onClick={handleSynthesize}
          disabled={isSynthesizing || interactions.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sanctuary-blue/10 hover:bg-sanctuary-blue/20 text-sanctuary-blue text-xs font-medium transition-colors"
        >
          {isSynthesizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Synthesize
        </button>
      </div>

      {weeklyInsight && (
        <div className="bg-sanctuary-surface rounded-xl border border-sanctuary-border p-4 relative shadow-sm">
          <button 
            onClick={() => setWeeklyInsight(null)} 
            className="absolute top-3 right-3 text-sanctuary-muted hover:text-sanctuary-text"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-sanctuary-accent" />
            <h4 className="text-sm font-semibold text-sanctuary-text">{weeklyInsight.title}</h4>
          </div>
          <p className="text-sm text-sanctuary-muted leading-relaxed">
            {weeklyInsight.summary}
          </p>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-sanctuary-surface border border-sanctuary-border/60 space-y-1 shadow-soft">
          <span className="text-[10px] text-sanctuary-muted flex items-center gap-1.5 uppercase font-mono">
            <BookOpen className="w-3.5 h-3.5 text-sanctuary-blue" /> Volume
          </span>
          <p className="text-base font-semibold text-sanctuary-text">
            {stats.wordsLogged} <span className="text-[10px] font-normal text-sanctuary-muted">words</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-sanctuary-surface border border-sanctuary-border/60 space-y-1 shadow-soft">
          <span className="text-[10px] text-sanctuary-muted flex items-center gap-1.5 uppercase font-mono">
            <BatteryCharging className="w-3.5 h-3.5 text-sanctuary-accent" /> State
          </span>
          <p className="text-xs font-medium text-sanctuary-text truncate pt-0.5">
            {stats.dominant}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-sanctuary-surface border border-sanctuary-border/60 space-y-1 shadow-soft">
          <span className="text-[10px] text-sanctuary-muted flex items-center gap-1.5 uppercase font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-500/70" /> Active Days
          </span>
          <p className="text-base font-semibold text-sanctuary-text">
            {stats.last7Days.filter(d => d.score !== 0).length} <span className="text-[10px] font-normal text-sanctuary-muted">/ 7</span>
          </p>
        </div>
      </div>

      {/* 7-Day SVG Trend Sparkline */}
      <div className="pt-3 space-y-3">
        <div className="h-16 w-full flex items-center justify-center">
          <svg viewBox="0 0 200 50" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="gradientTrend" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--sanctuary-blue)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--sanctuary-accent)" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Subtle Grid Baseline */}
            <line x1="10" y1="25" x2="190" y2="25" stroke="currentColor" strokeDasharray="3 3" className="text-sanctuary-border" strokeWidth="1" />

            {/* Trajectory Polyline */}
            <polyline
              fill="none"
              stroke="url(#gradientTrend)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={stats.points}
            />

            {/* Individual Data Node Dots */}
            {stats.points.split(' ').map((pt, i) => {
              const [cx, cy] = pt.split(',');
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  className="fill-sanctuary-surface stroke-sanctuary-accent"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Day Labels Under Sparkline */}
        <div className="flex justify-between px-2 text-[10px] font-mono text-sanctuary-muted">
          {stats.last7Days.map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
        </div>
      </div>

    </section>
  );
}
