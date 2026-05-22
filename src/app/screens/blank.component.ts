import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpgLoginComponent } from './rpg/rpg-login.component';
import { RpgChatComponent } from './rpg/rpg-chat.component';
import { RpgBattleComponent } from './rpg/rpg-battle.component';
import { RpgService } from '../core/services/rpg.service';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [CommonModule, RpgLoginComponent, RpgChatComponent, RpgBattleComponent],
  templateUrl: './blank.component.html',
})
export class BlankComponent {
  rpgService = inject(RpgService);

  get isConnected() {
    return this.rpgService.connectionStatus() === 'connected';
  }
}
