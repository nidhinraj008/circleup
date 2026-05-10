import { Component, inject } from '@angular/core';
import { TTSService } from '../../services/tts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tts-player',
  imports: [CommonModule],
  templateUrl: './tts-player.html',
  styleUrl: './tts-player.scss',
})
export class TTSPlayer {
  ttsService = inject(TTSService);

  public changeSpeed() {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(this.ttsService.speed());
    const nextIndex = (currentIndex + 1) % speeds.length;
    this.ttsService.setSpeed(speeds[nextIndex]);
  }

  public changeVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    const currentName = this.ttsService.selectedVoiceName();
    const currentIndex = voices.findIndex(v => v.name === currentName);
    const nextIndex = (currentIndex + 1) % voices.length;
    this.ttsService.setVoice(voices[nextIndex].name);
  }

  public onSeekStart(event: MouseEvent | TouchEvent) {
    this.seek(event);

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      this.seek(e);
    };

    const endHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', endHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', endHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', endHandler);
  }

  private seek(event: MouseEvent | TouchEvent) {
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
    const container = document.querySelector('.tts-player-floating');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.ttsService.seek(percentage);
  }
}
