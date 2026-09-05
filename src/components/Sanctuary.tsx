import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Interaction, LensData } from '../types';
import { stripUndefined } from '../lib/utils';
import { uploadMediaAsset } from '../lib/storage';
import { scrubImagePII, scrubAudioPII, scrubTextPII } from '../lib/pii';
import { resolveLocation } from '../utils/geo';
import SomaticGrounding from './SomaticGrounding';
import CognitiveAnalytics from './CognitiveAnalytics';
import VoiceRecorder from './VoiceRecorder';
import { PeacockQuillNibLogo } from './PeacockQuillNibLogo';
import { CalmParticles } from './CalmParticles';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  X, 
  LogOut,
  Clock,
  Loader2,
  Shield,
  Copy,
  Compass,
  Mountain,
  Heart,
  Hourglass,
  Activity,
  Wind,
  Mic,
  AlertCircle,
  CloudOff,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { saveOfflineEntry, getOfflineEntries, deleteOfflineEntry } from '../lib/idb';

const moodPills = [
  { id: 'focus', label: 'High Focus', color: 'border-sanctuary-accent/10 bg-sanctuary-accent/5 text-sanctuary-accent' },
  { id: 'fog', label: 'Brain Fog', color: 'border-sanctuary-blue/10 bg-sanctuary-blue/5 text-sanctuary-blue' },
  { id: 'drained', label: 'Low Battery', color: 'border-sanctuary-muted/10 bg-sanctuary-muted/5 text-sanctuary-muted' },
];

export default function Sanctuary() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Composer State
  const [inputText, setInputText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Media State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [activeModalInteraction, setActiveModalInteraction] = useState<Interaction | null>(null);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);

  // Offline State
  const [offlineEntries, setOfflineEntries] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Editor Focus & Viewport State
  const [isFocused, setIsFocused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const updateViewport = () => {
      setViewportHeight(window.visualViewport!.height);
    };

    window.visualViewport.addEventListener('resize', updateViewport);
    window.visualViewport.addEventListener('scroll', updateViewport);

    // Initial set
    updateViewport();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, []);

  const loadOfflineEntries = async () => {
    if (!auth.currentUser) return;
    const entries = await getOfflineEntries(auth.currentUser.uid);
    setOfflineEntries(entries);
  };

  useEffect(() => {
    loadOfflineEntries();
  }, [auth.currentUser]);

  const syncOfflineEntries = async () => {
    if (!auth.currentUser || !navigator.onLine || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    setIsSyncing(true);
    try {
      const entries = await getOfflineEntries(auth.currentUser.uid);
      for (const entry of entries) {
        try {
          const token = await auth.currentUser.getIdToken();
          const formData = new FormData();
          if (entry.inputText) formData.append('entry_text', entry.inputText);
          
          const moodLabel = entry.mood ? moodPills.find(m => m.id === entry.mood)?.label : null;
          if (moodLabel) formData.append('mood', moodLabel);
          
          let imageUrl = undefined;
          let audioUrl = undefined;

          if (entry.imageFile) {
            formData.append('file', entry.imageFile);
            try {
              const { downloadUrl } = await uploadMediaAsset(auth.currentUser.uid, entry.imageFile, "image");
              imageUrl = downloadUrl;
            } catch (storageErr) {
              console.error("Failed to upload image to Firebase Storage", storageErr);
            }
          }
          if (entry.audioFile) {
            formData.append('file', entry.audioFile);
            try {
              const { downloadUrl } = await uploadMediaAsset(auth.currentUser.uid, entry.audioFile, "audio");
              audioUrl = downloadUrl;
            } catch (storageErr) {
              console.error("Failed to upload audio to Firebase Storage", storageErr);
            }
          }
          
          if (entry.latitude !== null && entry.longitude !== null) {
            formData.append('latitude', entry.latitude.toString());
            formData.append('longitude', entry.longitude.toString());
            if (entry.source) {
              formData.append('loc_source', entry.source);
            }
          }

          if (imageUrl) formData.append('image_url', imageUrl);
          if (audioUrl) formData.append('audio_url', audioUrl);
          formData.append('createdAt', entry.createdAt.toString());

          // @ts-ignore
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reflect`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
          const data = await res.json();
          if (data.status === 'success') {
            await deleteOfflineEntry(entry.id);
          }
      } catch (itemErr) {
        console.error('Error syncing individual offline entry:', itemErr);
      }
    }
  } catch (err) {
    console.error('Error in offline sync loop:', err);
  } finally {
    isSyncingRef.current = false;
    setIsSyncing(false);
    loadOfflineEntries();
  }
};

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineEntries();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [auth.currentUser]);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const interactionsRef = collection(db, 'users', auth.currentUser.uid, 'interactions');
    const q = query(interactionsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Interaction[] = [];
      snapshot.forEach((document) => {
        fetched.push({ id: document.id, ...document.data() } as Interaction);
      });
      setInteractions(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAudio = () => {
    setAudioFile(null);
  };

  const handleRecordingComplete = (file: File) => {
    setAudioFile(file);
  };

  const handleSubmit = async () => {
    if ((!inputText.trim() && !imageFile && !audioFile && !selectedMood) || !auth.currentUser) return;
    
    setIsAnalyzing(true);
    setSubmitError(null);
    try {
      const coords = await resolveLocation(imageFile || undefined);
      
      // ALWAYS save locally first for immediate UI feedback
      await saveOfflineEntry({
        id: crypto.randomUUID(),
        uid: auth.currentUser.uid,
        inputText: inputText.trim(),
        mood: selectedMood,
        imageFile: imageFile,
        audioFile: audioFile,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        source: coords?.source || null,
        createdAt: Date.now()
      });
      
      // Clear composer state immediately
      setInputText('');
      setSelectedMood(null);
      removeImage();
      removeAudio();
      
      // Load into feed as pending
      await loadOfflineEntries();

      // Trigger sync in the background if online
      if (navigator.onLine) {
        syncOfflineEntries();
      } else {
        setSubmitError("Saved offline. Will sync when connection is restored.");
      }
    } catch (error: any) {
      console.error('Error submitting interaction locally:', error);
      setSubmitError(error.message || 'Failed to save reflection locally. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteInteraction = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'interactions', id));
    } catch (err) {
      console.error("Error deleting interaction:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sanctuary-bg">
        <Loader2 className="w-8 h-8 text-sanctuary-muted animate-spin" />
      </div>
    );
  }

  const allInteractions = [
    ...offlineEntries.map(e => ({
      id: e.id,
      content: e.inputText,
      cognitiveState: moodPills.find(m => m.id === e.mood)?.label || null,
      hasMedia: !!e.imageFile || !!e.audioFile,
      analysis: null,
      createdAt: e.createdAt,
      isOffline: true
    } as Interaction)),
    ...interactions
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div 
      className="bg-sanctuary-bg text-sanctuary-text flex flex-col items-center px-4 font-sans selection:bg-zinc-800 relative overflow-hidden transition-all duration-300"
      style={{
        height: isFocused ? `${viewportHeight}px` : 'auto',
        minHeight: isFocused ? `${viewportHeight}px` : '100vh',
        paddingTop: isFocused ? '1rem' : '2rem',
        paddingBottom: isFocused ? '0' : '2rem',
      }}
    >
      <CalmParticles />
      <div className={`w-full max-w-2xl relative z-10 flex flex-col h-full transition-all duration-300 ${isFocused ? 'space-y-4' : 'space-y-8'}`}>
        
        {/* Navigation Bar */}
        {!isFocused ? (
          <header className="flex items-center justify-between border-b border-sanctuary-border pb-4 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 p-0 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-sanctuary-text flex items-center justify-center overflow-hidden shadow-soft">
                  <PeacockQuillNibLogo className="w-9 h-12" />
                </div>
                <span className="text-base font-semibold tracking-wide text-sanctuary-text">PersonaAI</span>
              </div>
              {/* Trust Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 badge-frosted text-[10px] uppercase tracking-wider font-semibold text-sanctuary-muted">
                <Shield className="w-3 h-3" />
                Isolated Tenant
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGroundingOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 badge-frosted text-[11px] text-sanctuary-text transition hover:bg-sanctuary-border/30"
                title="Take a 60-second offline breathing break"
              >
                <span className="w-2 h-2 rounded-full bg-sanctuary-accent animate-pulse" />
                <span>60s Grounding</span>
              </button>
              <button 
                onClick={() => auth.signOut()}
                className="p-2 text-sanctuary-muted hover:text-sanctuary-text hover:bg-sanctuary-surface rounded-xl transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>
        ) : (
          <header className="flex items-center justify-between pb-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-sanctuary-muted flex items-center gap-2 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sanctuary-accent animate-pulse" />
                Focus Mode
              </span>
            </div>
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                setIsFocused(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sanctuary-surface text-sanctuary-text border border-sanctuary-border text-xs font-medium hover:bg-sanctuary-border/20 transition shadow-soft"
            >
              Done <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </header>
        )}

        {/* Input Sanctuary Card */}
        <section 
          className={`notebook-sheet transition-all duration-300 flex flex-col ${
            isFocused 
              ? 'bg-sanctuary-bg flex-1 p-6 space-y-5 mb-4' 
              : 'bg-sanctuary-surface-raised p-6 space-y-5 shrink-0 hover:bg-sanctuary-surface'
          }`}
        >
          
          {/* Mood Selector Pills */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {moodPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedMood(selectedMood === pill.id ? null : pill.id)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all ${
                  selectedMood === pill.id
                    ? `${pill.color} shadow-sm`
                    : 'border-sanctuary-border bg-sanctuary-surface text-sanctuary-muted hover:border-sanctuary-muted/30 hover:text-sanctuary-text'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Text Input Area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Log your thoughts or upload messy notebook pages..."
            rows={isFocused ? undefined : 4}
            className={`w-full bg-transparent resize-none border-none outline-none text-sm text-sanctuary-text placeholder-sanctuary-muted leading-relaxed transition-all duration-300 ${isFocused ? 'flex-1 h-full' : ''}`}
          />

          {/* Media Previews */}
          {(imagePreview || audioFile) && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-sanctuary-border/60">
              {imagePreview && (
                <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-sanctuary-border bg-sanctuary-surface">
                  <img src={imagePreview} alt="Handwriting preview" className="w-full h-full object-cover opacity-90" />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 rounded-full badge-frosted text-sanctuary-text hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {audioFile && (
                <div className="relative group h-20 flex items-center px-4 rounded-xl border border-sanctuary-border bg-sanctuary-surface shadow-soft">
                  <div className="flex items-center gap-2 text-sanctuary-text">
                    <Mic className="w-4 h-4 text-sanctuary-blue" />
                    <span className="text-xs">Voice Memo</span>
                  </div>
                  <button
                    onClick={removeAudio}
                    className="absolute top-1 right-1 p-1 rounded-full badge-frosted text-sanctuary-text hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {submitError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500/80 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-medium transition whitespace-nowrap disabled:opacity-50"
              >
                Retry Save
              </button>
            </div>
          )}

          {/* Input Actions Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-sanctuary-border">
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition ${imageFile ? 'text-sanctuary-blue bg-sanctuary-blue/10' : 'text-sanctuary-muted hover:text-sanctuary-text hover:bg-sanctuary-surface'}`}
                title="Upload photo of handwritten notes"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete} 
                disabled={isAnalyzing || !!audioFile} 
              />
              <div className="text-[10px] text-sanctuary-muted flex items-center gap-1 ml-2">
                <Shield className="w-3 h-3 opacity-60" />
                Local Isolation Active
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || (!inputText.trim() && !imageFile && !audioFile && !selectedMood)}
              className="flex items-center gap-1.5 px-4 py-2 btn-soft text-sanctuary-text text-xs font-semibold disabled:opacity-40 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>{isScrubbing ? "Scrubbing PII..." : "Reflecting..."}</span>
                </>
              ) : (
                <>
                  <span>Reflect</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </section>

        <div className={`transition-all duration-300 ${isFocused ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100 flex-1'}`}>
          {/* Cognitive Analytics Dashboard */}
          {interactions.length > 0 && (
            <CognitiveAnalytics interactions={interactions} />
          )}

          {/* Reflection History Feed */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-sanctuary-muted px-1">
              <span>Reflective History</span>
              <span>{allInteractions.length} {allInteractions.length === 1 ? 'Entry' : 'Entries'}</span>
            </div>

          {allInteractions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-sanctuary-border p-12 text-center text-xs text-sanctuary-muted"
            >
              Your sanctuary is empty. Begin reflecting above.
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              <AnimatePresence mode="popLayout">
              {allInteractions.map((entry) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                  key={entry.id} 
                  className={`rounded-2xl bg-sanctuary-surface border p-6 space-y-4 transition-colors duration-300 shadow-soft font-serif ${entry.isOffline ? 'border-sanctuary-accent/30 bg-sanctuary-accent/5' : 'border-sanctuary-border hover:border-sanctuary-border/80'}`}
                >
                  
                  {/* Entry Meta */}
                  <div className="flex items-center justify-between text-xs border-b border-sanctuary-border/50 pb-3">
                    <span className="text-sanctuary-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      {format(entry.createdAt, "MMM d, h:mm a")}
                      {entry.isOffline && (
                        <span className="flex items-center gap-1 ml-2 text-sanctuary-accent/80">
                          <CloudOff className="w-3.5 h-3.5" />
                          Offline (Pending Sync)
                        </span>
                      )}
                    </span>
                    {entry.cognitiveState && (
                      <span className="px-3 py-1 rounded-full border border-sanctuary-border/50 text-[11px] text-sanctuary-muted bg-sanctuary-bg/50">
                        {entry.cognitiveState}
                      </span>
                    )}
                  </div>

                  {/* Transcribed / Raw Thought */}
                  <p className="text-base font-serif text-sanctuary-text leading-relaxed font-normal whitespace-pre-wrap">
                    {entry.analysis?.transcribed_text || entry.content}
                  </p>

                  {/* Media Display */}
                  {(entry.imageUrl || entry.audioUrl) && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {entry.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-sanctuary-border bg-sanctuary-surface-raised inline-block">
                          <img src={entry.imageUrl} alt="Uploaded journal" className="w-auto h-auto max-h-48 object-contain" />
                        </div>
                      )}
                      {entry.audioUrl && (
                        <audio controls src={entry.audioUrl} className="w-full sm:max-w-xs h-12" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {entry.isOffline ? (
                       <div className="text-xs font-medium text-sanctuary-accent/70 flex items-center gap-1.5">
                         <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                         Waiting for connection to analyze...
                       </div>
                    ) : (
                      <button 
                        onClick={() => setActiveModalInteraction(entry)}
                        className="text-xs font-medium text-sanctuary-blue hover:text-sanctuary-blue/80 flex items-center gap-1.5 transition-colors badge-frosted px-4 py-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        View Perspective Shifts
                      </button>
                    )}
                    <button 
                      onClick={() => entry.isOffline ? deleteOfflineEntry(entry.id).then(loadOfflineEntries) : deleteInteraction(entry.id)}
                      className="text-sanctuary-muted hover:text-rose-500 transition shrink-0 p-1"
                      title="Delete Entry"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        </div>
      </div>

      {/* Perspective Shift Modal */}
      {activeModalInteraction && activeModalInteraction.analysis?.lenses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sanctuary-bg/80 backdrop-blur-sm">
          <div className="bg-sanctuary-surface border border-sanctuary-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-sanctuary-border bg-sanctuary-surface-raised">
              <h2 className="text-lg font-semibold text-sanctuary-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sanctuary-blue" />
                Perspective Shifts
              </h2>
              <button 
                onClick={() => setActiveModalInteraction(null)}
                className="p-2 badge-frosted text-sanctuary-muted hover:text-sanctuary-text rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-sanctuary-bg">
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Stoic Lens */}
                <LensCard 
                  icon={<Mountain className="w-4 h-4 text-sanctuary-muted" />}
                  bg="bg-sanctuary-surface shadow-soft"
                  border="border-sanctuary-border"
                  lens={activeModalInteraction.analysis.lenses.stoic} 
                  onCopy={copyToClipboard}
                />

                {/* Compassion Lens */}
                <LensCard 
                  icon={<Heart className="w-4 h-4 text-sanctuary-accent" />}
                  bg="bg-sanctuary-surface shadow-soft"
                  border="border-sanctuary-border"
                  lens={activeModalInteraction.analysis.lenses.compassion} 
                  onCopy={copyToClipboard}
                />

                {/* Temporal Lens */}
                <LensCard 
                  icon={<Hourglass className="w-4 h-4 text-sanctuary-blue" />}
                  bg="bg-sanctuary-surface shadow-soft"
                  border="border-sanctuary-border"
                  lens={activeModalInteraction.analysis.lenses.temporal} 
                  onCopy={copyToClipboard}
                />

                {/* Somatic Lens */}
                <LensCard 
                  icon={<Activity className="w-4 h-4 text-sanctuary-accent" />}
                  bg="bg-sanctuary-surface shadow-soft"
                  border="border-sanctuary-border"
                  lens={activeModalInteraction.analysis.lenses.somatic_offramp} 
                  onCopy={copyToClipboard}
                />

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Somatic Grounding Modal */}
      <SomaticGrounding isOpen={isGroundingOpen} onClose={() => setIsGroundingOpen(false)} />

    </div>
  );
}

// Helper Component for the Lens Card
function LensCard({ lens, icon, bg, border, onCopy }: { lens: LensData, icon: React.ReactNode, bg: string, border: string, onCopy: (text: string) => void }) {
  if (!lens) return null;
  const copyText = `[${lens.title}]\nReflection: ${lens.reflection}\nPrompt: ${lens.subtitle}\nAction: ${lens.micro_anchor}`;

  const sendSlackNudge = async (nudgeText: string, lensType: string) => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ nudge: nudgeText, lens_type: lensType })
      });
      alert("Micro-nudge sent to your Slack workspace!");
    } catch (err) {
      alert("Could not deliver Slack nudge.");
    }
  };

  return (
    <div className={`rounded-2xl ${bg} border ${border} p-5 space-y-4 flex flex-col font-serif`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sanctuary-text text-sm flex items-center gap-2">
          {icon} {lens.title}
        </h3>
        <button 
          onClick={() => onCopy(copyText)}
          className="text-sanctuary-muted hover:text-sanctuary-text transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      
      <p className="font-serif text-sanctuary-text text-base leading-relaxed italic">
        "{lens.reflection}"
      </p>

      <div className="mt-auto pt-4 space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sanctuary-muted font-semibold mb-1 block">Inquiry Prompt</span>
          <p className="text-xs text-sanctuary-blue font-medium">{lens.subtitle}</p>
        </div>
        <div className="bg-sanctuary-bg/50 p-3 rounded-xl border border-sanctuary-border flex flex-col gap-2 shadow-soft">
          <div className="flex gap-2 items-start">
            <Compass className="w-3.5 h-3.5 text-sanctuary-accent shrink-0 mt-0.5" />
            <p className="text-xs text-sanctuary-text leading-snug">{lens.micro_anchor}</p>
          </div>
          <div className="flex justify-end mt-1">
            <button 
              onClick={() => sendSlackNudge(lens.micro_anchor, lens.title)}
              className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 rounded-lg bg-sanctuary-blue/10 text-sanctuary-blue hover:bg-sanctuary-blue/20 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              Send to Slack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
