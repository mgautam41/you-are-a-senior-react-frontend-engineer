import { useState, useCallback } from 'react';
import { ShareSection } from '@/components/ShareSection';
import { RecentSection } from '@/components/RecentSection';
import { StatsSection } from '@/components/StatsSection';
import { ToastContainer, ToastData } from '@/components/Toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';

type SectionType = 'share' | 'recent' | 'stats';

const IndexContent = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [activeSection, setActiveSection] = useState<SectionType>('share');

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'share':
        return <ShareSection onToast={addToast} />;
      case 'recent':
        return <RecentSection onToast={addToast} />;
      case 'stats':
        return <StatsSection />;
      default:
        return <ShareSection onToast={addToast} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navbar */}
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-3 right-4 z-50 lg:top-4">
        <ThemeToggle />
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen pt-14 lg:pt-0 lg:pl-56">
        <div className="h-full min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-3xl">
            {renderSection()}
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
