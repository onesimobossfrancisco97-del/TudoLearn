import { useState, useEffect } from 'react';

/**
 * OmniQuest Audio & Speech Synthesis Engine
 * Uses Web Audio API for zero-latency game sound effects & music piano notes,
 * and Web Speech API for TTS reading and STT voice pronunciation practice.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private clickSoundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('omni_menu_click_sound');
        if (stored !== null) {
          this.clickSoundEnabled = stored === 'true';
        }
      } catch (e) {}
    }
  }

  isClickSoundEnabled(): boolean {
    return this.clickSoundEnabled;
  }

  setClickSoundEnabled(enabled: boolean): void {
    this.clickSoundEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('omni_menu_click_sound', String(enabled));
        window.dispatchEvent(
          new CustomEvent('menu-click-sound-changed', { detail: { enabled } })
        );
      } catch (e) {}
    }
  }

  toggleClickSound(): boolean {
    const nextState = !this.clickSoundEnabled;
    this.setClickSoundEnabled(nextState);
    return nextState;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a gentle UI click pop (only if enabled by student)
  playClick() {
    if (!this.clickSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      // Audio might be blocked by browser autoplay policy until user gesture
    }
  }

  // Play triumphant "Ding-Ding!" correct chime
  playCorrect() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2 (higher harmony)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  // Play gentle error boing
  playWrong() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Play victory celebration fanfare
  playLevelUp() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.12;
        const dur = idx === notes.length - 1 ? 0.6 : 0.2;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {}
  }

  // Play musical note for Music training (C4, D4, E4, F4, G4, A4, B4, C5)
  playPianoNote(noteName: string) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const noteFreqs: Record<string, number> = {
        'C4': 261.63,
        'C#4': 277.18,
        'Db4': 277.18,
        'D4': 293.66,
        'D#4': 311.13,
        'Eb4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'F#4': 369.99,
        'Gb4': 369.99,
        'G4': 392.00,
        'G#4': 415.30,
        'Ab4': 415.30,
        'A4': 440.00,
        'A#4': 466.16,
        'Bb4': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'D5': 587.33,
        'E5': 659.25,
      };

      const freq = noteFreqs[noteName] || 440;
      const now = ctx.currentTime;

      // Rich harmonics for piano chime
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 1.2);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 1.25);
      oscHarmonic.stop(now + 1.25);
    } catch (e) {}
  }

  // Play Guitar string pluck (stringNum 1 to 6, fret 0 to 12)
  playGuitarPluck(stringNum: number, fret = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const openFreqs: Record<number, number> = {
        6: 82.41,   // Low E2
        5: 110.00,  // A2
        4: 146.83,  // D3
        3: 196.00,  // G3
        2: 246.94,  // B3
        1: 329.63,  // High E4
      };

      const baseFreq = openFreqs[stringNum] || 196.00;
      const freq = baseFreq * Math.pow(2, fret / 12);
      const now = ctx.currentTime;

      // Primary string oscillator
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now);

      // Acoustic wood body filtering: bright pluck that dampens naturally
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 8, 4800), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), now + 0.8);

      // Attack & decay envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.015); // sharp pick attack
      gain.gain.exponentialRampToValueAtTime(0.002, now + 1.6); // smooth resonant ring

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 1.65);
      oscHarmonic.stop(now + 1.65);
    } catch (e) {}
  }

  // Strum a standard guitar chord with realistic pick arpeggiation delay
  playGuitarChord(chordName: string) {
    const chordVoicings: Record<string, { stringNum: number; fret: number }[]> = {
      Em: [
        { stringNum: 6, fret: 0 },
        { stringNum: 5, fret: 2 },
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 0 },
        { stringNum: 1, fret: 0 },
      ],
      E: [
        { stringNum: 6, fret: 0 },
        { stringNum: 5, fret: 2 },
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 1 },
        { stringNum: 2, fret: 0 },
        { stringNum: 1, fret: 0 },
      ],
      G: [
        { stringNum: 6, fret: 3 },
        { stringNum: 5, fret: 2 },
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 3 },
        { stringNum: 1, fret: 3 },
      ],
      C: [
        { stringNum: 5, fret: 3 },
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 1 },
        { stringNum: 1, fret: 0 },
      ],
      D: [
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 3 },
        { stringNum: 1, fret: 2 },
      ],
      Dm: [
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 3 },
        { stringNum: 1, fret: 1 },
      ],
      Am: [
        { stringNum: 5, fret: 0 },
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 1 },
        { stringNum: 1, fret: 0 },
      ],
      A: [
        { stringNum: 5, fret: 0 },
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 2 },
        { stringNum: 1, fret: 0 },
      ],
      F: [
        { stringNum: 4, fret: 3 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 1 },
        { stringNum: 1, fret: 1 },
      ],
    };

    const notes = chordVoicings[chordName] || chordVoicings['Em'];
    notes.forEach((item, index) => {
      setTimeout(() => {
        this.playGuitarPluck(item.stringNum, item.fret);
      }, index * 32); // 32ms brush strum interval
    });
  }

  // Play Bass Guitar Note (4-string bass E1, A1, D2, G2)
  playBassNote(stringNum: number, fret = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const openFreqs: Record<number, number> = {
        4: 41.20, // Low E1
        3: 55.00, // A1
        2: 73.42, // D2
        1: 98.00, // G2
      };

      const baseFreq = openFreqs[stringNum] || 55.0;
      const freq = baseFreq * Math.pow(2, fret / 12);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 1.8);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 1.85);
      sub.stop(now + 1.85);
    } catch (e) {}
  }

  // Play Ukulele pluck (4-string G4, C4, E4, A4)
  playUkulelePluck(stringNum: number, fret = 0) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const openFreqs: Record<number, number> = {
        4: 392.00, // G4
        3: 261.63, // C4
        2: 329.63, // E4
        1: 440.00, // A4
      };

      const baseFreq = openFreqs[stringNum] || 329.63;
      const freq = baseFreq * Math.pow(2, fret / 12);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.15);
    } catch (e) {}
  }

  // Play Ukulele Chord
  playUkuleleChord(chordName: string) {
    const chordVoicings: Record<string, { stringNum: number; fret: number }[]> = {
      C: [
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 0 },
        { stringNum: 1, fret: 3 },
      ],
      Am: [
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 0 },
        { stringNum: 1, fret: 0 },
      ],
      F: [
        { stringNum: 4, fret: 2 },
        { stringNum: 3, fret: 0 },
        { stringNum: 2, fret: 1 },
        { stringNum: 1, fret: 0 },
      ],
      G: [
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 3 },
        { stringNum: 1, fret: 2 },
      ],
      G7: [
        { stringNum: 4, fret: 0 },
        { stringNum: 3, fret: 2 },
        { stringNum: 2, fret: 1 },
        { stringNum: 1, fret: 2 },
      ],
    };

    const notes = chordVoicings[chordName] || chordVoicings['C'];
    notes.forEach((item, index) => {
      setTimeout(() => {
        this.playUkulelePluck(item.stringNum, item.fret);
      }, index * 35);
    });
  }

  // Play Drum sound (Kick, Snare, Hi-Hat, Tom, Crash)
  playDrum(drum: 'kick' | 'snare' | 'hihat' | 'tom' | 'crash') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (drum === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(155, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (drum === 'snare') {
        // Noise burst
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(800, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.28, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        // Body tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(185, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.1);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
        noise.start(now);
        noise.stop(now + 0.19);
      } else if (drum === 'hihat') {
        // Sharp metallic sizzle
        const bufferSize = ctx.sampleRate * 0.06;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.06);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.07);
      } else if (drum === 'tom') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(88, now + 0.22);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (drum === 'crash') {
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4500, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.85);
      }
    } catch (e) {}
  }

  // Play Violin / Bowed string
  playViolinNote(freq = 440) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
      lfoGain.gain.setValueAtTime(3.5, now);
      lfo.connect(osc.frequency);
      lfo.start(now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.08); // bowed swell
      gain.gain.exponentialRampToValueAtTime(0.005, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
      lfo.stop(now + 1.25);
    } catch (e) {}
  }

  // Play Saxophone note
  playSaxNote(freq = 349.23) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.15);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

// Text To Speech helper with multiple speed options
export function speakSentence(text: string, lang = 'es-ES', rate = 1.0) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate; // 0.7 for slow/turtle, 1.0 for normal
  utterance.pitch = 1.05; // Slightly cheerful pitch

  // Pick voice if matched
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

// Speech Recognition helper with browser compatibility
export function createSpeechRecognizer(
  lang = 'es-ES',
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (typeof window === 'undefined') return null;

  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) {
    return null;
  }

  const recognition = new SpeechRec();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

// React Hook to access and toggle menu click sound state
export function useMenuClickSound() {
  const [enabled, setEnabled] = useState<boolean>(() => sound.isClickSoundEnabled());

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.enabled !== undefined) {
        setEnabled(e.detail.enabled);
      } else {
        setEnabled(sound.isClickSoundEnabled());
      }
    };
    window.addEventListener('menu-click-sound-changed', handler);
    return () => window.removeEventListener('menu-click-sound-changed', handler);
  }, []);

  const toggle = () => {
    const next = sound.toggleClickSound();
    setEnabled(next);
    return next;
  };

  return {
    isClickSoundEnabled: enabled,
    toggleClickSound: toggle,
    setClickSoundEnabled: (val: boolean) => sound.setClickSoundEnabled(val),
  };
}
