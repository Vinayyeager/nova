import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Search, Plus, Trash2, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const { chats, currentChat, createChat, selectChat, deleteChat, searchChats } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setFilteredChats(searchChats(query));
    } else {
      setFilteredChats(chats);
    }
  };

  const handleNewChat = () => {
    createChat();
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="w-60 h-screen bg-dark-card border-r border-dark-border flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary hover:bg-accent-hover rounded-xl transition-all font-medium"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {(searchQuery ? filteredChats : chats).map((chat) => (
            <div
              key={chat.id}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                currentChat?.id === chat.id
                  ? 'bg-accent-primary/10 border border-accent-primary/30'
                  : 'hover:bg-dark-hover border border-transparent'
              }`}
              onClick={() => selectChat(chat.id)}
            >
              <MessageSquare size={16} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-xs text-slate-500">{formatDate(chat.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent-error/20 rounded-lg transition-all"
              >
                <Trash2 size={14} className="text-accent-error" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
