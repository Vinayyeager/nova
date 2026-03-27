import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { Copy, Download, Check, Play, Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface PreviewPanelProps {
  code: string;
  language: string;
}

interface Output {
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: Date;
}

export default function PreviewPanel({ code, language }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<Output[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (code) {
      analyzeCode(code);
    }
  }, [code]);

  const analyzeCode = (code: string) => {
    const results: Output[] = [];
    
    if (code.includes('{') && !code.includes('}')) {
      results.push({ type: 'error', message: 'Missing closing brace', timestamp: new Date() });
    }
    
    if (code.includes('}') && !code.includes('{')) {
      results.push({ type: 'error', message: 'Missing opening brace', timestamp: new Date() });
    }
    
    if (code.includes('(') && !code.includes(')')) {
      results.push({ type: 'error', message: 'Missing closing parenthesis', timestamp: new Date() });
    }
    
    if (/\bfor\s*\(\s*\)/.test(code)) {
      results.push({ type: 'warning', message: 'Empty for loop condition detected', timestamp: new Date() });
    }
    
    if (/\bwhile\s*\(\s*true\s*\)/.test(code) || /\bwhile\s*\(\s*1\s*\)/.test(code)) {
      results.push({ type: 'warning', message: 'Potential infinite loop detected', timestamp: new Date() });
    }
    
    if (code.includes('var ')) {
      results.push({ type: 'info', message: 'Consider using const or let instead of var', timestamp: new Date() });
    }
    
    if (results.length === 0) {
      results.push({ type: 'success', message: 'No syntax errors detected', timestamp: new Date() });
    }
    
    setOutput(results);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      c: 'c'
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      if (language === 'javascript') {
        try {
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
            originalLog.apply(console, args);
          };
          
          new Function(code)();
          console.log = originalLog;
          
          logs.forEach(log => {
            setOutput(prev => [...prev, { type: 'info', message: log, timestamp: new Date() }]);
          });
          
          setOutput(prev => [...prev, { type: 'success', message: 'Code executed successfully', timestamp: new Date() }]);
        } catch (error) {
          setOutput(prev => [...prev, { 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Execution error', 
            timestamp: new Date() 
          }]);
        }
      } else {
        setOutput(prev => [...prev, { 
          type: 'info', 
          message: 'Execution available for JavaScript only. Try converting to JS!', 
          timestamp: new Date() 
        }]);
      }
      
      setIsRunning(false);
    }, 500);
  };

  const getLanguageName = (lang: string) => {
    const names: Record<string, string> = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      c: 'C'
    };
    return names[lang] || lang;
  };

  return (
    <div className="h-full flex flex-col bg-dark-bg border-l border-dark-border">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-card border-b border-dark-border">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Code Preview</h3>
          <span className="px-2 py-0.5 bg-accent-primary/20 text-accent-primary rounded text-xs">
            {getLanguageName(language)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-accent-success" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            title="Download code"
          >
            <Download size={16} />
          </button>
          {language === 'javascript' && (
            <button
              onClick={handleRun}
              disabled={isRunning || !code}
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors disabled:opacity-50"
              title="Run code"
            >
              <Play size={16} className={isRunning ? 'text-accent-primary animate-pulse' : 'text-accent-success'} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {code ? (
          <CodeEditor
            code={code}
            language={language}
            onChange={() => {}}
            height="100%"
            readOnly
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            <div className="text-center">
              <Terminal size={48} className="mx-auto mb-3 opacity-50" />
              <p>No code to preview</p>
              <p className="text-sm mt-1">Send a message with code to see it here</p>
            </div>
          </div>
        )}
      </div>

      <div className="h-48 border-t border-dark-border bg-dark-card/50 overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-dark-border flex items-center gap-2">
          <Terminal size={14} />
          <span className="text-sm font-medium">Console Output</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {output.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 text-sm ${
                item.type === 'error' ? 'text-accent-error' :
                item.type === 'success' ? 'text-accent-success' :
                item.type === 'warning' ? 'text-accent-warning' :
                'text-slate-300'
              }`}
            >
              {item.type === 'error' && <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
              {item.type === 'success' && <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />}
              {item.type === 'warning' && <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
              {item.type === 'info' && <Info size={14} className="flex-shrink-0 mt-0.5" />}
              <span className="flex-1">{item.message}</span>
            </div>
          ))}
          {output.length === 0 && (
            <p className="text-sm text-slate-600">Analysis output will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
