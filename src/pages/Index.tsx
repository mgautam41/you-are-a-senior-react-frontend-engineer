import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ShareSection } from '@/components/ShareSection';
import { GetSection } from '@/components/GetSection';
import { ToastContainer, ToastData } from '@/components/Toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/hooks/useTheme';

type View = 'share' | 'get';

const IndexContent = () => {
  const [currentView, setCurrentView] = useState<View>('share');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 min-h-screen">
        {/* Header with theme toggle */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-end h-14 px-4 lg:px-8">
            <ThemeToggle />
          </div>
        </header>

        <div className="h-full px-4 py-8 lg:px-8 lg:py-12">
          <div className="max-w-2xl mx-auto pt-8 lg:pt-0">
            {currentView === 'share' ? (
              <ShareSection onToast={addToast} />
            ) : (
              <GetSection onToast={addToast} />
            )}
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
