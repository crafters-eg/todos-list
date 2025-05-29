"use client"

import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onShare: () => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onShare, onClose }: ContextMenuProps) {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // Adjust position if menu would go off screen
    const menuWidth = 150;
    const menuHeight = 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }

    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
    }

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      onClose();
    };

    // Close menu when pressing escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleShare = () => {
    onShare();
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg py-1 min-w-[150px]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleShare}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </button>
    </div>
  );
}
