document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Popup inicializado');

    // Elementos DOM
    const exportJsButton = document.getElementById('export-js');
    const exportJsonButton = document.getElementById('export-json');
    const copyButton = document.getElementById('copy-clipboard');
    const downloadButton = document.getElementById('download-txt');
    const resultContainer = document.getElementById('result-container');
    const output = document.getElementById('output');
    const exportAllButton = document.getElementById('export-all');

    let currentUrls = [];

    // Verifica se os elementos foram encontrados
    console.log('🔍 Elementos encontrados:', {
        exportJsButton: !!exportJsButton,
        exportJsonButton: !!exportJsonButton,
        copyButton: !!copyButton,
        downloadButton: !!downloadButton,
        resultContainer: !!resultContainer,
        output: !!output,
        exportAllButton: !!exportAllButton
    });

    // Função para extrair URLs
    const extractUrls = async (action) => {
        const startTime = performance.now();
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('Nenhuma aba ativa encontrada');
            }

            console.log('📤 Enviando mensagem para tab:', tab.id);
            
            // Injeta o content script primeiro
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['src/content/content.js']
            });

            // Agora envia a mensagem
            const response = await chrome.tabs.sendMessage(tab.id, { action });
            console.log('📥 Resposta recebida:', response);
            
            const endTime = performance.now();
            const timeMs = Math.round(endTime - startTime);
            
            if (response?.urls) {
                updateStats(response.urls.length, timeMs);
                updateUI(response.urls);
            } else {
                updateStats(0, timeMs);
                updateUI([]);
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            updateStats(0, 0);
            updateUI([]);
        }
    };

    // Função para atualizar UI
    const updateUI = (urls) => {
        currentUrls = urls;
        if (!resultContainer || !output) return;

        if (urls && urls.length > 0) {
            output.innerHTML = urls.map(url => `<div class="url-item">${url}</div>`).join('');
            resultContainer.style.display = 'block';
        } else {
            output.innerHTML = '<div class="url-item">Nenhuma URL encontrada</div>';
            resultContainer.style.display = 'block';
        }
    };

    // Event Listeners
    exportJsButton?.addEventListener('click', () => extractUrls('getJavaScriptUrls'));
    exportJsonButton?.addEventListener('click', () => extractUrls('getJsonUrls'));
    exportAllButton?.addEventListener('click', () => extractUrls('getAllUrls'));

    copyButton?.addEventListener('click', () => {
        if (currentUrls.length > 0) {
            navigator.clipboard.writeText(currentUrls.join('\n'))
                .then(() => alert('URLs copiadas!'))
                .catch(err => console.error('Erro ao copiar:', err));
        }
    });

    downloadButton?.addEventListener('click', () => {
        if (currentUrls.length > 0) {
            const blob = new Blob([currentUrls.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'urls-extracted.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Adiciona evento para abrir links externos
    document.querySelector('.author a').addEventListener('click', (e) => {
        e.preventDefault();
        const url = e.target.href;
        chrome.tabs.create({ url: url });
    });
});

function updateStats(itemCount, timeMs) {
    const totalItems = document.getElementById('total-items');
    const extractionTime = document.getElementById('extraction-time');
    
    totalItems.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
    extractionTime.textContent = `${timeMs}ms`;
}

// Exemplo de uso na função de extração:
async function extractUrls() {
    const startTime = performance.now();
    
    // ... código de extração ...
    
    const endTime = performance.now();
    const timeMs = Math.round(endTime - startTime);
    
    updateStats(urls.length, timeMs);
}