import React, { useState, useEffect } from 'react';
import GenReflect from './GenReflect';
import { PeacockQuillNibLogo } from '../components/PeacockQuillNibLogo';

export default function LabsTransitionWrapper() {
  const [stage, setStage] = useState<'idle' | 'expanding' | 'opened'>('idle');

  useEffect(() => {
    // Automatically trigger transition on mount to create a seamless routing effect
    if (stage === 'idle') {
      setStage('expanding');
      // Wait 1.1s for the feather and aura to expand and dissolve before unveiling GenReflect
      const timer = setTimeout(() => {
        setStage('opened');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  if (stage === 'opened') {
    return (
      <div className="animate-fadeIn transition-opacity duration-700">
        <GenReflect />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F9F7F1] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Subtle Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#2C332B 0.75px, transparent 0.75px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Central Illuminated Aura */}
      <div 
        className={`absolute rounded-full pointer-events-none transition-all duration-1000 ease-out ${
          stage === 'expanding'
            ? 'w-[200vw] h-[200vw] bg-radial from-[#D3ECE1]/90 via-[#F3EFE6]/95 to-[#F9F7F1] opacity-100 scale-150'
            : 'w-96 h-96 bg-[#E2F0EA]/60 blur-3xl opacity-80'
        }`}
      />

      {/* Main Illustration: Peacock Feather & Calligraphy Nib */}
      <div 
        className={`relative z-10 cursor-pointer flex flex-col items-center transition-all duration-1000 ease-in-out transform ${
          stage === 'expanding'
            ? 'scale-[2.4] opacity-0 blur-md translate-y-[-10px]'
            : 'hover:scale-105 active:scale-95'
        }`}
        title="Tap to unveil GenReflect"
      >
        <PeacockQuillNibLogo 
          className="w-64 sm:w-80 h-auto drop-shadow-sm select-none pointer-events-none text-[#2C332B]" 
        />

        {/* Ambient Pulsing Trigger Ring */}
        <div className="mt-8 flex items-center justify-center">
          <div className="relative w-9 h-9 rounded-full border border-[#2D6A4F]/20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] animate-pulse" style={{ animationDuration: '4s' }} />
            <span className="absolute inset-0 rounded-full border border-[#2D6A4F]/40 animate-ping" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      </div>

      {/* Subtitle guidance */}
      <p 
        className={`absolute bottom-8 font-serif text-xs tracking-widest text-[#2C332B]/50 transition-opacity duration-500 uppercase ${
          stage === 'expanding' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Click to unveil Labs 01 Concept
      </p>

      {/* Tailwind inline animation fallback */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
