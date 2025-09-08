// utils/conversationStorage.ts - Local storage for conversation history

import { UnileverArchetype } from '../types/unileverPersona.types';

export interface StoredMessage {
  id: string;
  text: string;
  sender: 'user' | 'persona';
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  archetype: UnileverArchetype;
  persona_name: string;
  messages: StoredMessage[];
  created_at: Date;
  updated_at: Date;
}

class ConversationStorage {
  private static instance: ConversationStorage;
  private readonly STORAGE_KEY = 'unilever_persona_conversations';

  public static getInstance(): ConversationStorage {
    if (!ConversationStorage.instance) {
      ConversationStorage.instance = new ConversationStorage();
    }
    return ConversationStorage.instance;
  }

  // Guardar nueva conversación
  saveConversation(session: ConversationSession): void {
    try {
      const conversations = this.getAllConversations();
      const existingIndex = conversations.findIndex(c => c.id === session.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = {
          ...session,
          updated_at: new Date()
        };
      } else {
        conversations.push(session);
      }
      
      // Mantener solo las últimas 50 conversaciones
      const limitedConversations = conversations
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 50);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedConversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  // Obtener conversación por ID
  getConversation(id: string): ConversationSession | null {
    try {
      const conversations = this.getAllConversations();
      const conversation = conversations.find(c => c.id === id);
      return conversation || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  // Obtener todas las conversaciones
  getAllConversations(): ConversationSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((conv: any) => ({
        ...conv,
        created_at: new Date(conv.created_at),
        updated_at: new Date(conv.updated_at),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error getting all conversations:', error);
      return [];
    }
  }

  // Obtener conversaciones por arquetipo
  getConversationsByArchetype(archetype: UnileverArchetype): ConversationSession[] {
    try {
      const all = this.getAllConversations();
      return all.filter(c => c.archetype === archetype)
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
    } catch (error) {
      console.error('Error getting conversations by archetype:', error);
      return [];
    }
  }

  // Eliminar conversación
  deleteConversation(id: string): void {
    try {
      const conversations = this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  // Limpiar todas las conversaciones
  clearAllConversations(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing conversations:', error);
    }
  }

  // Crear nueva sesión de conversación
  createNewSession(archetype: UnileverArchetype, persona_name: string): ConversationSession {
    const now = new Date();
    return {
      id: `conversation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      archetype,
      persona_name,
      messages: [],
      created_at: now,
      updated_at: now
    };
  }

  // Agregar mensaje a sesión existente
  addMessageToSession(sessionId: string, message: StoredMessage): ConversationSession | null {
    try {
      const session = this.getConversation(sessionId);
      if (!session) return null;
      
      session.messages.push(message);
      session.updated_at = new Date();
      
      this.saveConversation(session);
      return session;
    } catch (error) {
      console.error('Error adding message to session:', error);
      return null;
    }
  }

  // Obtener estadísticas de conversaciones
  getConversationStats(): {
    total_conversations: number;
    conversations_by_archetype: Record<string, number>;
    total_messages: number;
    most_active_archetype: string | null;
  } {
    try {
      const conversations = this.getAllConversations();
      const stats = {
        total_conversations: conversations.length,
        conversations_by_archetype: {} as Record<string, number>,
        total_messages: 0,
        most_active_archetype: null as string | null
      };

      conversations.forEach(conv => {
        stats.conversations_by_archetype[conv.archetype] = 
          (stats.conversations_by_archetype[conv.archetype] || 0) + 1;
        stats.total_messages += conv.messages.length;
      });

      // Encontrar el arquetipo más activo
      let maxCount = 0;
      Object.entries(stats.conversations_by_archetype).forEach(([archetype, count]) => {
        if (count > maxCount) {
          maxCount = count;
          stats.most_active_archetype = archetype;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      return {
        total_conversations: 0,
        conversations_by_archetype: {},
        total_messages: 0,
        most_active_archetype: null
      };
    }
  }

  // Exportar conversaciones a JSON
  exportConversations(): string {
    try {
      const conversations = this.getAllConversations();
      return JSON.stringify({
        export_date: new Date().toISOString(),
        version: '1.0',
        conversations: conversations
      }, null, 2);
    } catch (error) {
      console.error('Error exporting conversations:', error);
      return '{"error": "Failed to export conversations"}';
    }
  }

  // Importar conversaciones desde JSON
  importConversations(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.conversations && Array.isArray(data.conversations)) {
        // Validar estructura básica
        const validConversations = data.conversations.filter((conv: any) => 
          conv.id && conv.archetype && conv.persona_name && Array.isArray(conv.messages)
        );
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validConversations));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing conversations:', error);
      return false;
    }
  }
}

export const conversationStorage = ConversationStorage.getInstance();