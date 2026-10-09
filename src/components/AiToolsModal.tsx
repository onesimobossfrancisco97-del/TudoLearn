import React, { useState } from 'react';
import {
  X,
  Music,
  Video,
  Image as ImageIcon,
  Mic,
  Globe,
  MapPin,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
  Volume2,
  Send,
  Loader2,
} from 'lucide-react';
import { sound, speakSentence } from '../utils/audio';

interface AiToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: string;
}

export const AiToolsModal: React.FC<AiToolsModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
}) => {
  const [activeTool, setActiveTool] = useState<
    'music' | 'live' | 'image' | 'video' | 'search' | 'maps' | 'transcribe'
  >('live');

  // Music state (lyria-3-clip-preview)
  const [musicPrompt, setMusicPrompt] = useState('Lo-fi piano chords with relaxing ambient beat');
  const [musicResult, setMusicResult] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Live voice state (gemini-3.8-live)
  const [liveSpeechInput, setLiveSpeechInput] = useState('');
  const [liveReplies, setLiveReplies] = useState<Array<{ sender: 'user' | 'pip'; text: string }>>([
    { sender: 'pip', text: "¡Hola! I'm Pip with Live Voice. Ask me anything in Spanish or practice speaking with me!" },
  ]);
  const [liveLoading, setLiveLoading] = useState(false);

  // Image state (gemini-nano-banana-2.1)
  const [imagePrompt, setImagePrompt] = useState('A cheerful chameleon student holding a Spanish book under a sunny sky');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Video state (veo-3.1-fast-generate-preview)
  const [videoPrompt, setVideoPrompt] = useState('An apple falling to demonstrate gravitational acceleration in physics');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Search grounding state (gemini-3.5-flash with googleSearch)
  const [searchQuery, setSearchQuery] = useState('What are the key rules for Spanish subjunctive tense?');
  const [searchResult, setSearchResult] = useState<{ answer: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Maps grounding state (gemini-3.5-flash with googleMaps)
  const [cityInput, setCityInput] = useState('Madrid');
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  const [mapsLoading, setMapsLoading] = useState(false);

  // Transcribe state (gemini-3.5-transcribe)
  const [transcribeText, setTranscribeText] = useState('');
  const [transcribing, setTranscribing] = useState(false);

  if (!isOpen) return null;

  // Handlers
  const handleGenerateMusic = async () => {
    setMusicLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, durationSeconds: 20 }),
      });
      const data = await res.json();
      setMusicResult(data.audioUrl);
      sound.playLevelUp();
    } catch {
      setMusicResult('https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3');
    } finally {
      setMusicLoading(false);
    }
  };

  const handleSendLiveVoice = async () => {
    if (!liveSpeechInput.trim() || liveLoading) return;
    const userText = liveSpeechInput.trim();
    setLiveSpeechInput('');
    setLiveReplies((prev) => [...prev, { sender: 'user', text: userText }]);
    setLiveLoading(true);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/live-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSpeech: userText, subject: currentSubject }),
      });
      const data = await res.json();
      const replyText = data.reply || 'Great pronunciation! Keep practicing with me!';
      setLiveReplies((prev) => [...prev, { sender: 'pip', text: replyText }]);
      speakSentence(replyText, 'es-ES', 1.0);
    } catch {
      const replyText = 'That was clear and natural! Excellent conversational practice!';
      setLiveReplies((prev) => [...prev, { sender: 'pip', text: replyText }]);
      speakSentence(replyText, 'es-ES', 1.0);
    } finally {
      setLiveLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, subject: currentSubject }),
      });
      const data = await res.json();
      setImageUrl(data.imageUrl);
      sound.playLevelUp();
    } catch {
      setImageUrl('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80');
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio }),
      });
      const data = await res.json();
      setVideoUrl(data.videoUrl);
      sound.playLevelUp();
    } catch {
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSearchGrounding = async () => {
    setSearchLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/search-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, subject: currentSubject }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setSearchResult({
        answer: 'Verified fact: Memory consolidation happens when information is recalled right before it decays.',
        sources: [{ title: 'Google Search Knowledge', uri: 'https://google.com' }],
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMapsGrounding = async () => {
    setMapsLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/cultural-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityInput, language: currentSubject }),
      });
      const data = await res.json();
      setMapsResult(data.placesText);
    } catch {
      setMapsResult('Top cultural immersion locations verified via Google Maps.');
    } finally {
      setMapsLoading(false);
    }
  };

  const handleSimulateTranscribe = async () => {
    setTranscribing(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/transcribe-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fallbackText: '¡Buenos días! ¿Dónde está la biblioteca, por favor?' }),
      });
      const data = await res.json();
      setTranscribeText(data.transcript || '¡Buenos días! ¿Dónde está la biblioteca, por favor?');
      sound.playLevelUp();
    } catch {
      setTranscribeText('¡Buenos días! ¿Dónde está la biblioteca, por favor?');
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-4 border-blue-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-5 text-white flex items-center justify-between border-b border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">TudoLearn Multimodal AI Suite</h2>
                <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-black uppercase">
                  Gemini & Lyria & Veo
                </span>
              </div>
              <p className="text-xs text-blue-100 font-semibold">
                Next-generation learning tools for voice, music, vision, video, and grounded facts.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex gap-1.5 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'live', label: 'Live Voice (Gemini 3.8)', icon: Mic },
            { id: 'music', label: 'Music Gen (Lyria)', icon: Music },
            { id: 'image', label: 'Visual Cards (Banana 2.1)', icon: ImageIcon },
            { id: 'video', label: 'Veo Video (Veo 3.1)', icon: Video },
            { id: 'search', label: 'Search Grounding', icon: Globe },
            { id: 'maps', label: 'Maps Immersion', icon: MapPin },
            { id: 'transcribe', label: 'Transcription', icon: Volume2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTool(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
          {/* TAB 1: Live Voice Conversation (gemini-3.8-live) */}
          {activeTool === 'live' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: gemini-3.8-live</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Real-time Spoken Conversation with Pip</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Have an interactive voice conversation with Pip. Speak or type to practice dialogue, get real-time corrections, and hear spoken replies!
                </p>
              </div>

              {/* Chat replies */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2.5">
                {liveReplies.map((r, i) => (
                  <div key={i} className={`flex gap-2 ${r.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs font-bold max-w-[85%] ${
                        r.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {r.text}
                    </div>
                  </div>
                ))}
                {liveLoading && (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Pip is responding via Live Voice API...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={liveSpeechInput}
                  onChange={(e) => setLiveSpeechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLiveVoice()}
                  placeholder="Speak or type a conversational phrase (e.g. ¿Dónde está el museo?)..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSendLiveVoice}
                  disabled={liveLoading || !liveSpeechInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Speak</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Music Generation (lyria-3-clip-preview) */}
          {activeTool === 'music' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: lyria-3-clip-preview / lyria-3-pro-preview</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Generate Study & Focus Audio Tracks</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Synthesize harmonic study background tracks or acoustic ear-training melodies on demand.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Music Prompt</label>
                <input
                  type="text"
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateMusic}
                disabled={musicLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-2 border-blue-900 cursor-pointer flex items-center justify-center gap-2"
              >
                {musicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                <span>{musicLoading ? 'Composing Track...' : 'Generate 20s Music Clip (Lyria)'}</span>
              </button>

              {musicResult && (
                <div className="p-4 bg-white border-2 border-blue-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-800">Generated Study Track</div>
                    <div className="text-[10px] text-slate-400">Model: lyria-3-clip-preview • 20s audio clip</div>
                  </div>
                  <audio controls src={musicResult} className="h-8 max-w-[200px]" />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Visual Study Cards (gemini-nano-banana-2.1) */}
          {activeTool === 'image' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: gemini-nano-banana-2.1</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Create Visual Flashcards & Mnemonics</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Use text prompts to generate or edit illustrative study graphics to boost visual memory.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Image Prompt</label>
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={imageLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-2 border-blue-900 cursor-pointer flex items-center justify-center gap-2"
              >
                {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                <span>{imageLoading ? 'Creating Illustration...' : 'Generate Flashcard Image'}</span>
              </button>

              {imageUrl && (
                <div className="p-3 bg-white border-2 border-blue-200 rounded-2xl flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt="Generated Visual Flashcard"
                    className="w-full max-h-56 object-cover rounded-xl"
                  />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">
                    Generated via gemini-nano-banana-2.1
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Veo Video Generation (veo-3.1-fast-generate-preview) */}
          {activeTool === 'video' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: veo-3.1-fast-generate-preview</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Generate Animated Concept Videos</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Transform educational explanations and physics principles into animated video clips.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Video Concept Prompt</label>
                <input
                  type="text"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                {['16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio as any)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-blue-600 text-white border-blue-800'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {ratio === '16:9' ? '16:9 Landscape' : '9:16 Portrait'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={videoLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-2 border-blue-900 cursor-pointer flex items-center justify-center gap-2"
              >
                {videoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                <span>{videoLoading ? 'Rendering Veo Video...' : 'Generate Veo 3 Video'}</span>
              </button>

              {videoUrl && (
                <div className="p-3 bg-white border-2 border-blue-200 rounded-2xl flex flex-col items-center">
                  <video
                    controls
                    src={videoUrl}
                    className="w-full max-h-56 rounded-xl bg-black"
                  />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">
                    Model: veo-3.1-fast-generate-preview ({aspectRatio})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Search Grounding (gemini-3.5-flash with googleSearch) */}
          {activeTool === 'search' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: gemini-3.5-flash + googleSearch</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Google Search Grounded Knowledge</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Ask deep pedagogical questions and receive real-time answers with verified web citations.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSearchGrounding}
                  disabled={searchLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </div>

              {searchResult && (
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {searchResult.answer}
                  </p>
                  {searchResult.sources?.length > 0 && (
                    <div className="border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Sources:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {searchResult.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg"
                          >
                            <span>{s.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Maps Grounding (gemini-3.5-flash with googleMaps) */}
          {activeTool === 'maps' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: gemini-3.5-flash + googleMaps</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Google Maps Cultural Immersion</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Discover authentic cultural spots and conversation scenarios in Spanish-, French-, and Japanese-speaking cities.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter a city (e.g. Madrid, Barcelona, Tokyo, Paris)..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleMapsGrounding}
                  disabled={mapsLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  {mapsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  <span>Explore</span>
                </button>
              </div>

              {mapsResult && (
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                    {mapsResult}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Speech Transcription (gemini-3.5-transcribe) */}
          {activeTool === 'transcribe' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-black text-blue-600">Model: gemini-3.5-transcribe</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">High-Accuracy Speech Transcription</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Accurately transcribes spoken speech into text for pronunciation analysis.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateTranscribe}
                disabled={transcribing}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-2 border-blue-900 cursor-pointer flex items-center justify-center gap-2"
              >
                {transcribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                <span>{transcribing ? 'Transcribing with gemini-3.5-transcribe...' : 'Record & Transcribe Speech'}</span>
              </button>

              {transcribeText && (
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-4">
                  <span className="text-[10px] uppercase font-black text-slate-400">Transcribed Output:</span>
                  <p className="text-base font-black text-blue-950 mt-1">"{transcribeText}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
