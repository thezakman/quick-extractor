# Quick Extractor

A powerful and feature-rich Chrome extension to extract, filter, and export URLs from web pages with persistent session storage, advanced filtering, and multiple export formats.

## ✨ Features

### 🚀 Core Extraction
- 🌐 **All URLs Extraction**: Captures all URLs from links, images, scripts, stylesheets, videos, and more
- 📜 **JavaScript Files**: Extracts .js, .jsx, .mjs, and .cjs files from various sources including inline scripts
- 🗃️ **JSON Data**: Identifies and extracts .json, .jsonp, and .geojson files
- ⚡ **Optimized Performance**: Smart selectors and efficient algorithms for fast extraction
- 🔍 **Deep Extraction**: Analyzes inline scripts, CSS, data attributes, and dynamic content

### 💾 Session Management (NEW in v0.5)
- 📦 **Persistent Storage**: Never lose your extracted URLs - data persists when you close and reopen
- 🔄 **Auto-Save**: Automatically saves after each extraction
- 🗑️ **Clear Results**: One-click to clear all stored data

### 🎯 Advanced Filtering (NEW in v0.5)
- 🔍 **Real-time Search**: Search through extracted URLs instantly
- 🖼️ **Filter by Type**: Images, Scripts, Styles, Media, Documents, API endpoints
- 🎨 **Smart Categorization**: Automatic URL type detection
- ⚡ **Instant Results**: Filter updates in real-time

### 📤 Multiple Export Options (NEW in v0.5)
- 📋 **Copy to Clipboard**: Quick copy with visual confirmation
- 💾 **TXT Export**: Plain text with timestamp
- 📊 **CSV Export**: Structured data with URL, Type, Domain, Extension columns
- { } **JSON Export**: Rich format with metadata and categorization

### 🎨 User Experience (NEW in v0.5)
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⌨️ **Keyboard Shortcuts**: Fast navigation and actions
- ⏱️ **Performance Metrics**: Real-time extraction stats
- 🎯 **Modern UI**: Clean, intuitive interface with smooth animations
- 🛡️ **Error Handling**: Robust error management with helpful messages

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

### Basic Extraction
1. **Navigate** to any webpage you want to extract URLs from
2. **Click** the Quick Extractor icon in your browser toolbar
3. **Choose** an extraction type:
   - **🌐 All URLs**: Extracts all URLs including links, images, scripts, CSS, videos, iframes, and more
   - **📜 JavaScript**: Extracts JavaScript files (.js, .jsx, .mjs, .cjs) from script tags and inline code
   - **🗃️ JSON**: Extracts JSON files (.json, .jsonp, .geojson) and API endpoints
4. **View** results with extraction metrics (count and time)

### Advanced Features (v0.5)

#### 🔍 Search & Filter
- Use the **search bar** to find specific URLs (⌘+K)
- Click **filter buttons** to show only:
  - 🖼️ Images (.jpg, .png, .gif, .webp, .svg, etc.)
  - 📜 Scripts (.js, .jsx, .mjs, .cjs)
  - 🎨 Styles (.css, .scss, .sass, .less)
  - 🎬 Media (.mp4, .mp3, .webm, .ogg, etc.)
  - 🔌 API endpoints (.json, .xml, /api/)
- Press **Escape** to clear search

#### 💾 Export Options
- **📋 Copy** (⌘+C): Copy all URLs to clipboard
- **💾 TXT** (⌘+S): Download as plain text file
- **{ } JSON**: Export as structured JSON with metadata
- **📊 CSV**: Export as spreadsheet-friendly CSV format

#### 🌙 Dark Mode
- Click the **🌙/☀️ button** in header to toggle theme (⌘+D)
- Your preference is saved automatically

#### ⌨️ Keyboard Shortcuts
- `⌘/Ctrl + K` - Focus search bar
- `⌘/Ctrl + C` - Copy URLs to clipboard
- `⌘/Ctrl + S` - Download as TXT file
- `⌘/Ctrl + D` - Toggle dark mode
- `Escape` - Clear search

#### 💾 Session Persistence
- **Auto-saved**: Your extracted URLs are automatically saved
- **Persistent**: Data remains even when you close the extension
- **Resume**: Open the extension anytime to see your last extraction
- **Clear**: Click 🗑️ to clear all stored data

### Tips for Best Results

- ✅ Use on fully loaded pages for complete extraction
- ✅ Results are automatically sorted alphabetically
- ✅ Duplicates are automatically removed
- ✅ Invalid URLs (data:, javascript:, mailto:) are filtered out
- ✅ Works with single-page applications (SPAs) and dynamic content
- ✅ Your session is saved - never lose extracted URLs again!
- ✅ Use filters to quickly find the URLs you need
- ✅ Export in multiple formats for different use cases

## 🛠️ Project Structure

```
quick-extractor/
├── src/
│   ├── popup/
│   │   ├── popup.html       # User interface with modern design
│   │   ├── popup.css        # Responsive styles with animations
│   │   └── popup.js         # Popup logic with error handling
│   ├── content/
│   │   └── content.js       # Optimized URL extraction algorithms
│   └── background.js        # Background service worker
├── icons/                   # Extension icons (16, 48, 128px)
├── manifest.json            # Chrome extension manifest v3
└── README.md               # Documentation
```

## 🔧 Technical Details

### Performance Optimizations (v0.4)

- **Smart Selectors**: Uses targeted CSS selectors instead of scanning all DOM elements
- **URL Normalization**: Efficient handling of relative, absolute, and protocol-relative URLs
- **Duplicate Prevention**: Set-based deduplication for O(1) lookup performance
- **Regex Patterns**: Optimized patterns for detecting dynamically loaded resources
- **Error Boundaries**: Prevents crashes with comprehensive error handling
- **Timeout Protection**: 10-second timeout prevents hanging on slow pages

### Extraction Capabilities

**All URLs Mode** extracts from:
- Links (`<a>`, `<link>`)
- Scripts (`<script src>`)
- Images (`<img src>`, `srcset`)
- Media (`<video>`, `<audio>`, `<source>`)
- Frames (`<iframe>`, `<embed>`)
- Forms (`<form action>`)
- CSS (inline styles and stylesheets)
- Data attributes (`data-src`, `data-url`, etc.)

**JavaScript Mode** finds:
- External scripts (`<script src>`)
- Module imports in inline code
- Dynamic script loading patterns
- Multiple JS formats (.js, .jsx, .mjs, .cjs)

**JSON Mode** discovers:
- Direct JSON file references
- API endpoints in fetch/AJAX calls
- JSON data in data attributes
- Multiple JSON formats (.json, .jsonp, .geojson)

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

## 🚀 Release Notes

### v0.6.3 (Latest) - Improved Error Handling

#### 🎯 Better Error Messages
- **Specific Error Types**: Different messages for different page types (chrome://, edge://, about:, extensions)
- **User-Friendly Titles**: Clear error titles like "Chrome Internal Page", "Extension Page", "Timeout"
- **Actionable Guidance**: Each error message tells you exactly what to do next
- **Visual Improvements**: Better styled error messages with icons and clear formatting
- **Dark Mode Support**: Error messages now properly styled in dark mode

#### 📋 Supported Error Types
- **Chrome Internal Pages** (`chrome://`): Clear message explaining these pages are restricted
- **Extension Pages**: Warns when trying to extract from extension pages
- **Edge Internal Pages** (`edge://`): Support for Edge browser internal pages
- **About Pages** (`about:`): Handles Firefox and other browser special pages
- **No URL**: Detects when no page is loaded
- **Timeout**: Friendly message when extraction takes >10 seconds
- **Generic Errors**: Fallback for unexpected errors

#### 🎨 UI Enhancements
- Error messages with emoji indicators (⚠️)
- Code-formatted URLs in error messages (`<code>chrome://</code>`)
- Multi-line messages with proper spacing
- Consistent styling with the rest of the extension

### v0.6.2 - Enhanced Dark Mode Debugging

#### 🔍 Debugging Improvements
- **Enhanced Logging**: Added comprehensive console logs for theme persistence debugging
- **Storage Verification**: Theme save operation now verifies the value was stored correctly
- **Pre-load Logging**: Shows full storage state when loading theme
- **Toggle Verification**: Confirms theme is saved after each toggle

#### 🐛 Additional Fixes
- Added `document.documentElement.classList.toggle` to ensure theme applies to entire document
- Improved error messages for better troubleshooting
- More detailed console output for debugging persistence issues

### v0.6.1 - Critical Bug Fixes

#### 🐛 Bug Fixes
- **Fixed Z-Index Issue**: Removed problematic gradient overlays that were appearing over action buttons
- **Fixed Dark Mode Colors**: URL list and items now properly display in dark mode with correct colors
- **Fixed Dark Mode Persistence**: Theme preference now saves and restores correctly across sessions
- **Improved Logging**: Added console logs for better debugging of theme and session restoration

#### 🎨 Dark Mode Improvements
- URL items background: `#0f172a` in dark mode
- URL items hover: `#1e293b` with blue border glow
- Empty state text: Properly colored in dark mode (`#94a3b8`)
- Theme toggle logs show current state for debugging

#### 🔧 Technical Fixes
- Removed `::before` and `::after` pseudo-elements causing gradient overlay
- Added `z-index: 10` to `.actions` to ensure buttons stay on top
- Added `z-index: 1` to `#result-container` for proper layering
- Enhanced theme restoration logic with better error handling

### v0.6 - UI Polish & Improvements

#### 🎨 UI/UX Refinements
- **Reorganized Header**: Cleaner header layout without cluttered toggle button
- **Footer Icon Actions**: Dark mode toggle moved to footer alongside bug report icon
- **Improved Spacing**: Better padding and margins throughout the interface
- **Larger Window**: Increased to 380px width for better readability
- **Refined Buttons**: Better icon sizes and padding for all action buttons
- **Consistent Borders**: 2px borders for inputs and containers for clearer visual hierarchy
- **Icon Button Style**: Unified style for footer action icons with smooth hover effects

#### 🔧 Layout Improvements
- **Better Button Layout**: Action buttons now flex evenly in rows
- **Optimized Heights**: Adjusted URL list and container heights for better content visibility
- **Improved Filter Pills**: Better sizing and spacing for filter buttons
- **Enhanced Footer**: More organized footer with icon buttons grouped together
- **Cleaner Typography**: Refined font sizes and letter spacing

#### 🐛 Bug Fixes
- Fixed header layout spacing issues
- Improved dark mode toggle visibility and accessibility
- Better responsive behavior for action buttons
- Fixed filter button alignment

### v0.5 - Session Persistence & Advanced Filtering

#### 💾 Session Management
- **Persistent Storage**: URLs are now saved automatically and persist across sessions
- **Never Lose Data**: Close and reopen the extension without losing your extracted URLs
- **Auto-Save**: Automatically saves after each successful extraction
- **Smart Restore**: Shows "restored" indicator when displaying saved data
- **Clear Function**: One-click button to clear all stored data with confirmation

#### 🎯 Advanced Filtering & Search
- **Real-time Search**: Search through extracted URLs with instant filtering (⌘+K)
- **Type Filters**: Quick filter buttons for Images, Scripts, Styles, Media, Documents, and API endpoints
- **Smart Categorization**: Automatic URL type detection based on file extensions and patterns
- **Filter Persistence**: Active filter is maintained while searching
- **Escape to Clear**: Press Escape key to quickly clear search

#### 📤 Multiple Export Formats
- **JSON Export**: Structured format with metadata including extractedAt, totalUrls, type categorization
- **CSV Export**: Spreadsheet-friendly format with columns: ID, URL, Type, Domain, Extension
- **TXT Export**: Enhanced with timestamped filenames
- **Rich Metadata**: Exports include URL type, domain extraction, and file extension detection

#### 🌙 Dark Mode
- **Theme Toggle**: Beautiful dark mode with optimized color palette
- **Persistent Preference**: Theme choice is saved across sessions
- **Keyboard Shortcut**: Toggle with ⌘+D for quick switching
- **Smooth Transitions**: All elements adapt smoothly to theme changes

#### ⌨️ Keyboard Shortcuts
- **⌘+K / Ctrl+K**: Focus search bar for quick filtering
- **⌘+C / Ctrl+C**: Copy all URLs to clipboard
- **⌘+S / Ctrl+S**: Download URLs as TXT file
- **⌘+D / Ctrl+D**: Toggle dark/light mode
- **Escape**: Clear search input

#### 🎨 UI/UX Improvements
- **Search Bar**: Prominent search input with clear button
- **Filter Pills**: Visual filter buttons with active state
- **Two-Row Actions**: Organized export options in two rows
- **Visual Feedback**: Success states for copy and export actions
- **Responsive Layout**: Better space utilization with new layout
- **Clear Button**: Trash icon to clear all results with confirmation

#### 🔧 Technical Enhancements
- **Chrome Storage API**: Uses chrome.storage.local for reliable persistence
- **Storage Permission**: Added storage permission to manifest
- **Filter Functions**: Efficient regex-based type detection
- **URL Analysis**: Domain and extension extraction helpers
- **Organized Code**: Better structure with helper functions

#### 🐛 Bug Fixes
- Fixed issue where data was lost when closing popup
- Improved error handling for storage operations
- Better state management for filters and search
- Fixed edge cases in URL type detection

### v0.4 - Performance & Optimization Update

#### ⚡ Performance Improvements
- **3x Faster Extraction**: Optimized DOM traversal using targeted CSS selectors instead of `querySelectorAll('*')`
- **Smart URL Normalization**: New unified function handles all URL types (relative, absolute, protocol-relative)
- **Reduced Memory Usage**: Set-based deduplication and efficient data structures
- **Sorted Results**: All URLs automatically sorted alphabetically for easier review

#### 🔍 Enhanced Extraction
- **More File Formats**: Added support for .jsx, .mjs, .cjs (JavaScript) and .jsonp, .geojson (JSON)
- **Deep Script Analysis**: Extracts dynamically loaded scripts from inline code patterns
- **CSS URL Detection**: Finds URLs in inline styles and background-image properties
- **Srcset Support**: Properly handles responsive image srcset attributes
- **Data Attribute Scanning**: Checks data-src, data-url, data-json, data-config, and more

#### 🛡️ Robustness & UX
- **Better Error Handling**: User-friendly error messages for common issues
- **Loading States**: Visual feedback during extraction with disabled buttons
- **Timeout Protection**: 10-second timeout prevents hanging on problematic pages
- **Chrome Internal Protection**: Prevents errors when trying to extract from chrome:// pages
- **Success Feedback**: Visual confirmation when copying or downloading
- **Timestamped Downloads**: Downloaded files include timestamp for better organization

#### 🧹 Code Quality
- **Removed Dead Code**: Cleaned up unused url-extractor.js file
- **Better Comments**: Comprehensive inline documentation
- **URL Validation**: Filters out invalid protocols (javascript:, mailto:, data:, etc.)
- **Concurrent Request Prevention**: Blocks multiple simultaneous extractions

#### 🐛 Bug Fixes
- Fixed issues with relative URL resolution
- Improved handling of cross-origin stylesheets
- Better detection of script injection state
- Fixed edge cases in JSON parsing

### v0.3 - Initial Release

#### New Features
- JavaScript file extraction
- JSON data extraction
- Enhanced URL detection
- Copy to clipboard with shortcuts
- Download results as text file
- Results counter and extraction time

#### Improvements
- Smart duplicate URL filtering
- Better error handling
- Enhanced UI feedback
- Performance optimizations
- Memory usage improvements

### 📦 Downloads
- [quick-extractor-v0.6.3.zip](https://github.com/thezakman/quick-extractor/archive/refs/tags/0.6.3.zip) ⭐
- [quick-extractor-v0.6.3.crx](https://github.com/thezakman/quick-extractor/releases/download/0.6.3/quick-extractor.crx)

## 📊 Feature Evolution

| Feature | v0.3 | v0.4 | v0.5 | v0.6 |
|---------|------|------|------|------|
| **Session Persistence** | ❌ | ❌ | ✅ | ✅ |
| **Search URLs** | ❌ | ❌ | ✅ | ✅ |
| **Type Filters** | ❌ | ❌ | ✅ | ✅ |
| **Export Formats** | TXT | TXT | TXT, JSON, CSV | TXT, JSON, CSV |
| **Dark Mode** | ❌ | ❌ | ✅ | ✅ Improved |
| **UI Polish** | Basic | Good | Good | ⭐ Excellent |
| **Window Size** | 360px | 360px | 360px | 380px |
| **Performance** | Good | ⚡ 3x faster | ⚡ 3x faster | ⚡ 3x faster |

---
Made with ♥ by [@TheZakMan](https://github.com/thezakman)