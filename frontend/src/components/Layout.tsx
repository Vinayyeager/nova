import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatScreen from './ChatScreen';
import PreviewPanel from './PreviewPanel';
import AuthModal from './AuthModal';

export default function Layout() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(50);
  const [previewCode, setPreviewCode] = useState('');
  const [previewLanguage, setPreviewLanguage] = useState('javascript');

  const handleCodeChange = (code: string, language: string) => {
    setPreviewCode(code);
    setPreviewLanguage(language);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAuthClick={() => setShowAuthModal(true)} />
        
        <div className="flex-1 flex overflow-hidden">
          <div style={{ width: `${previewWidth}%` }} className="flex flex-col overflow-hidden">
            <ChatScreen onCodeChange={handleCodeChange} />
          </div>
          
          <div
            className="w-1 bg-dark-border hover:bg-accent-primary cursor-col-resize transition-colors drag-handle"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = previewWidth;
              
              const handleMouseMove = (e: MouseEvent) => {
                const delta = e.clientX - startX;
                const containerWidth = window.innerWidth - 240;
                const newWidth = startWidth + (delta / containerWidth) * 100;
                setPreviewWidth(Math.max(20, Math.min(80, newWidth)));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
          
          <div style={{ width: `${100 - previewWidth}%` }} className="overflow-hidden">
            <PreviewPanel code={previewCode} language={previewLanguage} />
          </div>
        </div>
      </div>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
