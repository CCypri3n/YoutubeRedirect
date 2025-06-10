# 📺 YoutubeSwapper

A Firefox extension for privacy-first YouTube watching. Now featuring **PrivaTube**—a built-in, API-based YouTube alternative for fewer ads and more control.

## ✨ Features

- 🔄 Redirect YouTube links to PrivaTube - a local YouTube alternative using the YouTube API (requires your own API key - Check ) for enhanced privacy and minimal ads or to youtube-nocookies.com, a lightweight video player (Doesn't require your own API key)
- 🔍 Search and watch YouTube videos via PrivaTube, right inside the extension
- 📝 Context menu: toggle subtitles, notifications, download video, open options, visit GitHub
- ⚙️ Configurable options: interface language, subtitle language, theme, notifications, playback timestamp/history, download policy & format
- ⬇️ Download integration with notube.lol (optional, at your own risk)
- 🔒 Privacy-focused: no telemetry, no ads, fully local storage of preferences

## 🚀 Usage

- Search and watch YouTube videos via PrivaTube for a more private, ad-minimized experience
- Right-click any YouTube video for quick actions
- Use the extension icon’s menu for toggles, downloads, and player switching
- Customize all behaviors via the settings popup

## 🔑 How to Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and log in.
2. Create a new project:  
   - Click the project dropdown (top left) → **New Project** → Name it → **Create**.
3. Enable the API:  
   - Go to **APIs & Services > Library**  
   - Search for `YouTube Data API v3` → **Enable**.
4. Create credentials:  
   - Go to **APIs & Services > Credentials**  
   - Click **Create Credentials** → **API key**  
   - Copy the API key shown.
5. *(Optional)* Restrict your key to YouTube Data API v3 for security.

[More help from Google](https://developers.google.com/youtube/v3/getting-started)

## 🛠 Development Notes

- Built with Firefox WebExtension APIs, manifest v2
- Dynamic context menus update instantly when options change
- PrivaTube is fully integrated and uses your YouTube API key for local video search and playback

## ⚠️ Disclaimer

`Not affiliated with YouTube or notube.lol.
Download feature relies on third-party service; use responsibly`
