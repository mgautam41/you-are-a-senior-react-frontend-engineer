import { useState, useRef } from 'react';
import { Search, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { getItem, ClipboardItem } from '@/store/clipboardStore';
import { ToastData } from './Toast';

interface GetSectionProps {
  onToast: (toast: Omit<ToastData, 'id'>) => void;
}

export const GetSection = ({ onToast }: GetSectionProps) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClipboardItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullCode = code.join('');
  const isCodeComplete = fullCode.length === 4;

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 4 - index).split('');
      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    setResult(null);
    setError(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFetch = async () => {
    if (!isCodeComplete) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const item = getItem(fullCode);
    
    if (item) {
      setResult(item);
      onToast({ type: 'success', message: 'Content retrieved successfully!' });
    } else {
      setError('No content found with this code');
      onToast({ type: 'error', message: 'Code not found' });
    }

    setIsLoading(false);
  };

  const handleCopyContent = async () => {
    if (!result || result.type !== 'text') return;

    try {
      await navigator.clipboard.writeText(result.content);
      setIsCopied(true);
      onToast({ type: 'success', message: 'Content copied to clipboard' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onToast({ type: 'error', message: 'Failed to copy content' });
    }
  };

  const handleReset = () => {
    setCode(['', '', '', '']);
    setResult(null);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Get Content</h1>
      <p className="text-muted-foreground mb-6">
        Enter a 4-digit code to retrieve shared content
      </p>

      {/* Code Input */}
      <div className="flex justify-center gap-3 mb-6">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={digit}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-16 text-center text-2xl font-semibold bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-150"
          />
        ))}
      </div>

      {/* Fetch Button */}
      <button
        onClick={handleFetch}
        disabled={!isCodeComplete || isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-sm
          flex items-center justify-center gap-2
          transition-all duration-150
          ${
            !isCodeComplete || isLoading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Fetching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Fetch Content
          </>
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="mt-6 p-5 bg-card rounded-xl border border-destructive/30 animate-fade-in">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            Try another code
          </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-5 bg-card rounded-xl border border-border animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {result.type === 'text' ? 'Shared Text' : 'Shared Image'}
            </span>
            {result.type === 'text' && (
              <button
                onClick={handleCopyContent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-sm transition-colors duration-150"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {result.type === 'text' ? (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap break-words">{result.content}</p>
            </div>
          ) : (
            <img
              src={result.content}
              alt="Shared content"
              className="max-h-64 rounded-lg mx-auto object-contain"
            />
          )}

          <button
            onClick={handleReset}
            className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            Get another code
          </button>
        </div>
      )}
    </div>
  );
};
