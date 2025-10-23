// IMPORTANT: Restore theme IMMEDIATELY before DOM is ready
(async () => {
    try {
        const result = await chrome.storage.local.get(['theme']);
        console.log('🔄 Pre-loading theme from storage:', result.theme);
        console.log('📦 Full storage result:', result);

        if (result.theme === 'dark') {
            console.log('✅ Applying dark theme immediately');
            document.documentElement.classList.add('dark-theme');
            document.body.classList.add('dark-theme');
        } else {
            console.log('ℹ️ Using light theme (default or stored)');
        }
    } catch (error) {
        console.error('❌ Failed to pre-load theme:', error);
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Popup initialized - v0.6.3');

    // DOM Elements
    const exportJsButton = document.getElementById('export-js');
    const exportJsonButton = document.getElementById('export-json');
    const copyButton = document.getElementById('copy-clipboard');
    const downloadButton = document.getElementById('download-txt');
    const resultContainer = document.getElementById('result-container');
    const output = document.getElementById('output');
    const exportAllButton = document.getElementById('export-all');
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-results');
    const exportJsonFormat = document.getElementById('export-json-format');
    const exportCsvFormat = document.getElementById('export-csv-format');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');

    let currentUrls = [];
    let allUrls = []; // Store all URLs before filtering
    let isExtracting = false; // Prevent multiple simultaneous extractions
    let currentFilter = 'all'; // Current active filter
    let lastExtractionType = null; // Remember last extraction type

    // Session persistence - restore saved data
    async function restoreSavedSession() {
        try {
            const result = await chrome.storage.local.get(['savedUrls', 'lastExtractionType', 'theme']);

            console.log('🔄 Restoring session, theme:', result.theme);

            // Restore URLs
            if (result.savedUrls && result.savedUrls.length > 0) {
                console.log('📦 Restoring saved session:', result.savedUrls.length, 'URLs');
                allUrls = result.savedUrls;
                currentUrls = result.savedUrls;
                lastExtractionType = result.lastExtractionType || null;
                updateUI(currentUrls);
                updateStats(currentUrls.length, 0, true);
            }

            // Update theme toggle button to match current theme
            const isDark = document.body.classList.contains('dark-theme');
            if (themeToggle) {
                themeToggle.textContent = isDark ? '☀️' : '🌙';
                console.log('🎨 Theme toggle updated:', isDark ? 'dark' : 'light');
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
        }
    }

    // Restore saved data on popup open
    await restoreSavedSession();

    // Save session data
    async function saveSession() {
        try {
            await chrome.storage.local.set({
                savedUrls: allUrls,
                lastExtractionType: lastExtractionType,
                timestamp: Date.now()
            });
            console.log('💾 Session saved');
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    }

    // Show loading state on button
    const setButtonLoading = (button, loading) => {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.dataset.originalText = button.querySelector('.text').textContent;
            button.querySelector('.text').textContent = 'Extracting...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (button.dataset.originalText) {
                button.querySelector('.text').textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }
        }
    };

    // Show error message to user
    const showError = (message, title = 'Error') => {
        if (!output) return;

        output.innerHTML = `
            <div class="error-message" style="
                padding: 16px;
                background: #fee2e2;
                border: 2px solid #fca5a5;
                border-radius: 12px;
                color: #991b1b;
                text-align: center;
            ">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <strong style="font-size: 14px; display: block; margin-bottom: 8px;">${title}</strong>
                <div style="font-size: 13px; line-height: 1.5;">${message}</div>
            </div>
        `;
        resultContainer.style.display = 'block';
    };

    // Function to extract URLs with improved error handling
    const extractUrls = async (action, button) => {
        // Prevent multiple simultaneous extractions
        if (isExtracting) {
            console.log('⏳ Extraction already in progress');
            return;
        }

        isExtracting = true;
        const startTime = performance.now();
        setButtonLoading(button, true);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                throw new Error('No active tab found');
            }

            // Check for restricted pages
            if (!tab.url) {
                throw new Error('NO_URL');
            }

            if (tab.url.startsWith('chrome://')) {
                throw new Error('CHROME_PAGE');
            }

            if (tab.url.startsWith('chrome-extension://')) {
                throw new Error('EXTENSION_PAGE');
            }

            if (tab.url.startsWith('edge://')) {
                throw new Error('EDGE_PAGE');
            }

            if (tab.url.startsWith('about:')) {
                throw new Error('ABOUT_PAGE');
            }

            console.log('📤 Sending message to tab:', tab.id);

            // Inject content script first
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['src/content/content.js']
                });
            } catch (scriptError) {
                console.warn('⚠️ Script injection failed, may already be injected:', scriptError);
            }

            // Small delay to ensure script is ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Now send the message with timeout
            const response = await Promise.race([
                chrome.tabs.sendMessage(tab.id, { action }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Extraction timeout after 10s')), 10000)
                )
            ]);

            console.log('📥 Response received:', response);

            const endTime = performance.now();
            const timeMs = Math.round(endTime - startTime);

            if (response?.error) {
                throw new Error(response.error);
            }

            if (response?.urls && Array.isArray(response.urls)) {
                allUrls = response.urls;
                currentUrls = response.urls;
                lastExtractionType = action;
                updateStats(response.urls.length, timeMs);
                updateUI(response.urls);
                await saveSession(); // Save after successful extraction
            } else {
                updateStats(0, timeMs);
                updateUI([]);
            }
        } catch (error) {
            console.error('❌ Error:', error);
            updateStats(0, 0);

            // Handle specific error types with friendly messages
            let errorTitle = 'Extraction Failed';
            let errorMessage = '';

            switch (error.message) {
                case 'CHROME_PAGE':
                    errorTitle = 'Chrome Internal Page';
                    errorMessage = 'Cannot extract URLs from Chrome internal pages like <code>chrome://</code>.<br><br>Please navigate to a regular website (e.g., https://google.com) and try again.';
                    break;
                case 'EXTENSION_PAGE':
                    errorTitle = 'Extension Page';
                    errorMessage = 'Cannot extract URLs from extension pages.<br><br>Please navigate to a regular website and try again.';
                    break;
                case 'EDGE_PAGE':
                    errorTitle = 'Edge Internal Page';
                    errorMessage = 'Cannot extract URLs from Edge internal pages like <code>edge://</code>.<br><br>Please navigate to a regular website and try again.';
                    break;
                case 'ABOUT_PAGE':
                    errorTitle = 'About Page';
                    errorMessage = 'Cannot extract URLs from <code>about:</code> pages.<br><br>Please navigate to a regular website and try again.';
                    break;
                case 'NO_URL':
                    errorTitle = 'No Page Loaded';
                    errorMessage = 'No webpage is currently loaded.<br><br>Please navigate to a website first.';
                    break;
                case 'Extraction timeout after 10s':
                    errorTitle = 'Timeout';
                    errorMessage = 'The extraction took too long (>10s).<br><br>The page might be too large or unresponsive. Try refreshing the page.';
                    break;
                default:
                    errorMessage = error.message || 'An unexpected error occurred. Please try again.';
            }

            showError(errorMessage, errorTitle);
        } finally {
            isExtracting = false;
            setButtonLoading(button, false);
        }
    };

    // Function to update UI
    const updateUI = (urls) => {
        currentUrls = urls;
        if (!resultContainer || !output) return;

        if (urls && urls.length > 0) {
            output.innerHTML = urls.map(url => `
                <div class="url-item" title="Click to copy" data-url="${url}">
                    ${url}
                </div>
            `).join('');
            
            // Add click handlers for each URL item
            document.querySelectorAll('.url-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const url = item.dataset.url;
                    
                    try {
                        item.classList.add('copying');
                        await navigator.clipboard.writeText(url);
                        
                        item.classList.remove('copying');
                        item.classList.add('copied');
                        
                        // Reset state after animation
                        setTimeout(() => {
                            item.classList.remove('copied');
                        }, 2000);
                        
                    } catch (error) {
                        console.error('❌ Copy failed:', error);
                        item.classList.remove('copying');
                    }
                });
            });
            
            resultContainer.style.display = 'block';
        } else {
            output.innerHTML = '<div class="empty-state">No URLs found</div>';
            resultContainer.style.display = 'block';
        }
    };

    // Event Listeners with button reference
    exportJsButton?.addEventListener('click', () => extractUrls('getJavaScriptUrls', exportJsButton));
    exportJsonButton?.addEventListener('click', () => extractUrls('getJsonUrls', exportJsonButton));
    exportAllButton?.addEventListener('click', () => extractUrls('getAllUrls', exportAllButton));

    copyButton?.addEventListener('click', async () => {
        if (currentUrls.length === 0) {
            showError('No URLs to copy. Please extract URLs first.');
            return;
        }

        try {
            await navigator.clipboard.writeText(currentUrls.join('\n'));

            // Visual feedback
            const originalText = copyButton.querySelector('.text').textContent;
            copyButton.querySelector('.text').textContent = 'Copied!';
            copyButton.classList.add('success');

            setTimeout(() => {
                copyButton.querySelector('.text').textContent = originalText;
                copyButton.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('Error copying:', err);
            showError('Failed to copy URLs to clipboard');
        }
    });

    downloadButton?.addEventListener('click', () => {
        if (currentUrls.length === 0) {
            showError('No URLs to download. Please extract URLs first.');
            return;
        }

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const blob = new Blob([currentUrls.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `urls-extracted-${timestamp}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Visual feedback
            const originalText = downloadButton.querySelector('.text').textContent;
            downloadButton.querySelector('.text').textContent = 'Downloaded!';

            setTimeout(() => {
                downloadButton.querySelector('.text').textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Error downloading:', err);
            showError('Failed to download URLs');
        }
    });

    // Search/Filter functionality
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (!searchTerm) {
            currentUrls = allUrls;
        } else {
            currentUrls = allUrls.filter(url =>
                url.toLowerCase().includes(searchTerm)
            );
        }

        updateUI(currentUrls);
        updateStats(currentUrls.length, 0, true);
    });

    // Clear search on Escape key
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            currentUrls = allUrls;
            updateUI(currentUrls);
            updateStats(currentUrls.length, 0, true);
        }
    });

    // Clear results button
    clearButton?.addEventListener('click', async () => {
        if (confirm('Clear all extracted URLs? This cannot be undone.')) {
            allUrls = [];
            currentUrls = [];
            lastExtractionType = null;
            await chrome.storage.local.remove(['savedUrls', 'lastExtractionType']);
            updateUI([]);
            updateStats(0, 0);
            if (searchInput) searchInput.value = '';
        }
    });

    // URL Type Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.dataset.filter;
            currentFilter = filterType;

            if (filterType === 'all') {
                currentUrls = allUrls;
            } else {
                currentUrls = filterUrlsByType(allUrls, filterType);
            }

            updateUI(currentUrls);
            updateStats(currentUrls.length, 0, true);
        });
    });

    // Filter URLs by type
    function filterUrlsByType(urls, type) {
        switch (type) {
            case 'images':
                return urls.filter(url => /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|$)/i.test(url));
            case 'scripts':
                return urls.filter(url => /\.(js|jsx|mjs|cjs)(\?|$)/i.test(url));
            case 'styles':
                return urls.filter(url => /\.(css|scss|sass|less)(\?|$)/i.test(url));
            case 'media':
                return urls.filter(url => /\.(mp4|webm|ogg|mp3|wav|flac|avi|mov)(\?|$)/i.test(url));
            case 'documents':
                return urls.filter(url => /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)(\?|$)/i.test(url));
            case 'api':
                return urls.filter(url => /\.(json|jsonp|xml|api)(\?|$)|\/api\//i.test(url));
            default:
                return urls;
        }
    }

    // Export as JSON
    exportJsonFormat?.addEventListener('click', () => {
        if (currentUrls.length === 0) {
            showError('No URLs to export. Please extract URLs first.');
            return;
        }

        const data = {
            extractedAt: new Date().toISOString(),
            totalUrls: currentUrls.length,
            extractionType: lastExtractionType,
            urls: currentUrls.map((url, index) => ({
                id: index + 1,
                url: url,
                type: detectUrlType(url)
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(blob, 'urls-export.json', exportJsonFormat);
    });

    // Export as CSV
    exportCsvFormat?.addEventListener('click', () => {
        if (currentUrls.length === 0) {
            showError('No URLs to export. Please extract URLs first.');
            return;
        }

        let csv = 'ID,URL,Type,Domain,Extension\n';
        currentUrls.forEach((url, index) => {
            const type = detectUrlType(url);
            const domain = extractDomain(url);
            const extension = extractExtension(url);
            csv += `${index + 1},"${url}","${type}","${domain}","${extension}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, 'urls-export.csv', exportCsvFormat);
    });

    // Helper function to download files
    function downloadFile(blob, filename, button) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        a.href = url;
        a.download = filename.replace('.', `-${timestamp}.`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Visual feedback
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✓ Exported!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    }

    // Detect URL type
    function detectUrlType(url) {
        if (/\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|$)/i.test(url)) return 'image';
        if (/\.(js|jsx|mjs|cjs)(\?|$)/i.test(url)) return 'script';
        if (/\.(css|scss|sass|less)(\?|$)/i.test(url)) return 'style';
        if (/\.(mp4|webm|ogg|mp3|wav|flac)(\?|$)/i.test(url)) return 'media';
        if (/\.(pdf|doc|docx|xls|xlsx)(\?|$)/i.test(url)) return 'document';
        if (/\.(json|jsonp|xml)(\?|$)|\/api\//i.test(url)) return 'api';
        if (/\.(woff|woff2|ttf|eot|otf)(\?|$)/i.test(url)) return 'font';
        return 'other';
    }

    // Extract domain from URL
    function extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return 'unknown';
        }
    }

    // Extract file extension
    function extractExtension(url) {
        try {
            const pathname = new URL(url).pathname;
            const match = pathname.match(/\.([^./?]+)(\?|$)/);
            return match ? match[1] : 'none';
        } catch {
            return 'none';
        }
    }

    // Dark mode toggle
    themeToggle?.addEventListener('click', async () => {
        document.body.classList.toggle('dark-theme');
        document.documentElement.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';

        // Save theme preference
        try {
            const themeToSave = isDark ? 'dark' : 'light';
            await chrome.storage.local.set({ theme: themeToSave });
            console.log('💾 Theme saved to storage:', themeToSave);

            // Verify it was saved
            const verify = await chrome.storage.local.get(['theme']);
            console.log('✅ Verification - theme in storage:', verify.theme);
        } catch (error) {
            console.error('❌ Failed to save theme:', error);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', async (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }

        // Ctrl/Cmd + C: Copy URLs
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement !== searchInput) {
            if (currentUrls.length > 0) {
                e.preventDefault();
                copyButton?.click();
            }
        }

        // Ctrl/Cmd + S: Download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            if (currentUrls.length > 0) {
                e.preventDefault();
                downloadButton?.click();
            }
        }

        // Ctrl/Cmd + D: Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            themeToggle?.click();
        }
    });

    // Add event to open external links
    document.querySelectorAll('.author a, .bug').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.href || e.target.closest('a').href;
            chrome.tabs.create({ url: url });
        });
    });
});

// Update stats function with optional "restored" parameter
function updateStats(itemCount, timeMs, isRestored = false) {
    const totalItems = document.getElementById('total-items');
    const extractionTime = document.getElementById('extraction-time');

    if (totalItems && extractionTime) {
        totalItems.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

        if (isRestored) {
            extractionTime.textContent = 'restored';
            extractionTime.style.fontStyle = 'italic';
        } else {
            extractionTime.textContent = `${timeMs}ms`;
            extractionTime.style.fontStyle = 'normal';
        }

        // Add animation class
        totalItems.classList.add('highlight');
        extractionTime.classList.add('highlight');

        // Remove animation class after transition
        setTimeout(() => {
            totalItems.classList.remove('highlight');
            extractionTime.classList.remove('highlight');
        }, 1000);
    }
}

