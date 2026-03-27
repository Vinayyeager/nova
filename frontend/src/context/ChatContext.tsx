import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  language?: string;
  timestamp: Date;
  action?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  createChat: () => Chat;
  selectChat: (chatId: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string, code?: string, language?: string) => void;
  deleteChat: (chatId: string) => void;
  clearCurrentChat: () => void;
  searchChats: (query: string) => Chat[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = localStorage.getItem('codeforge_chats');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    return localStorage.getItem('codeforge_current_chat');
  });

  const currentChat = chats.find(c => c.id === currentChatId) || null;
  const messages = currentChat?.messages || [];

  useEffect(() => {
    localStorage.setItem('codeforge_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('codeforge_current_chat', currentChatId);
    } else {
      localStorage.removeItem('codeforge_current_chat');
    }
  }, [currentChatId]);

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat;
  }, [chats.length]);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const addMessage = useCallback((message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const title = chat.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
          : chat.title;
        
        return {
          ...chat,
          title,
          messages: [...chat.messages, message],
          updatedAt: new Date()
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  const updateLastMessage = useCallback((content: string, code?: string, language?: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId && chat.messages.length > 0) {
        const updatedMessages = [...chat.messages];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content,
          ...(code && { code }),
          ...(language && { language })
        };
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date()
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const clearCurrentChat = useCallback(() => {
    if (currentChatId) {
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [],
            updatedAt: new Date()
          };
        }
        return chat;
      }));
    }
  }, [currentChatId]);

  const searchChats = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(lowerQuery) ||
      chat.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
    );
  }, [chats]);

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      messages,
      createChat,
      selectChat,
      addMessage,
      updateLastMessage,
      deleteChat,
      clearCurrentChat,
      searchChats
    }}>
      {children}
    </ChatContext.Provider>
  );
};
