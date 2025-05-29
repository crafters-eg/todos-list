"use client"

import React, { useState } from 'react';
import { Copy, Check, Share2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateShareLink } from '@/lib/todoService';
import { toast } from '@/components/ui/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  todoId: string;
  todoTitle: string;
}

export default function ShareModal({ isOpen, onClose, todoId, todoTitle }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateLink = async () => {
    if (shareUrl) return; // Already generated

    setIsGenerating(true);
    try {
      const url = await generateShareLink(todoId);
      setShareUrl(url);
      toast({
        title: "Share link generated",
        description: "Your todo is ready to share!",
      });
    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setShareUrl('');
    setIsCopied(false);
    onClose();
  };

  // Generate link when modal opens
  React.useEffect(() => {
    if (isOpen && !shareUrl && !isGenerating) {
      handleGenerateLink();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Todo
          </DialogTitle>
          <DialogDescription>
            Share "{todoTitle}" with others. Anyone with this link can add this todo to their list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                Generating share link...
              </span>
            </div>
          ) : shareUrl ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 dark:text-neutral-400 space-y-1">
                <p>• This link will expire in 7 days</p>
                <p>• Anyone with this link can import this todo to their list</p>
                <p>• You can track who has used this link</p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
