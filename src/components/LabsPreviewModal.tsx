import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PenTool, Fingerprint, Cloud, Battery, Sparkles, Check } from 'lucide-react';

interface LabsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabsPreviewModal: React.FC<LabsPreviewModalProps> = ({ isOpen, onClose }) => {
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const handleJoinWaitlist = () => {
    setWaitlistJoined(true);
    setTimeout(() => {
      onClose();
      // Reset after animation
      setTimeout(() => setWaitlistJoined(false), 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/20 dark:bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-sanctuary-surface border border-sanctuary-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sanctuary-border/50 bg-sanctuary-surface-raised relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-sanctuary-muted uppercase block mb-0.5">Labs 01 Preview</span>
                  <h2 className="text-sm font-semibold text-sanctuary-text tracking-wide uppercase">Hardware Smart Pen</h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="relative p-2 rounded-full text-sanctuary-muted hover:text-sanctuary-text hover:bg-sanctuary-bg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 sm:p-10 bg-sanctuary-bg overflow-y-auto max-h-[80vh]">
              <div className="text-center max-w-lg mx-auto mb-10 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-serif text-sanctuary-text leading-tight">
                  The tactile bridge to<br />your digital sanctuary.
                </h3>
                <p className="text-sm sm:text-base font-serif text-sanctuary-muted leading-relaxed">
                  We believe in the therapeutic power of putting physical ink to paper. 
                  The Persona Smart Pen seamlessly digitizes your handwritten journals into 
                  the Sanctuary, combining the unhurried focus of analog writing with 
                  the deep psychological reframing of our AI models.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-sanctuary-surface border border-sanctuary-border rounded-2xl p-5 space-y-3">
                  <PenTool className="w-5 h-5 text-sanctuary-blue" />
                  <h4 className="text-sm font-semibold text-sanctuary-text tracking-wide">Real-Time Digitation</h4>
                  <p className="text-sm font-serif text-sanctuary-muted leading-relaxed">
                    Invisible micro-cameras capture your strokes as you write. Your entries appear in the Sanctuary instantly without ever breaking your flow.
                  </p>
                </div>
                
                <div className="bg-sanctuary-surface border border-sanctuary-border rounded-2xl p-5 space-y-3">
                  <Fingerprint className="w-5 h-5 text-sanctuary-accent" />
                  <h4 className="text-sm font-semibold text-sanctuary-text tracking-wide">Biometric Grip</h4>
                  <p className="text-sm font-serif text-sanctuary-muted leading-relaxed">
                    Subtle tension sensors in the barrel detect grip pressure, tagging your journal entries with physical stress context before the AI even reads a word.
                  </p>
                </div>

                <div className="bg-sanctuary-surface border border-sanctuary-border rounded-2xl p-5 space-y-3">
                  <Cloud className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-sm font-semibold text-sanctuary-text tracking-wide">Offline-First Buffer</h4>
                  <p className="text-sm font-serif text-sanctuary-muted leading-relaxed">
                    Leave your phone in the other room. The pen stores up to 60 days of writing locally, syncing automatically via encrypted Bluetooth when in range.
                  </p>
                </div>

                <div className="bg-sanctuary-surface border border-sanctuary-border rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <Battery className="w-5 h-5 text-stone-500" />
                    <h4 className="text-sm font-semibold text-sanctuary-text tracking-wide mt-3 mb-2">Month-Long Battery</h4>
                    <p className="text-sm font-serif text-sanctuary-muted leading-relaxed">
                      Designed to be out of mind. An ultra-low power core means you only charge it when you change the ink cartridge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-sanctuary-border bg-sanctuary-surface flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-serif italic text-sanctuary-muted">
                Currently in private prototyping phase.
              </span>
              <button 
                onClick={handleJoinWaitlist}
                disabled={waitlistJoined}
                className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-full 
                         bg-sanctuary-text text-sanctuary-bg 
                         hover:bg-sanctuary-text/90 active:scale-[0.98]
                         text-xs font-semibold tracking-wider uppercase
                         shadow-sm transition-all flex justify-center items-center gap-2
                         disabled:opacity-90 disabled:scale-100"
              >
                {waitlistJoined ? (
                  <>
                    <Check className="w-4 h-4" /> Waitlist Joined
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
