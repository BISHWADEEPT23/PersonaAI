import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Brain, Heart, Eye, Footprints } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Philosophy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text selection:bg-sanctuary-blue/20">
      <nav className="fixed top-0 left-0 right-0 p-6 sm:p-10 z-50 bg-sanctuary-bg/80 backdrop-blur-sm border-b border-sanctuary-border/50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-sanctuary-muted hover:text-sanctuary-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 sm:px-12 pt-40 pb-32 space-y-32">
        <header className="space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-sanctuary-text leading-tight"
          >
            A Sanctuary for the <br /> Modern Mind.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl font-serif text-sanctuary-muted leading-relaxed max-w-2xl"
          >
            PersonaAI is not a productivity tool. It is a behavioral sanctuary designed to help you process reality through structured psychological reframing, with absolute zero-trust privacy.
          </motion.p>
        </header>

        <section className="space-y-16">
          <div className="border-t border-sanctuary-border pt-16">
            <span className="text-xs font-mono tracking-widest text-sanctuary-muted uppercase mb-12 block">
              01 // The Four Lenses
            </span>
            <div className="space-y-20">
              {/* Stoic Lens */}
              <div className="grid sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 items-start">
                <div className="flex flex-col gap-4">
                  <Brain className="w-6 h-6 text-sanctuary-accent" />
                  <h3 className="text-xl font-serif">Stoic Agency</h3>
                </div>
                <p className="text-base sm:text-lg text-sanctuary-muted leading-relaxed font-serif">
                  We isolate the dichotomy of control. The engine helps you untangle what is within your agency from what is external, anchoring your energy strictly on actionable reality rather than abstract anxiety.
                </p>
              </div>

              {/* Compassion Lens */}
              <div className="grid sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 items-start">
                <div className="flex flex-col gap-4">
                  <Heart className="w-6 h-6 text-sanctuary-blue" />
                  <h3 className="text-xl font-serif">Compassion</h3>
                </div>
                <p className="text-base sm:text-lg text-sanctuary-muted leading-relaxed font-serif">
                  A defense against the inner critic. We reframe reflections to normalize the universal human experience, deliberately stripping away unhelpful self-blame, shame, and catastrophic thinking.
                </p>
              </div>

              {/* Horizon Lens */}
              <div className="grid sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 items-start">
                <div className="flex flex-col gap-4">
                  <Eye className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-xl font-serif">Horizon Zoom</h3>
                </div>
                <p className="text-base sm:text-lg text-sanctuary-muted leading-relaxed font-serif">
                  Temporal zooming disrupts acute stress. By forcing a 5-year perspective shift on present-day concerns, the framework deflates immediate panic into manageable historical context.
                </p>
              </div>

              {/* Somatic Lens */}
              <div className="grid sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 items-start">
                <div className="flex flex-col gap-4">
                  <Footprints className="w-6 h-6 text-stone-500" />
                  <h3 className="text-xl font-serif">Somatic Off-Ramp</h3>
                </div>
                <p className="text-base sm:text-lg text-sanctuary-muted leading-relaxed font-serif">
                  The ultimate goal of this application is for you to leave it. Every session concludes with a tangible physical anchor—a stretch, a deep breath, or a walk—to cleanly sever the digital connection and return you to the physical world.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-16">
          <div className="border-t border-sanctuary-border pt-16">
            <span className="text-xs font-mono tracking-widest text-sanctuary-muted uppercase mb-12 block">
              02 // Production Directives
            </span>
            <div className="grid sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 items-start">
              <div className="flex flex-col gap-4">
                <Shield className="w-6 h-6 text-sanctuary-text" />
                <h3 className="text-xl font-serif">Zero-Trust Isolation</h3>
              </div>
              <p className="text-base sm:text-lg text-sanctuary-muted leading-relaxed font-serif">
                Your thoughts are the most private data you generate. We employ absolute zero-trust isolation. Data operations are mapped exclusively to your unique user identifier. We do not query across collections, and we do not use your reflections to train base models. Your sanctuary is sealed.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-24 text-center">
          <p className="text-xs font-mono tracking-[0.2em] text-sanctuary-muted uppercase">
            End of Manifesto
          </p>
        </footer>
      </main>
    </div>
  );
}
