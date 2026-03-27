import { useState, useRef, useEffect } from 'react';
import { useChat, Message } from '../context/ChatContext';
import { Send, Loader2, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import CodeEditor from './CodeEditor';

interface ChatScreenProps {
  onCodeChange: (code: string, language: string) => void;
}

const API_BASE = 'http://localhost:3001/api';

export default function ChatScreen({ onCodeChange }: ChatScreenProps) {
  const { messages, currentChat, createChat, addMessage, updateLastMessage } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!currentChat) {
      createChat();
    }
  }, [currentChat, createChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.code) {
        onCodeChange(lastMsg.code, lastMsg.language || 'javascript');
      }
    }
  }, [messages, onCodeChange]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      addMessage(assistantMessage);

      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();
      
      updateLastMessage(
        data.response || 'I received your message.',
        data.code,
        data.language
      );
    } catch {
      updateLastMessage('Sorry, I encountered an error. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSendFromEditor = () => {
    setInput(editorCode);
    handleSubmit();
    setShowEditor(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center mb-4 glow">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to CodeForge AI</h2>
            <p className="text-slate-500 max-w-md mb-6">
              I can help you write, explain, fix, and optimize code. Just paste your code or ask me anything!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Explain this code', 'Fix bugs in my code', 'Optimize performance', 'Convert to Python'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-accent-primary/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 message-enter">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-dark-border bg-dark-card/50">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              showEditor
                ? 'bg-accent-primary border-accent-primary text-white'
                : 'bg-dark-bg border-dark-border hover:border-accent-primary/50'
            }`}
          >
            Code Editor
          </button>
        </div>

        {showEditor && (
          <div className="mt-3 h-64 rounded-xl overflow-hidden border border-dark-border">
            <div className="flex items-center justify-between px-3 py-2 bg-dark-card border-b border-dark-border">
              <select
                value={editorLanguage}
                onChange={(e) => setEditorLanguage(e.target.value)}
                className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
              <button
                onClick={handleSendFromEditor}
                className="px-3 py-1 bg-accent-primary rounded text-sm hover:bg-accent-hover transition-colors"
              >
                Analyze
              </button>
            </div>
            <CodeEditor
              code={editorCode}
              language={editorLanguage}
              onChange={setEditorCode}
              height="calc(100% - 40px)"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message CodeForge AI..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-accent-primary transition-colors"
              rows={1}
              style={{ maxHeight: '150px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-accent-primary hover:bg-accent-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
