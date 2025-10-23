// Content script initialization
console.log('🔧 Debug - Window location:', window.location.href);
console.log('🔧 Debug - Document ready state:', document.readyState);
console.log('🚀 Content script loaded');

// Optimized URL normalization function
function normalizeUrl(value, baseUrl) {
    if (!value || typeof value !== 'string') return null;

    try {
        // Handle absolute URLs
        if (value.startsWith('http://') || value.startsWith('https://')) {
            return new URL(value).href;
        }
        // Handle protocol-relative URLs
        if (value.startsWith('//')) {
            return new URL(window.location.protocol + value).href;
        }
        // Handle absolute paths
        if (value.startsWith('/')) {
            return new URL(value, window.location.origin).href;
        }
        // Handle relative paths
        return new URL(value, baseUrl || window.location.href).href;
    } catch (e) {
        return null;
    }
}

// Optimized JavaScript URL extraction with better performance
function getAllJavaScriptUrls() {
    console.log('🔍 Searching for JavaScript URLs...');
    const urls = new Set();
    const jsExtensions = ['.js', '.jsx', '.mjs', '.cjs'];

    // Primary source: script tags with src attribute (most common)
    document.querySelectorAll('script[src]').forEach(script => {
        const normalized = normalizeUrl(script.src, window.location.href);
        if (normalized) urls.add(normalized);
    });

    // Secondary: link tags with JavaScript type or .js extension
    document.querySelectorAll('link[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && jsExtensions.some(ext => href.includes(ext))) {
            const normalized = normalizeUrl(href, window.location.href);
            if (normalized) urls.add(normalized);
        }
    });

    // Tertiary: check specific attributes that might contain JS files
    const jsSelectors = [
        'img[src*=".js"]',
        'iframe[src*=".js"]',
        'embed[src*=".js"]',
        '[data-src*=".js"]',
        '[data-script*=".js"]'
    ];

    jsSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            const attrs = ['src', 'data-src', 'data-script'];
            attrs.forEach(attr => {
                const value = element.getAttribute(attr);
                if (value && jsExtensions.some(ext => value.includes(ext))) {
                    const normalized = normalizeUrl(value, window.location.href);
                    if (normalized) urls.add(normalized);
                }
            });
        });
    });

    // Search in inline script content for dynamically loaded scripts
    document.querySelectorAll('script:not([src])').forEach(script => {
        const content = script.textContent || '';
        // Match common script loading patterns
        const patterns = [
            /(?:src|url|script)\s*[:=]\s*["']([^"']+\.(?:js|jsx|mjs|cjs)[^"']*)["']/gi,
            /import\s*\(\s*["']([^"']+\.(?:js|jsx|mjs|cjs)[^"']*)["']/gi
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const normalized = normalizeUrl(match[1], window.location.href);
                if (normalized) urls.add(normalized);
            }
        });
    });

    console.log('✅ JavaScript URLs found:', urls.size);
    return Array.from(urls).sort();
}

// Optimized JSON URL extraction with better performance
function getAllJsonUrls() {
    console.log('🔍 Searching for JSON URLs...');
    const urls = new Set();
    const jsonExtensions = ['.json', '.jsonp', '.geojson'];

    // Primary: Direct JSON file links
    const jsonSelectors = [
        'a[href*=".json"]',
        'link[href*=".json"]',
        'script[src*=".json"]',
        '[data-src*=".json"]',
        '[data-json*=".json"]',
        'iframe[src*=".json"]'
    ];

    jsonSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            const attrs = ['href', 'src', 'data-src', 'data-json'];
            attrs.forEach(attr => {
                const value = element.getAttribute(attr);
                if (value && jsonExtensions.some(ext => value.includes(ext))) {
                    const normalized = normalizeUrl(value, window.location.href);
                    if (normalized) urls.add(normalized);
                }
            });
        });
    });

    // Secondary: Search in script content for JSON API endpoints
    document.querySelectorAll('script:not([src])').forEach(script => {
        const content = script.textContent || '';
        // Match common JSON loading patterns
        const patterns = [
            /(?:fetch|ajax|get|load)\s*\(\s*["']([^"']+\.json[^"']*)["']/gi,
            /url\s*[:=]\s*["']([^"']+\.json[^"']*)["']/gi,
            /["']([^"']*\.json(?:p)?(?:\?[^"']*)?)["']/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const normalized = normalizeUrl(match[1], window.location.href);
                if (normalized) urls.add(normalized);
            }
        });
    });

    // Tertiary: Check for data attributes that might contain JSON
    document.querySelectorAll('[data-json], [data-config], [data-api]').forEach(element => {
        ['data-json', 'data-config', 'data-api'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value) {
                try {
                    // Try parsing as JSON to find URLs within
                    const parsed = JSON.parse(value);
                    const findUrls = (obj) => {
                        if (typeof obj === 'string' && jsonExtensions.some(ext => obj.includes(ext))) {
                            const normalized = normalizeUrl(obj, window.location.href);
                            if (normalized) urls.add(normalized);
                        } else if (typeof obj === 'object' && obj !== null) {
                            Object.values(obj).forEach(findUrls);
                        }
                    };
                    findUrls(parsed);
                } catch (e) {
                    // If not valid JSON, check if it's a direct URL
                    if (jsonExtensions.some(ext => value.includes(ext))) {
                        const normalized = normalizeUrl(value, window.location.href);
                        if (normalized) urls.add(normalized);
                    }
                }
            }
        });
    });

    console.log('✅ JSON URLs found:', urls.size);
    return Array.from(urls).sort();
}

// Optimized all URLs extraction with better performance and filtering
function getAllUrls() {
    console.log('🔍 Searching for all URLs...');
    const urls = new Set();

    // Optimized: Use specific selectors instead of querySelectorAll('*')
    const urlSelectors = [
        'a[href]',
        'link[href]',
        'script[src]',
        'img[src]',
        'iframe[src]',
        'embed[src]',
        'source[src]',
        'video[src]',
        'audio[src]',
        'object[data]',
        'form[action]',
        '[data-src]',
        '[data-url]',
        '[data-href]'
    ];

    // Collect URLs from specific attributes
    const attributeMap = {
        'a': ['href'],
        'link': ['href'],
        'script': ['src'],
        'img': ['src', 'data-src'],
        'iframe': ['src', 'data-src'],
        'embed': ['src'],
        'source': ['src', 'srcset'],
        'video': ['src', 'poster'],
        'audio': ['src'],
        'object': ['data'],
        'form': ['action']
    };

    urlSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            const tagName = element.tagName.toLowerCase();
            const attrs = attributeMap[tagName] || ['href', 'src', 'data-src', 'data-url', 'data-href'];

            attrs.forEach(attr => {
                const value = element.getAttribute(attr);
                if (value) {
                    // Handle srcset specially (multiple URLs)
                    if (attr === 'srcset') {
                        value.split(',').forEach(srcsetEntry => {
                            const url = srcsetEntry.trim().split(/\s+/)[0];
                            const normalized = normalizeUrl(url, window.location.href);
                            if (normalized && isValidUrl(normalized)) {
                                urls.add(normalized);
                            }
                        });
                    } else {
                        const normalized = normalizeUrl(value, window.location.href);
                        if (normalized && isValidUrl(normalized)) {
                            urls.add(normalized);
                        }
                    }
                }
            });
        });
    });

    // Extract URLs from inline styles (background-image, etc.)
    document.querySelectorAll('[style*="url("]').forEach(element => {
        const style = element.getAttribute('style');
        const urlMatches = style.match(/url\(['"]?([^'"()]+)['"]?\)/gi);
        if (urlMatches) {
            urlMatches.forEach(match => {
                const url = match.replace(/url\(['"]?|['"]?\)/g, '');
                const normalized = normalizeUrl(url, window.location.href);
                if (normalized && isValidUrl(normalized)) {
                    urls.add(normalized);
                }
            });
        }
    });

    // Extract URLs from CSS stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            if (sheet.href) {
                const normalized = normalizeUrl(sheet.href, window.location.href);
                if (normalized && isValidUrl(normalized)) {
                    urls.add(normalized);
                }
            }
        } catch (e) {
            // Cross-origin stylesheet, skip
        }
    });

    console.log('✅ URLs found:', urls.size);
    return Array.from(urls).sort();
}

// Helper function to validate URLs (filter out invalid/unwanted URLs)
function isValidUrl(url) {
    if (!url) return false;

    // Filter out data URLs, javascript:, mailto:, tel:, etc.
    const invalidProtocols = ['data:', 'javascript:', 'mailto:', 'tel:', 'about:', 'blob:'];
    if (invalidProtocols.some(protocol => url.toLowerCase().startsWith(protocol))) {
        return false;
    }

    // Filter out very short URLs that are likely invalid
    if (url.length < 10) return false;

    // Must start with http://, https://, or //
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request);
    
    try {
        if (request.action === "getJavaScriptUrls") {
            sendResponse({urls: getAllJavaScriptUrls()});
        }
        else if (request.action === "getJsonUrls") {
            sendResponse({urls: getAllJsonUrls()});
        }
        else if (request.action === "getAllUrls") {
            sendResponse({urls: getAllUrls()});
        }
    } catch (error) {
        console.error('❌ Error:', error);
        sendResponse({error: error.message});
    }
    
    return true;
});

console.log('✅ Content script initialized and ready');