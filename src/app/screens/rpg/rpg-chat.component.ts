import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RpgService } from '../../core/services/rpg.service';

@Component({
  selector: 'app-rpg-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rpg-chat.component.html',
})
export class RpgChatComponent implements AfterViewChecked {
  rpgService = inject(RpgService);

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messageInput = signal('');

  get messages() {
    return this.rpgService.chatMessages;
  }

  get personagens() {
    return this.rpgService.personagens;
  }

  ngOnInit() {
    this.loadPersonagens();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  loadPersonagens() {
    this.rpgService.loadPersonagens();
  }

  resetPersonagens() {
    this.rpgService.resetPersonagens();
  }

  sendMessage() {
    if (this.messageInput().trim()) {
      this.rpgService.sendMessage(this.messageInput().trim());
      this.messageInput.set('');
    }
  }
}
