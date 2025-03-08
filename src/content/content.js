// Content script initialization
console.log('🔧 Debug - Window location:', window.location.href);
console.log('🔧 Debug - Document ready state:', document.readyState);
console.log('🚀 Content script loaded');

function getAllJavaScriptUrls() {
    console.log('🔍 Searching for JavaScript URLs...');
    const urls = new Set();
    
    // Search in script tags
    document.querySelectorAll('script[src]').forEach(script => {
        if (script.src) urls.add(script.src);
    });
    
    // Search in link tags
    document.querySelectorAll('link[href]').forEach(link => {
        if (link.href?.endsWith('.js')) urls.add(link.href);
    });
    
    // Search in other attributes (improved)
    document.querySelectorAll('*').forEach(element => {
        ['src', 'href', 'data-src'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value && typeof value === 'string' && value.includes('.js')) {
                try {
                    const url = new URL(value, window.location.href);
                    urls.add(url.href);
                } catch (e) {
                    if (value.startsWith('/')) {
                        urls.add(window.location.origin + value);
                    }
                }
            }
        });
    });

    console.log('✅ JavaScript URLs found:', urls.size);
    return Array.from(urls);
}

function getAllJsonUrls() {
    console.log('🔍 Searching for JSON URLs...');
    const urls = new Set();
    
    // Search in links and other elements
    document.querySelectorAll('*').forEach(element => {
        ['src', 'href', 'data-src'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value && typeof value === 'string' && value.includes('.json')) {
                try {
                    const url = new URL(value, window.location.href);
                    urls.add(url.href);
                } catch (e) {
                    if (value.startsWith('/')) {
                        urls.add(window.location.origin + value);
                    }
                }
            }
        });
    });

    console.log('✅ JSON URLs found:', urls.size);
    return Array.from(urls);
}

function getAllUrls() {
    console.log('🔍 Searching for all URLs...');
    const urls = new Set();
    
    // Search in all elements with href or src
    document.querySelectorAll('*').forEach(element => {
        ['src', 'href', 'data-src'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value && typeof value === 'string') {
                try {
                    const url = new URL(value, window.location.href);
                    urls.add(url.href);
                } catch (e) {
                    if (value.startsWith('/')) {
                        urls.add(window.location.origin + value);
                    }
                }
            }
        });
    });

    console.log('✅ URLs found:', urls.size);
    return Array.from(urls);
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