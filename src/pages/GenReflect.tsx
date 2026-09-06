import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit3, Cloud, Lightbulb, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SegmentedBar = ({ activeCount, colorClass, inactiveClass }: { activeCount: number, colorClass: string, inactiveClass: string }) => (
  <div className="flex gap-1 mt-2">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i} 
        className={`h-1.5 flex-1 rounded-sm ${i < activeCount ? colorClass : inactiveClass}`} 
      />
    ))}
  </div>
);

export default function GenReflect() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#1E231B] font-sans selection:bg-[#2D4A22]/20 relative pb-12 overflow-x-hidden">
      
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-[#F4F1E9]/90 backdrop-blur-md px-4 py-2 text-[#1E231B] rounded-full hover:bg-[#1E231B] hover:text-[#DCD6C8] transition-all shadow-sm border border-[#1E231B]/10 group"
        title="Go Back"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="font-sans font-medium text-sm">Back</span>
      </button>

      {/* SECTION 1: Two pieces. One ritual. */}
      <section className="pt-24 pb-20 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <FadeIn>
          <h2 className="text-5xl sm:text-7xl font-serif text-[#1F241D] text-center mb-16 tracking-tight">
            Two pieces. <span className="italic text-[#93724B]">One ritual.</span>
          </h2>
        </FadeIn>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Smart Pen Card */}
          <FadeIn delay={0.1}>
            <div className="h-full rounded-[2rem] bg-gradient-to-br from-[#1B2232] to-[#192A1F] p-8 sm:p-12 flex flex-col justify-between overflow-hidden relative shadow-xl group">
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#194025] bg-[#102B19]/50 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[11px] font-bold tracking-widest text-[#34D399] uppercase">Smart Pen</span>
                </div>
                <span className="font-mono text-xs text-white/30 tracking-widest uppercase">Gen 01</span>
              </div>
              
              <div className="relative z-10 mb-10 rounded-2xl overflow-hidden h-48 sm:h-64 shadow-2xl shadow-black/40 group-hover:scale-[1.02] transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800" alt="Pen" className="w-full h-full object-cover opacity-90 mix-blend-luminosity" />
                <div className="absolute top-6 left-6 w-8 h-8 bg-[#34D399] blur-xl opacity-50 rounded-full" />
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-4xl font-serif text-white mb-4">GenReflect <span className="italic text-[#34D399]">Pen</span></h3>
                <p className="text-[#9BA1A6] text-sm leading-relaxed max-w-sm mb-12">
                  Engineered for the way you actually write. Every stroke captured at 4096 pressure levels — synced before your hand lifts off the page.
                </p>
                
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <div className="text-xl font-serif text-white mb-1">High <span className="text-[11px] font-sans text-white/50 uppercase tracking-widest ml-1">precision</span></div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Pressure Sensing</div>
                    <SegmentedBar activeCount={8} colorClass="bg-[#34D399]" inactiveClass="bg-[#34D399]/20" />
                  </div>
                  <div>
                    <div className="text-xl font-serif text-white mb-1">Near <span className="text-[11px] font-sans text-white/50 uppercase tracking-widest ml-1">instant</span></div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Sync Speed</div>
                    <SegmentedBar activeCount={7} colorClass="bg-[#34D399]" inactiveClass="bg-[#34D399]/20" />
                  </div>
                  <div>
                    <div className="text-xl font-serif text-white mb-1">All <span className="text-[11px] font-sans text-white/50 uppercase tracking-widest ml-1">day</span></div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Battery Life</div>
                    <SegmentedBar activeCount={6} colorClass="bg-[#34D399]" inactiveClass="bg-[#34D399]/20" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Syncing Pad Card */}
          <FadeIn delay={0.2}>
            <div className="h-full rounded-[2rem] bg-gradient-to-br from-[#FDFBF7] to-[#F1EADC] border border-[#E8DCC0] p-8 sm:p-12 flex flex-col justify-between overflow-hidden relative shadow-lg group">
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D5C6AC] bg-white/50 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#93724B]" />
                  <span className="text-[11px] font-bold tracking-widest text-[#93724B] uppercase">Syncing Pad</span>
                </div>
                <span className="font-mono text-xs text-[#93724B]/60 tracking-widest uppercase">A5 Format</span>
              </div>
              
              <div className="relative z-10 mb-10 rounded-2xl overflow-hidden h-48 sm:h-64 shadow-xl shadow-[#93724B]/10 group-hover:scale-[1.02] transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800" alt="Writing" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7]/80 via-[#FDFBF7]/20 to-transparent" />
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-4xl font-serif text-[#1F241D] mb-4">GenReflect <span className="italic text-[#93724B]">Pad</span></h3>
                <p className="text-[#5B5F5A] text-sm leading-relaxed max-w-sm mb-12">
                  Not just a notebook. An intelligent surface that listens. Premium paper meets an electromagnetic grid — invisible to the eye, essential to the experience.
                </p>
                
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D5C6AC]/50">
                  <div>
                    <div className="text-xl font-serif text-[#1F241D] mb-1">Premium <span className="text-[11px] font-sans text-[#5B5F5A]/60 uppercase tracking-widest ml-1">grade</span></div>
                    <div className="text-[10px] font-bold text-[#5B5F5A]/60 uppercase tracking-widest mb-3">Paper Quality</div>
                    <SegmentedBar activeCount={8} colorClass="bg-[#BFA785]" inactiveClass="bg-[#E5DCC5]" />
                  </div>
                  <div>
                    <div className="text-xl font-serif text-[#1F241D] mb-1">Dot <span className="text-[11px] font-sans text-[#5B5F5A]/60 uppercase tracking-widest ml-1">grid</span></div>
                    <div className="text-[10px] font-bold text-[#5B5F5A]/60 uppercase tracking-widest mb-3">Grid Style</div>
                    <SegmentedBar activeCount={8} colorClass="bg-[#BFA785]" inactiveClass="bg-[#E5DCC5]" />
                  </div>
                  <div>
                    <div className="text-xl font-serif text-[#1F241D] mb-1">A5 <span className="text-[11px] font-sans text-[#5B5F5A]/60 uppercase tracking-widest ml-1">size</span></div>
                    <div className="text-[10px] font-bold text-[#5B5F5A]/60 uppercase tracking-widest mb-3">Format</div>
                    <SegmentedBar activeCount={8} colorClass="bg-[#BFA785]" inactiveClass="bg-[#E5DCC5]" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 2: Three steps. One ritual. */}
      <section className="pt-16 pb-20 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <h2 className="text-5xl sm:text-7xl font-serif text-[#1F241D] tracking-tight">
              Three steps. <span className="italic text-[#2D4A22]">One<br/>ritual.</span>
            </h2>
            <p className="text-[#5B5F5A] text-sm lg:text-right max-w-xs leading-relaxed">
              From blank page to searchable digital note —<br/>without changing how you write.
            </p>
          </div>
        </FadeIn>
        
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Step 01 */}
          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="h-full rounded-[2rem] bg-[#294020] p-8 sm:p-10 flex flex-col relative shadow-xl">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-[#8BA683] tracking-widest uppercase">Step 01</span>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3A5D2E] bg-[#1E3618]/50 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#44A968]" />
                    <span className="text-[10px] font-bold tracking-widest text-[#44A968] uppercase">Open the pad</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#3A5D2E] flex items-center justify-center text-[#8BA683]">
                  <Edit3 className="w-4 h-4" />
                </div>
              </div>
              
              <h3 className="text-4xl font-serif text-white mb-6">Write on the syncing pad</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-16 max-w-sm">
                Place the GenReflect pad on any surface. Open to a fresh page. The electromagnetic grid beneath the paper is already listening — invisible, silent, ready.
              </p>
              
              <div className="mt-auto p-6 rounded-2xl bg-[#1E3316] border border-[#345125] shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#162510]/50 pointer-events-none" />
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
                  <span className="text-[10px] font-mono tracking-widest text-[#8BA683] uppercase">Pad Active</span>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-0.5 w-full bg-[#34D399]/40 rounded-full" />
                  <div className="h-0.5 w-3/4 bg-[#34D399]/40 rounded-full" />
                  <div className="h-0.5 w-1/2 bg-[#34D399]/40 rounded-full" />
                </div>
                <div className="text-xs font-mono text-[#8BA683] flex items-center gap-1">
                  <span className="w-1 h-3.5 bg-[#34D399] animate-pulse" /> writing...
                </div>
              </div>
              
              <div className="mt-8 text-[9px] font-mono tracking-widest text-[#8BA683] uppercase">
                Premium Dot-Grid Paper • A5 Format
              </div>
            </div>
          </FadeIn>
          
          {/* Steps 02 & 03 Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Step 02 */}
            <FadeIn delay={0.2} className="flex-1">
              <div className="h-full rounded-[2rem] bg-[#F7F2E3] border border-[#E8DCC0] p-8 sm:p-10 flex flex-col sm:flex-row gap-8 shadow-sm">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="space-y-4 mb-8">
                      <span className="font-mono text-[10px] text-[#A58558]/80 tracking-widest uppercase">Step 02</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D5C6AC] bg-white/50 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A58558]" />
                        <span className="text-[10px] font-bold tracking-widest text-[#A58558] uppercase">Pick up the pen</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif text-[#1F241D] mb-4">Pen captures every thought</h3>
                    <p className="text-[#5B5F5A] text-sm leading-relaxed max-w-sm">
                      The GenReflect pen writes exactly like a quality ballpoint. As your hand moves, pressure, angle, and position are recorded in real time — no lag, no interruption.
                    </p>
                  </div>
                </div>
                <div className="sm:w-72 flex-shrink-0 flex flex-col">
                  <div className="w-10 h-10 ml-auto mb-6 rounded-full border border-[#D5C6AC] flex items-center justify-center text-[#A58558]">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div className="mt-auto p-5 rounded-2xl bg-[#F0E6CD] border border-[#E0D2AF] shadow-inner">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A58558]" />
                      <span className="text-[10px] font-mono tracking-widest text-[#8B6F47] uppercase">Capturing</span>
                    </div>
                    <div className="space-y-3 mb-8">
                      <div className="h-1.5 w-[90%] bg-[#A58558] rounded-full" />
                      <div className="h-1.5 w-[75%] bg-[#C4A982] rounded-full" />
                      <div className="h-1.5 w-[95%] bg-[#B3946A] rounded-full" />
                      <div className="h-1.5 w-[60%] bg-[#A58558] rounded-full" />
                      <div className="h-1.5 w-[85%] bg-[#D5C4A6] rounded-full" />
                    </div>
                    <div className="text-[9px] font-mono tracking-widest text-[#8B6F47] uppercase border-t border-[#D5C6AC]/40 pt-4 mt-2">
                      Pressure-sensitive • Bluetooth ready
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Step 03 */}
            <FadeIn delay={0.3} className="flex-1">
              <div className="h-full rounded-[2rem] bg-[#E7DEFA] border border-[#D1BFF0] p-8 sm:p-10 flex flex-col sm:flex-row gap-8 shadow-sm">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="space-y-4 mb-8">
                      <span className="font-mono text-[10px] text-[#715099]/80 tracking-widest uppercase">Step 03</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5AFF0] bg-white/40 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#715099]" />
                        <span className="text-[10px] font-bold tracking-widest text-[#715099] uppercase">Watch it appear</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif text-[#1F241D] mb-4">Real-time sync to your device</h3>
                    <p className="text-[#5B5F5A] text-sm leading-relaxed max-w-sm">
                      The moment your pen lifts, your words are already in the app. Searchable, shareable, and safe — your handwriting lives digitally without you doing a thing.
                    </p>
                  </div>
                </div>
                <div className="sm:w-72 flex-shrink-0 flex flex-col">
                  <div className="w-10 h-10 ml-auto mb-6 rounded-full border border-[#C5AFF0] bg-white/20 flex items-center justify-center text-[#715099]">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="mt-auto p-5 rounded-2xl bg-[#F4EFFF] border border-[#DCD1F5] shadow-inner">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#715099]" />
                      <span className="text-[10px] font-mono tracking-widest text-[#715099] uppercase">Synced</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center text-[11px] text-[#624E82] font-medium">
                        <span>Phone</span> <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#715099]" /> <Check className="w-3.5 h-3.5 text-[#715099]" /></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#624E82] font-medium">
                        <span>Tablet</span> <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#715099]" /> <Check className="w-3.5 h-3.5 text-[#715099]" /></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#624E82] font-medium">
                        <span>Browser</span> <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#715099]" /> <Check className="w-3.5 h-3.5 text-[#715099]" /></div>
                      </div>
                    </div>
                    <div className="text-[9px] font-mono tracking-widest text-[#856CA8] uppercase border-t border-[#DCD1F5] pt-4 mt-2">
                      Near-instant • Cross-platform
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
          </div>
        </div>
      </section>

      {/* SECTION 3: The idea is simple. */}
      <section className="relative pt-24 pb-20 px-6 sm:px-12 w-full">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#D6D1C4_1px,transparent_1px)] opacity-50" style={{ backgroundSize: '60px 60px' }} />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <FadeIn className="mb-14 max-w-2xl">
            <h2 className="text-5xl sm:text-7xl font-serif text-[#1F241D] tracking-tight mb-6">
              The idea is <span className="italic text-[#93724B]">simple.</span>
            </h2>
            <p className="text-[#5B5F5A] text-base leading-relaxed">
              Your handwriting carries something a keyboard never will — intention, texture,<br className="hidden sm:block"/> and feeling. GenReflect is being built to honor that.
            </p>
          </FadeIn>
          
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Card 001 */}
            <FadeIn delay={0.1} className="lg:col-span-8">
              <div className="h-full min-h-[500px] rounded-[2rem] bg-gradient-to-br from-[#243A1C] to-[#1C2C16] p-8 sm:p-12 flex flex-col justify-between relative shadow-xl overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4A7C28] opacity-10 blur-[100px] rounded-full pointer-events-none" />
                <div className="flex justify-between items-start mb-16 relative z-10">
                  <span className="font-mono text-xs text-[#8BA683] tracking-widest">[001]</span>
                  <div className="w-10 h-10 rounded-full border border-[#3A5D2E] flex items-center justify-center text-[#8BA683]">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="mb-16 relative z-10">
                  <h3 className="text-5xl sm:text-6xl font-serif text-white mb-8 tracking-tight">Analog soul. <span className="italic text-[#34D399]">Digital memory.</span></h3>
                  <p className="text-white/80 text-base leading-relaxed max-w-lg">
                    The concept behind GenReflect is to make the act of writing on paper feel magical again — by giving every word you write a second life in your digital world. No scanning, no photographing, no typing. Just write.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 mb-16 max-w-3xl relative z-10">
                  {[
                    { title: "Write naturally", desc: "On real paper, with real ink" },
                    { title: "Sync instantly", desc: "Appears in your app as you write" },
                    { title: "Search everything", desc: "Find any note by keyword" },
                    { title: "Keep the original", desc: "Physical and digital, both preserved" }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-2 h-2 rounded-full bg-[#34D399] mt-1.5 shrink-0 shadow-[0_0_8px_#34D399]" />
                      <div>
                        <div className="text-base font-bold text-white mb-1.5">{feature.title}</div>
                        <div className="text-xs text-[#8BA683]">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-8 border-t border-[#3A5D2E]/60 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
                    <span className="font-mono text-[10px] uppercase text-[#34D399] tracking-widest">Concept Active</span>
                  </div>
                  <div className="flex gap-1.5 w-32">
                    <div className="h-1.5 flex-[2] bg-[#34D399] rounded-full" />
                    <div className="h-1.5 flex-1 bg-[#34D399]/30 rounded-full" />
                    <div className="h-1.5 flex-1 bg-[#34D399]/30 rounded-full" />
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Cards 002 & 003 Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <FadeIn delay={0.2} className="flex-1">
                <div className="h-full rounded-[2rem] bg-[#FDFBF7] border border-[#E8DCC0] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-12">
                      <span className="font-mono text-xs text-[#93724B]/60 tracking-widest">[002]</span>
                      <div className="w-10 h-10 rounded-full border border-[#D5C6AC] flex items-center justify-center text-[#93724B]">
                        <Edit3 className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-serif text-[#1F241D] mb-4">Still feels like <span className="italic text-[#93724B]">writing</span></h3>
                    <p className="text-[#5B5F5A] text-sm leading-relaxed mt-4">
                      No special paper. No weird digital stylus. The GenReflect pen writes on the pad exactly like a quality ballpoint — because it is one.
                    </p>
                  </div>
                  <div className="mt-16 pt-6 border-t border-[#D5C6AC]/50 text-[10px] uppercase tracking-widest font-bold text-[#93724B]/70">
                    Natural writing experience
                  </div>
                </div>
              </FadeIn>

              {/* 003 Card */}
              <FadeIn delay={0.3} className="flex-1">
                <div className="h-full rounded-[2rem] bg-[#E7DEFA] border border-[#D1BFF0] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#715099] opacity-10 blur-[40px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <span className="font-mono text-xs text-[#715099]/60 tracking-widest">[003]</span>
                      <div className="w-10 h-10 rounded-full border border-[#C5AFF0] bg-white/40 flex items-center justify-center text-[#715099]">
                        <Cloud className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-serif text-[#1F241D] mb-4">Lives in your <span className="italic text-[#715099]">cloud</span></h3>
                    <p className="text-[#5B5F5A] text-sm leading-relaxed mt-4">
                      Every note, every journal entry — searchable, shareable, and safe. Accessible from your phone, tablet, or browser instantly.
                    </p>
                  </div>
                  <div className="mt-16 pt-6 border-t border-[#D1BFF0]/80 text-[10px] uppercase tracking-widest font-bold text-[#715099]/80 relative z-10">
                    Cross-platform sync
                  </div>
                </div>
              </FadeIn>
            </div>
            
          </div>
        </div>
      </section>

      {/* SECTION 4: Your pen already knows the way. */}
      <section className="pt-24 pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          <FadeIn className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4CEBF] mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D4A22]" />
              <span className="text-[10px] font-bold tracking-widest text-[#2D4A22] uppercase">For Journalers & Writers</span>
            </div>
            
            <h2 className="text-5xl sm:text-7xl font-serif text-[#1F241D] leading-[1.05] mb-12 tracking-tight">
              Your pen already <span className="italic text-[#6B854A]">knows the way.</span>
            </h2>
            
            <div className="space-y-6 text-[#5B5F5A] text-base leading-relaxed max-w-lg mb-12">
              <p>
                Journaling is one of the most personal acts a person can perform. The weight of the pen, the texture of the paper, the rhythm of your own handwriting — these are not just habits. They are how you think.
              </p>
              <p>
                GenReflect is being built for those of you who refuse to give that up — but still want the convenience of having your words searchable, backed up, and always with you.
              </p>
            </div>
            
            <blockquote className="text-2xl sm:text-3xl font-serif italic text-[#1F241D] font-bold mb-12 leading-snug max-w-lg">
              "You shouldn't have to choose between the analog and the digital. You deserve both."
            </blockquote>
            
            <div className="flex flex-wrap gap-3 max-w-lg">
              {["Daily Journalers", "Morning Pages Writers", "Reflection Practitioners", "Analog Enthusiasts", "Writers & Authors", "Mindfulness Seekers"].map((tag, i) => (
                <span key={i} className="px-5 py-2.5 rounded-full border border-[#DCD6C8] text-[11px] font-bold text-[#7A7E78] hover:border-[#2D4A22] hover:text-[#2D4A22] transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2} className="lg:col-span-6 space-y-6">
            <div className="relative h-72 sm:h-96 rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=1200" 
                alt="Journal on table"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[380px] bg-white/60 backdrop-blur-xl px-6 py-5 rounded-3xl border border-white/40 shadow-xl flex items-center gap-5">
                <span className="text-2xl">✍️</span>
                <div className="text-sm text-[#1F241D]">
                  <div className="font-bold">The writing ritual</div>
                  <div className="text-[#5B5F5A]">preserved, amplified</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E8DCC0] hover:shadow-md transition-shadow">
                <div className="text-3xl font-serif text-[#2D4A22] mb-3">Analog</div>
                <p className="text-xs text-[#5B5F5A] leading-relaxed pr-4">writing feel, fully preserved on real paper</p>
              </div>
              <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E8DCC0] hover:shadow-md transition-shadow">
                <div className="text-3xl font-serif text-[#93724B] mb-3">Digital</div>
                <p className="text-xs text-[#5B5F5A] leading-relaxed pr-4">backup of every note, always accessible</p>
              </div>
              <div className="col-span-2 bg-[#FDFBF7] p-8 rounded-3xl border border-[#E8DCC0] hover:shadow-md transition-shadow">
                <div className="text-3xl font-serif text-[#715099] mb-3">One</div>
                <p className="text-xs text-[#5B5F5A] leading-relaxed">seamless experience bridging both worlds</p>
              </div>
            </div>
          </FadeIn>
          
        </div>
      </section>
    </div>
  );
}
