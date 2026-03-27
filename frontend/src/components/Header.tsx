import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onAuthClick: () => void;
}

export default function Header({ onAuthClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { clearCurrentChat } = useChat();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-dark-card/80 backdrop-blur-xl border-b border-dark-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12L14 16L8 20" />
              <path d="M16 20H24" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gradient">CodeForge AI</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={clearCurrentChat}
          className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-dark-hover rounded-lg transition-all"
        >
          Clear Chat
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-dark-hover rounded-lg transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => isAuthenticated ? setShowUserMenu(!showUserMenu) : onAuthClick()}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-hover hover:bg-dark-border rounded-lg transition-all"
          >
            <User size={16} />
            <span className="text-sm">{isAuthenticated ? user?.username : 'Sign In'}</span>
          </button>
          
          {showUserMenu && isAuthenticated && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-dark-border">
                <p className="font-medium">{user?.username}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-dark-hover transition-colors text-accent-error"
              >
                <LogOut size={16} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
