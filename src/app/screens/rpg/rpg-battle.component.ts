import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RpgService } from '../../core/services/rpg.service';

@Component({
  selector: 'app-rpg-battle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rpg-battle.component.html',
})
export class RpgBattleComponent {
  rpgService = inject(RpgService);

  // Passo 1 Form
  idP1 = signal<number | null>(null);
  idP2 = signal<number | null>(null);

  // Passo 2 Form
  modo = signal<'cliente' | 'host'>('cliente');
  batalhaId = signal<number | null>(null);
  acaoCliente = signal<string>('ATACAR');
  acaoHost = signal<string>('ATACAR');
  urlCliente = signal<string>('https://desafio-final-rpg-kotlin.onrender.com');

  get batalha() {
    return this.rpgService.batalhaState;
  }

  async iniciarBatalha() {
    if (!this.idP1() || !this.idP2()) {
      alert('Preencha os dois IDs!');
      return;
    }
    try {
      const data = await this.rpgService.iniciarBatalha(this.idP1()!, this.idP2()!);
      this.batalhaId.set(data.id);
    } catch (e) {
      alert('Erro ao iniciar batalha!');
    }
  }

  async consultarBatalha() {
    if (!this.batalhaId()) {
      alert('Informe o ID da batalha!');
      return;
    }
    try {
      await this.rpgService.consultarBatalha(this.batalhaId()!);
    } catch (e) {
      alert('Erro ao consultar a batalha!');
    }
  }

  async enviarAcaoCliente() {
    if (!this.batalhaId()) {
      alert('Informe o ID da batalha!');
      return;
    }
    try {
      const resp = await this.rpgService.enviarAcaoCliente(this.batalhaId()!, this.acaoCliente());
      alert('Ação enviada: ' + resp);
    } catch (e) {
      alert('Erro ao enviar ação.');
    }
  }

  async executarTurnoHost() {
    if (!this.batalhaId() || !this.urlCliente()) {
      alert('Informe o ID e a URL do cliente!');
      return;
    }
    try {
      const resp = await this.rpgService.executarAcaoHost(this.batalhaId()!, this.acaoHost(), this.urlCliente());
      if (typeof resp === 'string') {
        alert(resp);
      } else {
        alert('Turno processado e enviado ao cliente!');
      }
    } catch (e) {
      alert('Erro ao executar turno host.');
    }
  }
}
