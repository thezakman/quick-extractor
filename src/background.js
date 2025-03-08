// This file contains the background script for the Chrome extension.
// It manages events and handles communication between popup and content scripts.

chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Extension installed and ready!');
});

// Manages messages between popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received in background:', request);

    if (request.action === 'getJavaScriptUrls' || request.action === 'getJsonUrls') {
        console.log('🔍 Searching URLs in current tab...');
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) {
                console.error('❌ No active tab found');
                sendResponse({ error: 'No active tab' });
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
                console.log('✅ URLs found:', response);
                sendResponse(response);
            });
        });
        
        return true; // Keeps connection open for async response
    }
});

// Add listener for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('🔄 Tab change detected:', activeInfo.tabId);
});