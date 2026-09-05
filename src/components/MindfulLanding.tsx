import React from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PeacockQuillNibLogo } from './PeacockQuillNibLogo';
import { CalmParticles } from './CalmParticles';
import { LabsPreviewModal } from './LabsPreviewModal';

export default function MindfulLanding() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [showLabsModal, setShowLabsModal] = React.useState(false);

  // Moonrise feather animation variants
  const featherVariants: Variants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : {
          y: '65vh',
          opacity: 0,
          scale: 0.94,
          filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
        },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.04))',
      transition: shouldReduceMotion
        ? { duration: 1.2, ease: 'easeOut' }
        : {
            duration: 3.2,
            ease: [0.16, 1, 0.3, 1], // Smooth exponential ease-out
          },
    },
  };

  // Subtle resting float variants (Stage 4)
  const floatVariants: Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [-3, 3, -3],
          transition: {
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
  };

  // Sequential typography container variants (Stage 5)
  const contentContainerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: shouldReduceMotion ? 0.3 : 3.0, // Waits for moonrise to settle
        staggerChildren: 0.22,
      },
    },
  };

  const itemFadeUp: Variants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-12 select-none overflow-hidden bg-sanctuary-bg text-sanctuary-text">
      
      {/* 1. Subtle Paper Texture Background & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#D6CEBF_1px,transparent_1px)] [background-size:24px_24px]" 
      />
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(235,229,219,0.5)_100%)]" 
      />

      {/* Top Spacer for Vertical Balance */}
      <div className="w-full h-8" />

      {/* 2. Core Focal Point: Feather, Title, and Call to Action */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        
        {/* Floating Feather Badge */}
        <div className="relative mb-4 group cursor-pointer transition-transform duration-500 ease-out hover:scale-105">
          <div className="absolute inset-0 -z-10 rounded-full bg-emerald-500/15 dark:bg-teal-400/20 blur-3xl transform scale-125 pointer-events-none" />
          <div className="relative animate-[float_6s_ease-in-out_infinite]">
            <PeacockQuillNibLogo 
              className="w-44 h-56 sm:w-48 sm:h-64 drop-shadow-[0_12px_28px_rgba(12,62,69,0.18)]" 
              onNibClick={() => setShowLabsModal(true)} 
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLabsModal(true)}
          aria-label="Hardware Labs Preview"
          title="Hardware Labs Preview"
          className="relative mb-6 p-2 rounded-full 
                     bg-stone-200/40 dark:bg-stone-800/50 
                     border border-stone-300/40 dark:border-stone-700/50 
                     hover:bg-stone-200 dark:hover:bg-stone-800 
                     transition-all cursor-pointer flex items-center justify-center"
        >
          {/* Ping ripple effect */}
          <span className="absolute w-2 h-2 rounded-full bg-teal-500/75 animate-ping" style={{ animationDuration: '4s' }} />
          
          {/* Solid center dot */}
          <span className="relative w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400" />
        </button>

        {/* Brand Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-sanctuary-text mb-3">
          PersonaAI
        </h1>

        {/* Minimalist Divider */}
        <div className="w-10 h-[1.5px] bg-sanctuary-border rounded-full mb-6" />

        {/* Emotional Subtitle */}
        <p className="font-serif italic text-base sm:text-lg text-sanctuary-muted max-w-md leading-relaxed mb-10 font-normal">
          A quiet sanctuary to pause, breathe, and reflect. Transform raw thoughts into gentle clarity through mindful dialogue.
        </p>

        {/* Primary & Secondary Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={() => navigate('/login')}
            type="button"
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-sanctuary-text hover:opacity-90 text-sanctuary-bg text-xs font-semibold tracking-wider uppercase shadow-[0_8px_20px_rgba(35,43,56,0.18)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(35,43,56,0.26)] active:scale-[0.98]"
          >
            Begin Reflection
          </button>

          <button
            onClick={() => {}}
            type="button"
            className="w-full sm:w-auto min-w-[190px] px-8 py-3.5 rounded-2xl 
                       bg-white/70 dark:bg-stone-900/60 
                       hover:bg-white dark:hover:bg-stone-800 
                       border border-[#DDD5C7] dark:border-stone-700 
                       text-[#4A5463] dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 
                       text-xs font-semibold tracking-wider uppercase 
                       shadow-sm transition-all active:scale-[0.98]"
          >
            Explore Philosophy
          </button>
        </div>

      </div>

      {/* 3. Reassurance Micro-Footer */}
      <footer className="relative z-10 pt-8">
        <span className="text-[10px] font-mono tracking-[0.25em] text-sanctuary-muted uppercase">
          Encrypted &nbsp;·&nbsp; Private &nbsp;·&nbsp; Unrushed
        </span>
      </footer>

    </main>
  );
}
