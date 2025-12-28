import React, { useState } from 'react';
import { SaveButton } from '../components/SaveButton';
import { UrlList } from '../components/UrlList';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiClient } from '../api/client';

export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSaveSuccess = () => {
    setSuccessMessage('Page saved successfully!');
    setError(null);
    setRefreshTrigger((prev) => prev + 1); // Trigger URL list refresh

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSaveError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccessMessage(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleDismissSuccess = () => {
    setSuccessMessage(null);
  };

  const isConfigured = apiClient.isConfigured();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <svg
            className="logo"
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
          <h1 className="app-title">Recollect</h1>
        </div>
      </header>

      <main className="app-main">
        {!isConfigured && (
          <div className="config-warning">
            <svg
              className="warning-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="warning-content">
              <p className="warning-title">Configuration Required</p>
              <p className="warning-text">
                Please update <code>API_URL</code> and <code>API_KEY</code> in{' '}
                <code>src/config/index.ts</code>
              </p>
              <p className="warning-subtext">
                See README.md for deployment instructions
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <div className="success-content">
              <svg
                className="success-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="success-text">{successMessage}</span>
            </div>
            <button className="success-dismiss" onClick={handleDismissSuccess}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {error && <ErrorMessage message={error} onDismiss={handleDismissError} />}

        <div className="save-section">
          <SaveButton onSave={handleSaveSuccess} onError={handleSaveError} />
        </div>

        <div className="divider"></div>

        <div className="url-section">
          <h2 className="section-title">Recently Saved</h2>
          <UrlList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
};
