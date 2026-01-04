import { useState, useRef } from 'react';
import { Copy, Upload, FileText, Image as ImageIcon, Check, Loader2, Share2 } from 'lucide-react';
import { saveText, uploadImage } from '@/services/api';
import { ToastData } from './Toast';
import { QuickRetrieve } from './QuickRetrieve';

type TabType = 'text' | 'image';

interface ShareSectionProps {
  onToast: (toast: Omit<ToastData, 'id'>) => void;
}

export const ShareSection = ({ onToast }: ShareSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [textContent, setTextContent] = useState('');
  const [imageContent, setImageContent] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubmitDisabled = activeTab === 'text' ? !textContent.trim() : !imageContent;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast({ type: 'error', message: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onToast({ type: 'error', message: 'Image must be less than 5MB' });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageContent(event.target?.result as string);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneratedCode(null);

    try {
      let code: string;

      if (activeTab === 'text') {
        code = await saveText(textContent);
      } else {
        if (!imageFile) {
          throw new Error('No image file selected');
        }
        const result = await uploadImage(imageFile);
        code = result.code;
      }

      setGeneratedCode(code);
      onToast({ type: 'success', message: 'Content shared successfully!' });
    } catch (error) {
      onToast({ type: 'error', message: 'Failed to share content. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      onToast({ type: 'success', message: 'Code copied to clipboard' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onToast({ type: 'error', message: 'Failed to copy code' });
    }
  };

  const handleReset = () => {
    setTextContent('');
    setImageContent(null);
    setImageName(null);
    setImageFile(null);
    setGeneratedCode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Share Content</h1>
          <p className="text-sm text-muted-foreground">Upload text or image to get a sharing code</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 bg-muted rounded-xl mb-6">
        <button
          onClick={() => {
            setActiveTab('text');
            setGeneratedCode(null);
          }}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            text-sm font-medium transition-all duration-200
            ${activeTab === 'text'
              ? 'bg-card text-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }
          `}
        >
          <FileText className="w-4 h-4" />
          Text
        </button>
        <button
          onClick={() => {
            setActiveTab('image');
            setGeneratedCode(null);
          }}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            text-sm font-medium transition-all duration-200
            ${activeTab === 'image'
              ? 'bg-card text-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }
          `}
        >
          <ImageIcon className="w-4 h-4" />
          Image
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-card rounded-xl border border-border p-5 mb-5 transition-all duration-200 hover:border-primary/20">
        {activeTab === 'text' ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste or type your text here..."
            className="w-full h-44 bg-transparent resize-none text-sm placeholder:text-muted-foreground focus:outline-none leading-relaxed"
          />
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            {imageContent ? (
              <div className="space-y-3">
                <img
                  src={imageContent}
                  alt="Preview"
                  className="max-h-52 rounded-lg mx-auto object-contain"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {imageName}
                  </span>
                  <button
                    onClick={() => {
                      setImageContent(null);
                      setImageName(null);
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-sm text-destructive hover:underline transition-colors duration-150"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all duration-200"
              >
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <span className="text-sm text-muted-foreground font-medium">
                  Click to upload an image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled || isLoading}
        className={`
          w-full py-3.5 px-4 rounded-xl font-medium text-sm
          flex items-center justify-center gap-2
          transition-all duration-200 transform
          ${isSubmitDisabled || isLoading
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating code...
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Generate Share Code
          </>
        )}
      </button>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="mt-5 p-6 bg-card rounded-xl border border-success/30 animate-scale-in">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Your sharing code
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-2">
              {generatedCode.split('').map((digit, i) => (
                <div
                  key={i}
                  className="w-14 h-16 flex items-center justify-center bg-muted rounded-xl text-2xl font-bold animate-scale-in"
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  {digit}
                </div>
              ))}
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-105"
              title="Copy code"
            >
              {isCopied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
          <button
            onClick={handleReset}
            className="w-full mt-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted"
          >
            Share something else
          </button>
        </div>
      )}

      {/* Quick Retrieve Section */}
      <QuickRetrieve onToast={onToast} />
    </div>
  );
};
