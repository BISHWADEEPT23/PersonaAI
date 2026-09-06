import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  Compass, 
  ArrowRight,
  ArrowLeft, 
  Lock, 
  Eye, 
  BookOpen, 
  Layers, 
  X, 
  CheckCircle2, 
  AlertCircle,
  UserX
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  signUpWithEmail, 
  loginAsGuest, 
  setupRecaptcha, 
  sendPhoneOtp 
} from '../services/auth';
import { PeacockQuillNibLogo } from './PeacockQuillNibLogo';
import { CalmParticles } from './CalmParticles';

const DEMO_LENSES = {
  stoic: {
    title: "The Silent Observer",
    subtitle: "Dichotomy of Control",
    reflection: "Your exam score is an external metric influenced by test design and fatigue. Your preparation discipline and recovery tonight remain 100% within your command.",
    micro_anchor: "Place both feet flat on the floor. Take one full 4-second exhale."
  },
  compassion: {
    title: "The Kindred Embrace",
    subtitle: "Universal Humanity",
    reflection: "Mental fog after 8 continuous hours of cognitive work is not a character flaw—it is a physiological exhaustion signal shared by all humans.",
    micro_anchor: "Step away from your desk and drink a tall glass of cold water."
  },
  temporal: {
    title: "The Distant Horizon",
    subtitle: "5-Year Perspective",
    reflection: "In three years, this specific bottleneck will be a forgotten line item on your path to mastery. Zoom out.",
    micro_anchor: "Look out a window to the furthest visible horizon for 30 seconds."
  },
  somatic: {
    title: "The Grounded Reset",
    subtitle: "Physical Off-Ramp",
    reflection: "Your nervous system is in acute screen lock. Dialogue cannot fix what physical rest needs to resolve.",
    micro_anchor: "Shut down this laptop and walk outside for 10 minutes without headphones."
  }
};

type PersonaKey = 'student' | 'researcher' | 'caregiver' | 'hardware';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showDemo, setShowDemo] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('student');

  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'phone'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const personas: Record<PersonaKey, { label: string; raw: string; solution: string; isUpcoming?: boolean }> = {
    student: {
      label: "Late-Night Exam Cramming",
      raw: "Quant section mock test was brutal. Can't focus, 2:00 AM, heart racing looking at exam date.",
      solution: "Transcribes messy notebook formulas & issues an immediate sleep off-ramp."
    },
    researcher: {
      label: "Grant / Paper Rejection",
      raw: "Paper rejected after 6 months of review. Feels like 2 years of lab data was completely wasted.",
      solution: "Isolates reviewer bias from core scientific validity using the Stoic lens."
    },
    caregiver: {
      label: "Caregiver Sensory Overload",
      raw: "Constant noise and demands all day. Zero time to myself, feeling irritable and guilty.",
      solution: "Provides a 60-second somatic box-breathing anchor to down-regulate panic."
    },
    hardware: {
      label: "Smart Pen Sync",
      isUpcoming: true,
      raw: "I want to write in my physical leather notebook, but I need the AI to securely analyze my cognitive patterns over time.",
      solution: "Syncs physical ink strokes via encrypted Bluetooth directly into your private digital vault."
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setAuthError(error.message || 'Failed to sign in. Please verify popup permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await loginAsGuest();
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in as guest:', error);
      setAuthError(error.message || 'Failed to sign in as guest.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      if (isRegistering) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneOtp(phoneNumber, verifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      navigate('/');
    } catch (err: any) {
      setAuthError("Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-sanctuary-bg text-sanctuary-text flex flex-col justify-between p-4 sm:p-8 transition-colors duration-300">
      <CalmParticles />
      {/* 1. Header with Verification Badges */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2 border-b border-sanctuary-border relative">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => navigate(-1)}
            className="mr-2 p-2 -ml-2 text-sanctuary-muted hover:text-sanctuary-text transition-colors rounded-full hover:bg-sanctuary-surface"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-sanctuary-text flex items-center justify-center overflow-hidden shadow-soft">
            <PeacockQuillNibLogo className="w-9 h-12" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">PersonaAI</span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full badge-frosted text-sanctuary-muted">
            Cohort 3 Ideathon
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowSpecs(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-frosted text-[11px] text-sanctuary-muted hover:text-sanctuary-text transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sanctuary-accent" />
            <span className="font-mono text-[11px]">Cloud Run Verified</span>
          </button>
        </div>
      </header>

      {/* Auth Error Banner if Login Failed */}
      {authError && (
        <div className="max-w-md w-full mx-auto mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError} — Please verify popup permissions and try again.</span>
        </div>
      )}

      {/* 2. Main Hero Grid */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left 7 Columns: Editorial Story & Interactive Persona Switcher */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-frosted text-[11px] font-mono text-sanctuary-muted">
            <span>Analog Capture</span>
            <span>·</span>
            <span>4-Lens Shifter</span>
            <span>·</span>
            <span>Real-World Off-Ramp</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight leading-tight">
            The anti-screen sanctuary for <br />
            <span className="italic font-normal underline decoration-sanctuary-blue/30 underline-offset-4">mental decluttering.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-muted leading-relaxed max-w-xl">
            Most journaling apps trap exhausted users into typing endless paragraphs on glass. PersonaAI bridges your physical notebook pages and voice notes to give you grounded Socratic reframes, then actively tells you to close the screen.
          </p>

          {/* Interactive Persona Selector (Missing in earlier version!) */}
          <div className="p-4 rounded-2xl bg-sanctuary-surface border border-sanctuary-border space-y-3 shadow-soft">
            <div className="flex items-center justify-between text-xs font-mono text-sanctuary-muted">
              <span>EXPLORE SCENARIOS</span>
              <span className="text-sanctuary-blue">Tap to preview</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(Object.keys(personas) as PersonaKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'hardware') {
                      navigate('/product');
                    } else {
                      setSelectedPersona(key);
                    }
                  }}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition ${
                    selectedPersona === key
                      ? 'bg-sanctuary-blue/10 text-sanctuary-blue font-medium border-sanctuary-blue/20 shadow-sm'
                      : 'bg-sanctuary-bg text-sanctuary-muted border-transparent hover:border-sanctuary-border'
                  }`}
                >
                  <span>{personas[key].label}</span>
                  {personas[key].isUpcoming && (
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-sanctuary-blue/20 text-sanctuary-blue">
                      Upcoming
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-sanctuary-bg border border-sanctuary-border/60 text-xs space-y-1">
              <p className="text-sanctuary-text italic">"{personas[selectedPersona].raw}"</p>
              <p className="text-[11px] text-sanctuary-accent font-medium">↳ {personas[selectedPersona].solution}</p>
            </div>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-sanctuary-muted">
              <Camera className="w-4 h-4 text-sanctuary-blue" />
              <span>Cursive OCR</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sanctuary-muted">
              <Compass className="w-4 h-4 text-sanctuary-accent" />
              <span>4-Lens Shifter</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sanctuary-muted">
              <Lock className="w-4 h-4 text-sanctuary-muted" />
              <span>Tenant Isolated</span>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Authentication & Live Demo Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-sanctuary-surface border border-sanctuary-border p-6 sm:p-8 shadow-soft space-y-6 text-center">
            
            <div className="space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-sanctuary-bg border border-sanctuary-border text-sanctuary-text flex items-center justify-center mx-auto shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-serif font-bold text-sanctuary-text">
                Enter Your Sanctuary
              </h2>
              <p className="text-xs text-sanctuary-muted">
                Private, owner-isolated workspace
              </p>
            </div>

            {/* Method Switcher Tabs */}
            <div className="flex rounded-xl bg-sanctuary-bg p-1 border border-sanctuary-border text-xs">
              <button
                onClick={() => { setActiveTab('google'); setAuthError(null); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'google' ? 'bg-sanctuary-surface text-sanctuary-text shadow-sm' : 'text-sanctuary-muted hover:text-sanctuary-text'
                }`}
              >
                Google
              </button>
              <button
                onClick={() => { setActiveTab('email'); setAuthError(null); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'email' ? 'bg-sanctuary-surface text-sanctuary-text shadow-sm' : 'text-sanctuary-muted hover:text-sanctuary-text'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => { setActiveTab('phone'); setAuthError(null); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'phone' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Phone OTP
              </button>
            </div>

            <div id="recaptcha-container"></div>

            {/* Tab 1: Google + Instant Guest Mode */}
            {activeTab === 'google' && (
              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3.5 px-4 btn-soft text-sanctuary-text text-xs font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign in with Google</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-sanctuary-muted" />
                    </>
                  )}
                </button>

                <div className="relative flex py-1 items-center justify-center">
                  <div className="flex-grow border-t border-sanctuary-border"></div>
                  <span className="shrink mx-3 text-[10px] text-sanctuary-muted uppercase font-mono">or</span>
                  <div className="flex-grow border-t border-sanctuary-border"></div>
                </div>

                <button
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-sanctuary-border text-xs text-sanctuary-muted hover:text-sanctuary-text flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Explore as Guest (No Sign-In Required)</span>
                </button>

                {/* Instant Test Mode without Login (Crucial for Quick Review!) */}
                <button
                  type="button"
                  onClick={() => setShowDemo(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-sanctuary-border text-xs text-sanctuary-muted hover:text-sanctuary-text flex items-center justify-center gap-1.5 transition mt-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Test 4-Lens Engine Demo</span>
                </button>
              </div>
            )}

            {/* Tab 2: Email & Password */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-3 text-xs text-left">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-[22px] bg-sanctuary-surface border border-sanctuary-border outline-none focus:border-sanctuary-blue/50 text-sanctuary-text placeholder-sanctuary-muted"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-[22px] bg-sanctuary-surface border border-sanctuary-border outline-none focus:border-sanctuary-blue/50 text-sanctuary-text placeholder-sanctuary-muted"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-sanctuary-blue hover:bg-sanctuary-blue/90 text-white font-medium transition shadow-sm"
                >
                  {loading ? 'Processing...' : isRegistering ? 'Create Account' : 'Sign In'}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-[11px] text-sanctuary-muted hover:text-sanctuary-blue"
                  >
                    {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Phone Number SMS OTP */}
            {activeTab === 'phone' && (
              <div className="space-y-3 text-xs text-left">
                {!confirmationResult ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-[22px] bg-sanctuary-surface border border-sanctuary-border outline-none focus:border-sanctuary-accent/50 text-sanctuary-text font-mono placeholder-sanctuary-muted"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-white font-medium transition shadow-sm"
                    >
                      {loading ? 'Sending SMS...' : 'Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <input
                      type="text"
                      placeholder="6-digit OTP code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-[22px] bg-sanctuary-surface border border-sanctuary-border outline-none focus:border-sanctuary-accent/50 text-center font-mono tracking-widest text-sanctuary-text placeholder-sanctuary-muted"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-white font-medium transition shadow-sm"
                    >
                      {loading ? 'Verifying...' : 'Confirm & Enter'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Privacy Proof Note */}
            <div className="pt-3 border-t border-sanctuary-border/80 text-[11px] text-sanctuary-muted text-left space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-sanctuary-accent">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Database Sharing</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Entries are secured under <code className="font-mono bg-sanctuary-bg px-1 py-0.5 rounded border border-sanctuary-border/60">/users/&#123;uid&#125;/</code>. Gemini keys are handled server-side via Google Secret Manager.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* 3. Architecture & Security Specs Drawer */}
      {showSpecs && (
        <div className="fixed inset-0 z-50 bg-sanctuary-bg/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sanctuary-surface border border-sanctuary-border w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-sanctuary-border pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-sanctuary-text">
                <Layers className="w-4 h-4 text-sanctuary-blue" />
                Submission Architecture & Compliance
              </h3>
              <button onClick={() => setShowSpecs(false)} className="badge-frosted p-1.5 text-sanctuary-muted hover:text-sanctuary-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-sanctuary-muted">
              <div className="p-4 rounded-2xl bg-sanctuary-bg border border-sanctuary-border/60 space-y-1 shadow-soft">
                <span className="font-semibold text-sanctuary-text">Mandatory Cloud Run Label</span>
                <p className="font-mono text-[11px] text-sanctuary-blue">dev-tutorial=cloud-run-ai-challenge</p>
              </div>

              <div className="p-4 rounded-2xl bg-sanctuary-bg border border-sanctuary-border/60 space-y-1 shadow-soft">
                <span className="font-semibold text-sanctuary-text">Firestore Owner Security Rule</span>
                <p className="font-mono text-[10px] text-sanctuary-text">
                  allow read, write: if request.auth != null && request.auth.uid == userId;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sanctuary-bg border border-sanctuary-border/60 space-y-1 shadow-soft">
                <span className="font-semibold text-sanctuary-text">Resilient Fallback Chain</span>
                <p className="font-mono text-[10px] text-sanctuary-accent">
                  gemini-3.6-flash → gemini-3.1-flash-lite → gemini-flash-latest → gemini-3.7-flash
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Instant Interactive 4-Lens Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 bg-sanctuary-bg/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sanctuary-surface border border-sanctuary-border w-full max-w-2xl rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sanctuary-border pb-3">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 text-sanctuary-text">
                  <Compass className="w-4 h-4 text-sanctuary-blue" />
                  Interactive 4-Lens Demo Preview
                </h3>
                <p className="text-xs text-sanctuary-muted">Sample output generated for: "Exam Anxiety & Late-Night Study Fog"</p>
              </div>
              <button onClick={() => setShowDemo(false)} className="badge-frosted p-1.5 text-sanctuary-muted hover:text-sanctuary-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(DEMO_LENSES).map(([key, item]) => (
                <div key={key} className="p-5 rounded-2xl bg-sanctuary-bg border border-sanctuary-border/60 space-y-2 text-xs shadow-soft">
                  <div className="font-semibold text-sanctuary-text">
                    {item.title} <span className="text-[10px] text-sanctuary-muted font-normal">({item.subtitle})</span>
                  </div>
                  <p className="text-sanctuary-text leading-relaxed italic">"{item.reflection}"</p>
                  <div className="pt-2 border-t border-sanctuary-border text-sanctuary-accent text-[11px] font-medium">
                    <strong>Anchor:</strong> {item.micro_anchor}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => { setShowDemo(false); handleGoogleLogin(); }}
                className="py-2 px-4 btn-soft text-sanctuary-text text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Log In with Google to Use Your Own Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Minimal Footer */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-sanctuary-muted border-t border-sanctuary-border pt-4 gap-2">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Google Cloud Run AI Challenge</span>
          <span>·</span>
          <span>Hack2skill</span>
        </div>
        <div className="font-mono text-sanctuary-blue text-[11px]">
          #AccelerateAIwithCloudRun
        </div>
      </footer>

    </div>
  );
}
