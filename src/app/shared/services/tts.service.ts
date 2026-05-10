import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TTSService implements OnDestroy {
  private readonly VOICE_KEY = 'tts_selected_voice_name';
  private readonly SPEED_KEY = 'tts_selected_speed';

  selectedVoiceName = signal<string | null>(localStorage.getItem(this.VOICE_KEY));
  speed = signal<number>(Number(localStorage.getItem(this.SPEED_KEY)) || 1);

  // Playback state
  showPlayer = signal(false);
  isPlaying = signal(false);
  isPaused = signal(false);
  progress = signal(0);
  
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentCharIndex = 0;
  private fullText = '';
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    window.speechSynthesis.cancel();
    this.loadVoices();

    // Ensure speech stops when the tab is closed or refreshed
    window.addEventListener('beforeunload', () => {
      window.speechSynthesis.cancel();
    });
  }

  ngOnDestroy() {
    this.stop();
  }

  private loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.availableVoices = voices;
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  setVoice(name: string) {
    this.selectedVoiceName.set(name);
    localStorage.setItem(this.VOICE_KEY, name);
    if (this.isPlaying() && !this.isPaused()) {
      this.start(this.currentCharIndex);
    }
  }

  setSpeed(speed: number) {
    this.speed.set(speed);
    localStorage.setItem(this.SPEED_KEY, speed.toString());
    if (this.isPlaying() && !this.isPaused()) {
      this.start(this.currentCharIndex);
    }
  }

  play(text: string) {
    if (this.showPlayer()) {
      this.stop();
    }

    this.fullText = text;
    if (!this.fullText.trim()) return;

    this.showPlayer.set(true);
    this.start(0);
  }

  private start(fromIndex: number) {
    window.speechSynthesis.cancel();
    
    this.currentCharIndex = fromIndex;
    const textToPlay = this.fullText.substring(fromIndex);
    
    this.utterance = new SpeechSynthesisUtterance(textToPlay);
    
    const voice = this.availableVoices.find(v => v.name === this.selectedVoiceName());
    if (voice) {
      this.utterance.voice = voice;
    }

    this.utterance.rate = this.speed();
    
    this.utterance.onboundary = (event) => {
      if (event.name === 'word') {
        this.currentCharIndex = fromIndex + event.charIndex;
        const progress = (this.currentCharIndex / this.fullText.length) * 100;
        this.progress.set(progress);
      }
    };

    this.utterance.onend = () => {
      if (!this.isPaused()) {
        this.stop();
      }
    };

    this.isPlaying.set(true);
    this.isPaused.set(false);
    window.speechSynthesis.speak(this.utterance);
  }

  togglePause() {
    if (this.isPaused()) {
      window.speechSynthesis.resume();
      this.isPaused.set(false);
    } else {
      window.speechSynthesis.pause();
      this.isPaused.set(true);
    }
  }

  stop() {
    window.speechSynthesis.cancel();
    this.showPlayer.set(false);
    this.isPlaying.set(false);
    this.isPaused.set(false);
    this.progress.set(0);
    this.currentCharIndex = 0;
  }

  rewind() {
    let newIndex = Math.max(0, this.currentCharIndex - 150);
    this.start(newIndex);
  }

  forward() {
    let newIndex = Math.min(this.fullText.length - 1, this.currentCharIndex + 150);
    this.start(newIndex);
  }

  seek(percentage: number) {
    if (!this.fullText) return;
    const newIndex = Math.floor((percentage / 100) * this.fullText.length);
    this.start(newIndex);
  }
}
