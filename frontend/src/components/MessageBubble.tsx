import { Message } from '../context/ChatContext';
import { Copy, Download, Check, FileCode, Lightbulb, Wrench, Zap, ArrowRightLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MessageBubbleProps {
  message: Message;
}

const API_BASE = 'http://localhost:3001/api';

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(message.role === 'assistant' && !message.content);

  useEffect(() => {
    if (message.role === 'assistant' && message.content) {
      let i = 0;
      setIsTyping(true);
      const interval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedContent(message.content.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 10);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.role]);

  const handleCopy = async () => {
    if (message.code) {
      await navigator.clipboard.writeText(message.code);
    } else {
      await navigator.clipboard.writeText(message.content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (message.code) {
      const ext = getExtension(message.language || 'javascript');
      const blob = new Blob([message.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      c: 'c'
    };
    return extensions[lang] || 'txt';
  };

  const handleAction = async (action: string) => {
    if (!message.code) return;

    try {
      let endpoint = '';
      let body: Record<string, string> = { code: message.code };

      switch (action) {
        case 'explain':
          endpoint = '/explain';
          break;
        case 'fix':
          endpoint = '/fix';
          break;
        case 'optimize':
          endpoint = '/optimize';
          break;
        case 'convert':
          const targetLang = message.language === 'javascript' ? 'python' : 'javascript';
          endpoint = '/convert';
          body = { ...body, from: message.language || 'javascript', to: targetLang };
          break;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log(`${action} result:`, data);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  return (
    <div className={`flex gap-3 message-enter ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          message.role === 'user'
            ? 'bg-accent-primary'
            : 'bg-gradient-to-br from-accent-primary to-purple-500'
        }`}
      >
        {message.role === 'user' ? (
          <span className="text-white text-sm font-semibold">U</span>
        ) : (
          <FileCode size={16} className="text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            message.role === 'user'
              ? 'bg-accent-primary text-white'
              : 'bg-dark-card border border-dark-border'
          }`}
        >
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {displayedContent}
              {isTyping && <span className="inline-block w-2 h-4 bg-accent-primary ml-1 animate-pulse" />}
            </div>
          </div>
        </div>

        {message.code && (
          <div className="mt-3 code-block">
            <div className="code-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-500 ml-2">
                  {message.language || 'code'}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-dark-hover rounded transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-accent-success" /> : <Copy size={14} />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-dark-hover rounded transition-colors"
                  title="Download code"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-slate-300">{message.code}</code>
            </pre>
          </div>
        )}

        {message.role === 'assistant' && message.code && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('explain')}
              className="action-btn flex items-center gap-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-accent-primary/50"
            >
              <Lightbulb size={14} className="text-accent-warning" />
              Explain
            </button>
            <button
              onClick={() => handleAction('fix')}
              className="action-btn flex items-center gap-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-accent-primary/50"
            >
              <Wrench size={14} className="text-accent-success" />
              Fix Code
            </button>
            <button
              onClick={() => handleAction('optimize')}
              className="action-btn flex items-center gap-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-accent-primary/50"
            >
              <Zap size={14} className="text-accent-primary" />
              Optimize
            </button>
            <button
              onClick={() => handleAction('convert')}
              className="action-btn flex items-center gap-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-accent-primary/50"
            >
              <ArrowRightLeft size={14} className="text-purple-400" />
              Convert
            </button>
          </div>
        )}

        <p className="text-xs text-slate-600 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
