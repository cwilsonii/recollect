/**
 * Background Service Worker for Recollect Extension
 *
 * Handles:
 * - Extension icon badge updates
 * - Background tasks and notifications
 * - Message passing between components
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Recollect extension installed');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'urlSaved') {
    // Show success badge on extension icon
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#22c55e' }); // green

    // Clear badge after 2 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 2000);

    sendResponse({ success: true });
  } else if (request.action === 'urlSaveFailed') {
    // Show error badge on extension icon
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // red

    // Clear badge after 3 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 3000);

    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});

// Log errors
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
});

export {};
