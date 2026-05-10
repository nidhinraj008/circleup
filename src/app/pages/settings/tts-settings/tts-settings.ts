import { Component, inject, signal } from '@angular/core';
import { TTSService } from '../../../shared/services/tts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tts-settings',
  imports: [CommonModule],
  templateUrl: './tts-settings.html',
  styleUrl: './tts-settings.scss',
})
export class TTSSettings {
  ttsService = inject(TTSService);
  availableVoices = signal<SpeechSynthesisVoice[]>([]);
  isPreviewPlaying = signal<string | null>(null);

  ngOnInit() {
    this.loadVoices();
  }

  private loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.availableVoices.set(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        this.availableVoices.set(window.speechSynthesis.getVoices());
      };
    }
  }

  selectVoice(voice: SpeechSynthesisVoice) {
    this.ttsService.setVoice(voice.name);
  }

  previewVoice(event: Event, voice: SpeechSynthesisVoice) {
    event.stopPropagation();
    window.speechSynthesis.cancel();

    if (this.isPreviewPlaying() === voice.name) {
      this.isPreviewPlaying.set(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance("Hello, this is a preview of my voice.");
    utterance.voice = voice;
    utterance.rate = this.ttsService.speed();

    utterance.onstart = () => this.isPreviewPlaying.set(voice.name);
    utterance.onend = () => this.isPreviewPlaying.set(null);

    window.speechSynthesis.speak(utterance);
  }
}
