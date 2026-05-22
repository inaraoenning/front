import { Injectable, signal } from '@angular/core';
import axios from 'axios';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  remetente: string;
  conteudo: string;
  tipo: 'ENTRAR' | 'SAIR' | 'CHAT';
}

export interface Personagem {
  id: number;
  nome: string;
  tipo_personagem: string;
  vida: number;
  ataque: number;
  defesa: number;
  magia: number;
}

export interface BatalhaState {
  id?: number;
  personagem1?: Personagem;
  personagem2?: Personagem;
  encerrada?: boolean;
  vencedor?: string;
  log?: string;
  logDescritivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RpgService {
  private readonly API_URL = 'https://desafio-final-rpg-kotlin.onrender.com';
  private stompClient: Client | null = null;

  // Signals para gerenciar estado global na UI
  username = signal<string>('');
  connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');
  chatMessages = signal<ChatMessage[]>([]);
  personagens = signal<Personagem[]>([]);
  batalhaState = signal<BatalhaState | null>(null);

  constructor() {}

  // ==========================================
  // WEBSOCKET (CHAT)
  // ==========================================
  connect(user: string) {
    if (!user.trim()) return;
    
    this.username.set(user);
    this.connectionStatus.set('connecting');

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.API_URL}/chat-websocket`),
      debug: (msg: string) => {},
      onConnect: (frame) => {
        this.connectionStatus.set('connected');

        this.stompClient?.subscribe('/topic/mensagens', (mensagem: IMessage) => {
          if (mensagem.body) {
            const dados: ChatMessage = JSON.parse(mensagem.body);
            this.chatMessages.update(msgs => [...msgs, dados]);
          }
        });

        // Envia mensagem de "ENTRAR"
        this.stompClient?.publish({
          destination: '/app/chat.entrar',
          body: JSON.stringify({
            remetente: this.username(),
            conteudo: '',
            tipo: 'ENTRAR'
          })
        });
      },
      onWebSocketError: (error) => {
        console.error('Erro no WebSocket', error);
        this.connectionStatus.set('disconnected');
      },
      onStompError: (frame) => {
        console.error('Erro STOMP', frame.headers['message']);
        this.connectionStatus.set('disconnected');
      }
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate().then(() => {
        this.connectionStatus.set('disconnected');
      });
    }
  }

  sendMessage(texto: string) {
    if (!texto.trim() || !this.stompClient || this.connectionStatus() !== 'connected') return;

    this.stompClient.publish({
      destination: '/app/chat.enviar',
      body: JSON.stringify({
        remetente: this.username(),
        conteudo: texto,
        tipo: 'CHAT'
      })
    });
  }

  sendSystemMessage(texto: string) {
    if (!this.stompClient || this.connectionStatus() !== 'connected') return;
    
    this.stompClient.publish({
      destination: '/app/chat.enviar',
      body: JSON.stringify({
        remetente: '🔔 Sistema',
        conteudo: texto,
        tipo: 'CHAT'
      })
    });
  }

  // ==========================================
  // REST API (AXIOS)
  // ==========================================
  
  async loadPersonagens() {
    try {
      const response = await axios.get(`${this.API_URL}/personagem`);
      this.personagens.set(response.data);
    } catch (error) {
      console.error('Erro ao carregar personagens', error);
    }
  }

  async iniciarBatalha(idP1: number, idP2: number) {
    try {
      const response = await axios.post(`${this.API_URL}/batalha/iniciar`, {
        idPersonagem1: idP1,
        idPersonagem2: idP2
      });
      
      this.batalhaState.set(response.data);

      const p1Nome = response.data.personagem1?.nome ?? '?';
      const p2Nome = response.data.personagem2?.nome ?? '?';
      
      this.sendSystemMessage(`Nova batalha iniciada! ID: ${response.data.id} — ${p1Nome} vs ${p2Nome}`);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar batalha', error);
      throw error;
    }
  }

  async consultarBatalha(id: number) {
    try {
      const response = await axios.get(`${this.API_URL}/batalha/${id}`);
      this.batalhaState.set(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar batalha', error);
      throw error;
    }
  }

  async enviarAcaoCliente(idBatalha: number, acao: string) {
    try {
      const response = await axios.post(`${this.API_URL}/rede/enviar-acao`, {
        idBatalha,
        acao
      });
      return response.data; // Retorna texto ou log
    } catch (error) {
      console.error('Erro ao enviar ação do cliente', error);
      throw error;
    }
  }

  async executarAcaoHost(idBatalha: number, acao: string, urlCliente: string) {
    try {
      const response = await axios.post(`${this.API_URL}/rede/executar-acao-host`, {
        idBatalha,
        acao,
        urlCliente
      });
      
      // A resposta pode ser um objeto JSON de batalha ou texto se estiver aguardando
      if (typeof response.data === 'object' && response.data.id) {
        this.batalhaState.set(response.data);
        
        // Verifica se terminou
        if (response.data.encerrada) {
          this.sendSystemMessage(`⚔️ BATALHA ENCERRADA! Vencedor: ${response.data.vencedor} 🏆`);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao executar ação do host', error);
      throw error;
    }
  }
}
