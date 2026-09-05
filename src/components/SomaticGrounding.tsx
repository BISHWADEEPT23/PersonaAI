import React, { useState, useEffect } from 'react';
import { Wind, X, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

const PHASES = [
  { label: 'Inhale deeply...', duration: 4, scale: 'scale-125', color: 'border-sanctuary-blue/40 text-sanctuary-blue' },
  { label: 'Hold breath...', duration: 4, scale: 'scale-125', color: 'border-sanctuary-accent/40 text-sanctuary-accent' },
  { label: 'Exhale slowly...', duration: 4, scale: 'scale-75', color: 'border-sanctuary-muted/40 text-sanctuary-muted' },
  { label: 'Hold empty...', duration: 4, scale: 'scale-75', color: 'border-sanctuary-text/20 text-sanctuary-text' }
];

interface SomaticGroundingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SomaticGrounding({ isOpen, onClose }: SomaticGroundingProps) {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPhaseIndex((currPhase) => {
              const nextPhase = (currPhase + 1) % PHASES.length;
              if (nextPhase === 0) {
                setCyclesCompleted((c) => c + 1);
              }
              return nextPhase;
            });
            return PHASES[(phaseIndex + 1) % PHASES.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="fixed inset-0 z-50 bg-sanctuary-bg/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-sanctuary-surface border border-sanctuary-border w-full max-w-md rounded-[24px] p-6 shadow-soft space-y-6 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sanctuary-border/60 pb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-sanctuary-bg border border-sanctuary-border text-sanctuary-accent shadow-sm">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-sanctuary-text">60s Somatic Grounding</h3>
              <p className="text-[11px] text-sanctuary-muted mt-0.5">Nervous system regulation via box breathing</p>
            </div>
          </div>
          <button onClick={() => { handleReset(); onClose(); }} className="badge-frosted p-1.5 text-sanctuary-muted hover:text-sanctuary-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Breathing Circle */}
        <div className="relative h-56 flex flex-col items-center justify-center">
          {/* Animated Halo */}
          <div
            className={`w-40 h-40 rounded-full border-4 ${currentPhase.color} flex items-center justify-center transition-all duration-[1000ms] ease-out ${
              isActive ? currentPhase.scale : 'scale-100'
            } bg-sanctuary-surface-raised shadow-soft`}
          >
            <div className="space-y-1">
              <span className="text-3xl font-mono font-medium text-sanctuary-text">
                {isActive ? secondsLeft : '4'}
              </span>
              <p className="text-[10px] font-medium tracking-wide uppercase text-sanctuary-muted">
                {isActive ? currentPhase.label : 'Ready'}
              </p>
            </div>
          </div>
        </div>

        {/* Guidance & Cycle Counter */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-sanctuary-muted">
            <span>Cycles completed:</span>
            <span className="font-mono font-medium text-sanctuary-text">{cyclesCompleted} / 4</span>
            {cyclesCompleted >= 4 && (
              <CheckCircle2 className="w-4 h-4 text-sanctuary-accent ml-1 inline" />
            )}
          </div>
          <p className="text-xs text-sanctuary-muted italic px-4">
            "Lower your shoulders, release the tension in your jaw, and rest your hands flat."
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-sanctuary-border/60">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-soft text-sanctuary-text text-xs font-semibold shadow-sm transition"
          >
            <Play className={`w-3.5 h-3.5 ${isActive ? 'fill-current opacity-80' : ''}`} />
            <span>{isActive ? 'Pause' : cyclesCompleted > 0 ? 'Resume' : 'Begin Grounding'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-sanctuary-border text-sanctuary-muted hover:bg-sanctuary-surface-raised transition shadow-sm"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
