# README.md

# JavaScript URL Extractor Chrome Extension

## Descrição
O JavaScript URL Extractor é uma extensão do Chrome que permite extrair URLs de arquivos JavaScript e JSON de páginas da web. Com uma interface simples e intuitiva, você pode exportar facilmente todos os URLs encontrados em uma página.

## Funcionalidades
- Extrai URLs de arquivos JavaScript e JSON de elementos `<script>` e `<link>` na página.
- Interface de popup com botões para iniciar a extração e exportar os URLs.
- Filtragem de URLs duplicados para garantir que cada URL seja listado apenas uma vez.

## Estrutura do Projeto
```
javascript-url-extractor
├── src
│   ├── background.js
│   ├── popup
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── content
│   │   └── content.js
│   └── utils
│       └── url-extractor.js
├── manifest.json
└── README.md
```

## Instalação
1. Clone este repositório em sua máquina local.
2. Abra o Chrome e vá para `chrome://extensions/`.
3. Ative o "Modo de desenvolvedor" no canto superior direito.
4. Clique em "Carregar sem compactação" e selecione a pasta do projeto.
5. A extensão estará disponível na barra de ferramentas do Chrome.

## Uso
1. Navegue até uma página da web que contenha arquivos JavaScript ou JSON.
2. Clique no ícone da extensão na barra de ferramentas do Chrome.
3. Use os botões no popup para extrair e exportar os URLs.

## Contribuição
Sinta-se à vontade para contribuir com melhorias ou correções. Abra um pull request ou crie uma issue para discutir mudanças.

## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.