# Quick Extractor

A powerful Chrome extension to extract URLs, JavaScript files and JSON data from web pages.

## ✨ Features

- 🌐 **URL Extraction**: Captures all URLs from the current page
- 📜 **JavaScript**: Extracts URLs from .js files and inline scripts
- 🗃️ **JSON**: Identifies and extracts JSON data
- ⚡ **Fast**: Optimized processing for large volumes of data
- 🎯 **Precise**: Smart filtering of duplicate URLs
- 💾 **Export**: Save results to text file

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/thezakman/quick-extractor.git
```

2. Install in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select project folder

## 💡 How to Use

1. Click the extension icon in toolbar
2. Choose extraction type:
   - **All URLs**: Extract all links from page
   - **JavaScript**: .js files and scripts
   - **JSON**: Data in JSON format
3. Use buttons to:
   - 📋 Copy to clipboard (⌘+C)
   - 💾 Download as text file (⌘+S)

## 🛠️ Project Structure

```
quick-extractor/
├── src/
│   ├── popup/
│   │   ├── popup.html    # User interface
│   │   ├── popup.css     # Interface styles
│   │   └── popup.js      # Popup logic
│   ├── content/
│   │   └── content.js    # Content script
│   └── utils/
│       └── extractor.js  # Extraction functions
├── manifest.json         # Extension manifest
└── README.md            # Documentation
```

## 🤝 Contributing

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: new feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🐛 Bugs and Suggestions

Found a bug or have a suggestion? [Open an issue](https://github.com/thezakman/quick-extractor/issues)

## 🚀 Release Notes v0.3

### New Features
- JavaScript file extraction
- JSON data extraction
- Enhanced URL detection
- Copy to clipboard with shortcuts
- Download results as text file
- Results counter and extraction time

### Improvements
- Smart duplicate URL filtering
- Better error handling
- Enhanced UI feedback
- Performance optimizations
- Memory usage improvements

### 📦 Download
- [quick-extractor-v0.3.zip](https://github.com/thezakman/quick-extractor/releases/download/v0.3/quick-extractor.zip)

---
Made with ♥ by [@TheZakMan](https://github.com/thezakman)