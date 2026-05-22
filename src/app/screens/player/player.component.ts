import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
})
export class Player implements OnInit, OnDestroy {
  // Lógica do Player de Música
  private audio = new Audio();
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  ngOnInit() {
    // Configura a música que está dentro da pasta 'public'
    this.audio.src = 'musica.mp3';
    this.audio.loop = true; // Deixa tocando em loop

    // Ouvintes de eventos para atualizar o progresso da música
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration);
    });
  }

  ngOnDestroy() {
    this.audio.pause();
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  seek(event: any) {
    const novoTempo = event.target.value;
    this.audio.currentTime = novoTempo;
    this.currentTime.set(novoTempo);
  }
}