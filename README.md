# 📺 YoutubeSwapper

A Firefox extension for privacy-first YouTube watching, auto-redirection to youtube-nocookie.com, advanced subtitle and download controls, and handy context menu shortcuts.
## ✨ Features
- 🔄 Redirect YouTube links to the privacy-friendly nocookie player
- 📝 Context menu: toggle subtitles, toggle notifications, download video, open options, visit GitHub
- ⚙️ Configurable options: interface language, subtitle language, theme, notifications, playback timestamp/history, download policy & format
- ⬇️ Download integration with notube.lol (optional, at your own risk)
- 🔒 Privacy-focused: no telemetry, no ads, fully local storage of preferences

## 🚀 Usage
- When browsing YouTube videos, right-click a video for quick-access to the privacy-friendly nocookie player
- Use the extension icon’s context menu for quick toggles and downloads.
- Click the extensions icon to quickly switch between the youtube and cookie-free ad-free player.
- Customize all behaviors via the settings page popup.

## ⚙️ Advanced
- 🔐 For enhanced privacy, block all cookies from youtube-nocookie.com through Firefox’s site settings (YoutubeSwapper deletes cookies from youtube-nocookie automatically).
- 🔄 Reset extension settings by running await browser.storage.local.clear() in your extension’s debug console (about:debugging).

## 📥 Installation
- For a stable permanent version:
  - Use https://addons.mozilla.org/en-US/firefox/addon/youtubeswapper/

- For development:
  - Navigate to about:debugging#/runtime/this-firefox
  - Click Load Temporary Add-on
  - Select manifest.json from this repository

## 🛠 Development Notes
- Built with Firefox WebExtension APIs, manifest v2.
- Dynamic context menus update instantly when options change.
- Attempts to auto-close settings popups only when allowed by browser security.

# ⚠️ Disclaimer

    Not affiliated with YouTube or notube.lol.

    Download feature relies on third-party service; use responsibly.
