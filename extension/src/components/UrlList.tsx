import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { UrlItem } from './UrlItem';
import { UI_CONFIG, STORAGE_KEYS } from '../config';
import type { SavedUrl } from '../types';

interface UrlListProps {
  refreshTrigger: number;
}

export const UrlList: React.FC<UrlListProps> = ({ refreshTrigger }) => {
  const [urls, setUrls] = useState<SavedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastKey, setLastKey] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadUrls = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await apiClient.getUrls(
        UI_CONFIG.DEFAULT_PAGE_SIZE,
        isLoadMore ? lastKey : undefined
      );

      if (isLoadMore) {
        setUrls((prev) => [...prev, ...response.urls]);
      } else {
        setUrls(response.urls);
        // Cache the first page for quick display
        chrome.storage.local.set({
          [STORAGE_KEYS.CACHED_URLS]: response.urls,
          [STORAGE_KEYS.LAST_SYNC]: Date.now(),
        });
      }

      setHasMore(response.hasMore);
      setLastKey(response.lastKey);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load URLs';
      setError(errorMessage);
      console.error('Error loading URLs:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadCachedUrls = async () => {
    try {
      const result = await chrome.storage.local.get([
        STORAGE_KEYS.CACHED_URLS,
        STORAGE_KEYS.LAST_SYNC,
      ]);

      if (result[STORAGE_KEYS.CACHED_URLS]) {
        const lastSync = result[STORAGE_KEYS.LAST_SYNC] || 0;
        const now = Date.now();

        // Use cache if it's fresh (within cache duration)
        if (now - lastSync < UI_CONFIG.CACHE_DURATION_MS) {
          setUrls(result[STORAGE_KEYS.CACHED_URLS]);
          setIsLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Error loading cached URLs:', err);
    }
    return false;
  };

  useEffect(() => {
    const init = async () => {
      // Try to load from cache first
      const hasCached = await loadCachedUrls();

      // Load fresh data from API
      if (!hasCached) {
        await loadUrls();
      } else {
        // Load in background to refresh cache
        loadUrls();
      }
    };

    init();
  }, [refreshTrigger]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadUrls(true);
    }
  };

  if (isLoading && urls.length === 0) {
    return (
      <div className="url-list-container">
        <div className="loading-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-item">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-domain"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="url-list-container">
        <div className="empty-state">
          <svg
            className="empty-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="empty-text">{error}</p>
          <button className="retry-button" onClick={() => loadUrls()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="url-list-container">
        <div className="empty-state">
          <svg
            className="empty-icon"
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
          <p className="empty-text">No saved URLs yet</p>
          <p className="empty-subtext">
            Click "Save Current Page" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="url-list-container">
      <div className="url-list">
        {urls.map((url) => (
          <UrlItem key={url.id} url={url} />
        ))}
      </div>

      {hasMore && (
        <button
          className="load-more-button"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? (
            <>
              <span className="spinner small"></span>
              <span>Loading...</span>
            </>
          ) : (
            'Load More'
          )}
        </button>
      )}
    </div>
  );
};
