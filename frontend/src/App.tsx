import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';
import { useTheme } from './context/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme} bg-dark-bg text-slate-50 min-h-screen`}>
      <Layout />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
