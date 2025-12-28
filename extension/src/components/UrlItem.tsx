import React from 'react';
import type { SavedUrl } from '../types';

interface UrlItemProps {
  url: SavedUrl;
}

export const UrlItem: React.FC<UrlItemProps> = ({ url }) => {
  const handleClick = () => {
    // Open URL in new tab
    chrome.tabs.create({ url: url.url });
  };

  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days === 1) {
      return 'yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else {
      const months = Math.floor(days / 30);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
  };

  const getDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return urlString;
    }
  };

  return (
    <div className="url-item" onClick={handleClick}>
      <div className="url-item-header">
        {url.faviconUrl && (
          <img
            src={url.faviconUrl}
            alt=""
            className="url-favicon"
            onError={(e) => {
              // Hide favicon if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="url-item-content">
          <h3 className="url-title">{url.title}</h3>
          <p className="url-domain">{getDomain(url.url)}</p>
        </div>
      </div>
      <p className="url-timestamp">{getRelativeTime(url.savedAt)}</p>
    </div>
  );
};
