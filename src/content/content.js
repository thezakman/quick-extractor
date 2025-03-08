// No início do content.js
console.log('🔧 Debug - Window location:', window.location.href);
console.log('🔧 Debug - Document ready state:', document.readyState);
console.log('🚀 Content script carregado');

function getAllJavaScriptUrls() {
    console.log('🔍 Buscando URLs JavaScript...');
    const urls = new Set();
    
    // Busca em tags script
    document.querySelectorAll('script[src]').forEach(script => {
        if (script.src) urls.add(script.src);
    });
    
    // Busca em links
    document.querySelectorAll('link[href]').forEach(link => {
        if (link.href?.endsWith('.js')) urls.add(link.href);
    });
    
    // Busca em outros atributos (melhorado)
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

    console.log('✅ URLs JavaScript encontradas:', urls.size);
    return Array.from(urls);
}

function getAllJsonUrls() {
    console.log('🔍 Buscando URLs JSON...');
    const urls = new Set();
    
    // Busca em links e outros elementos
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

    console.log('✅ URLs JSON encontradas:', urls.size);
    return Array.from(urls);
}

function getAllUrls() {
    console.log('🔍 Buscando todas as URLs...');
    const urls = new Set();
    
    // Busca em todos os elementos com href ou src
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

    console.log('✅ URLs encontradas:', urls.size);
    return Array.from(urls);
}

// Listener para mensagens (corrigido)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Mensagem recebida:', request);
    
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
        console.error('❌ Erro:', error);
        sendResponse({error: error.message});
    }
    
    return true;
});

console.log('✅ Content script inicializado e pronto');