// Este arquivo contém o script de fundo para a extensão Chrome. 
// Ele gerencia eventos e lida com a comunicação entre o popup e os scripts de conteúdo.

chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Extensão instalada e pronta!');
});

// Gerencia as mensagens entre popup e content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Mensagem recebida no background:', request);

    if (request.action === 'getJavaScriptUrls' || request.action === 'getJsonUrls') {
        console.log('🔍 Procurando URLs na aba atual...');
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) {
                console.error('❌ Nenhuma aba ativa encontrada');
                sendResponse({ error: 'Nenhuma aba ativa' });
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
                console.log('✅ URLs encontradas:', response);
                sendResponse(response);
            });
        });
        
        return true; // Mantém a conexão aberta para resposta assíncrona
    }
});

// Adiciona listener para mudanças de aba
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('🔄 Mudança de aba detectada:', activeInfo.tabId);
});