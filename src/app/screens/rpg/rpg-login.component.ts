import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RpgService } from '../../core/services/rpg.service';

@Component({
  selector: 'app-rpg-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card bg-base-100 shadow-xl border border-primary/30 max-w-md mx-auto mt-10">
      <div class="card-body items-center text-center">
        <div class="text-5xl mb-2">⚔️</div>
        <h2 class="card-title text-primary text-2xl mb-2">RPG Arena</h2>
        <p class="text-base-content/70 text-sm mb-6">Conecte-se para conversar e batalhar</p>
        
        <div class="form-control w-full">
          <input 
            type="text" 
            [ngModel]="username()"
            (ngModelChange)="username.set($event)"
            placeholder="Seu nome de guerreiro" 
            class="input input-bordered input-primary w-full" 
            (keyup.enter)="conectar()"
            [disabled]="status() === 'connecting'"
          />
        </div>

        <div class="card-actions mt-4 w-full justify-center">
          <button 
            class="btn btn-primary w-full" 
            (click)="conectar()"
            [disabled]="!username() || status() === 'connecting'"
          >
            @if (status() === 'connecting') {
              <span class="loading loading-spinner"></span>
            }
            {{ status() === 'connecting' ? 'Conectando...' : 'Entrar na Arena' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class RpgLoginComponent {
  rpgService = inject(RpgService);
  
  username = signal('');
  
  get status() {
    return this.rpgService.connectionStatus;
  }

  conectar() {
    if (this.username().trim()) {
      this.rpgService.connect(this.username().trim());
    }
  }
}
