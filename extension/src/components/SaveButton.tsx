import React, { useState } from 'react';
import { apiClient } from '../api/client';

interface SaveButtonProps {
  onSave: () => void;
  onError: (error: string) => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave, onError }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.url || !tab.title) {
        throw new Error('Could not get current tab information');
      }

      // Check if URL is valid (not chrome:// or edge:// etc.)
      if (
        tab.url.startsWith('chrome://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')
      ) {
        throw new Error('Cannot save browser internal pages');
      }

      // Get favicon URL
      const faviconUrl = tab.favIconUrl;

      // Save URL to backend
      await apiClient.saveUrl(tab.url, tab.title, faviconUrl);

      // Notify background script of success
      chrome.runtime.sendMessage({ action: 'urlSaved' });

      // Notify parent component
      onSave();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save URL';
      onError(errorMessage);

      // Notify background script of failure
      chrome.runtime.sendMessage({ action: 'urlSaveFailed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      className="save-button"
      onClick={handleSave}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <span className="spinner"></span>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <svg
            className="save-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>Save Current Page</span>
        </>
      )}
    </button>
  );
};
