import { useState, useEffect } from 'react';
import { Clock, FileText, Image as ImageIcon, Copy, Check, Trash2 } from 'lucide-react';
import { ToastData } from './Toast';

interface RecentItem {
  id: string;
  code: string;
  type: 'text' | 'image';
  preview: string;
  timestamp: Date;
}

interface RecentSectionProps {
  onToast: (toast: Omit<ToastData, 'id'>) => void;
}

// Fake recent data
const generateFakeRecent = (): RecentItem[] => [
  {
    id: '1',
    code: '4821',
    type: 'text',
    preview: 'Meeting notes from yesterday\'s standup. Need to follow up on the design review...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    code: '7293',
    type: 'image',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    code: '1056',
    type: 'text',
    preview: 'Shopping list: eggs, milk, bread, butter, cheese, tomatoes, lettuce...',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '4',
    code: '3847',
    type: 'image',
    preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: '5',
    code: '9162',
    type: 'text',
    preview: 'Password reset link: https://example.com/reset?token=abc123...',
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
  },
];

export const RecentSection = ({ onToast }: RecentSectionProps) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading recent items
    const timer = setTimeout(() => {
      setRecentItems(generateFakeRecent());
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleCopyCode = async (item: RecentItem) => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopiedId(item.id);
      onToast({ type: 'success', message: `Code ${item.code} copied!` });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onToast({ type: 'error', message: 'Failed to copy code' });
    }
  };

  const handleDelete = (id: string) => {
    setRecentItems((prev) => prev.filter((item) => item.id !== id));
    onToast({ type: 'success', message: 'Item removed from history' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
          <Clock className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Recent Activity</h1>
          <p className="text-sm text-muted-foreground">Your recently shared content</p>
        </div>
      </div>

      {recentItems.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No recent activity yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start sharing to see your history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${item.type === 'text' ? 'bg-primary/10' : 'bg-accent/10'}
                `}>
                  {item.type === 'text' ? (
                    <FileText className="w-5 h-5 text-primary" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-accent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-foreground">{item.code}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
                  </div>
                  
                  {item.type === 'text' ? (
                    <p className="text-sm text-muted-foreground truncate">{item.preview}</p>
                  ) : (
                    <img
                      src={item.preview}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover mt-2"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleCopyCode(item)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-150"
                    title="Copy code"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors duration-150"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
