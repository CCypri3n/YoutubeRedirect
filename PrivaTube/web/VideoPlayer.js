const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

let nextPageToken = null;
let currentMode = 'home'; // 'home', 'search', or 'channel'
let lastQuery = '';
let lastChannelId = '';
let lastRegionCode = 'FR'; // for trending/homepage

let API_KEY = '';


function fetchApiKey() {
  return browser.storage.local.get({ api_key: '' }).then((results) => {
    const apiKey = results.api_key; // Correctly access the stored API key
    if (apiKey) {
      return Promise.resolve(apiKey.trim());
    }
    return Promise.reject("API key not found.");
  }).catch(() => {
    return new Promise((resolve, reject) => {
      // Show modal and set up event listener for save button
      const modal = document.getElementById('api-key-modal');
      const errorDiv = document.getElementById('api-key-error');
      modal.style.display = 'flex';
      document.getElementById('api-key-input').focus();

      const onSave = async () => {
        const api_key = document.getElementById('api-key-input').value.trim();
        if (!api_key) {
          errorDiv.textContent = "Please enter an API key.";
          errorDiv.style.display = 'block';
          return;
        }
        try {
          const testResp = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=dQw4w9WgXcQ&key=${api_key}`
          );
          if (!testResp.ok) {
            errorDiv.textContent = "Invalid API Key. Please try again.";
            errorDiv.style.display = 'block';
            return;
          }
          browser.storage.local.set({ api_key }).then(() => {
            API_KEY = api_key;
            modal.style.display = 'none';
            document.getElementById('api-key-save-btn').removeEventListener('click', onSave);
            resolve(api_key);
          });
        } catch (err) {
          errorDiv.textContent = "Network error. Please try again.";
          errorDiv.style.display = 'block';
        }
      };

      document.getElementById('api-key-save-btn').addEventListener('click', onSave);
    });
  });
}



async function headerClick() {
  closePlayer();
  showHomepage();
}

async function showHomepage() {
    // GO TO PrivaTube.html with updated URL
    const url = new URL(window.location);
    url.searchParams.delete('ch');
    url.searchParams.delete('v');
    url.searchParams.delete('t');
    url.searchParams.delete('q');
    const lang = url.searchParams.get('lang');
    if (!lang) {
        url.searchParams.set('lang', 'FR'); // Default to 'FR' if no lang param
        // Open URL in same tab
        window.location.href = browserUrl("PrivaTube.html?" + url.searchParams.toString());
    } else {
        lastRegionCode = lang;
    }
    // Set the region code in the button
    // Open URL in same tab
    window.location.href = browserUrl("PrivaTube.html?" + url.searchParams.toString());
}


async function searchVideos(query) {
    // Implement search logic with search args in URL
    closePlayer();
    const url = new URL(window.location);
    url.searchParams.delete('v');
    url.searchParams.delete('t');
    url.searchParams.delete('ch');
    queryFromField = document.getElementById('searchQuery').value.trim();
    console.log("Search query from field:", queryFromField);
    url.searchParams.set('q', queryFromField);
    window.location.href = browserUrl("PrivaTube.html?" + url.searchParams.toString());
}


document.addEventListener('DOMContentLoaded', () => { // Ensure player is closed on page load
  const input = document.getElementById('searchQuery');
  const btn = document.getElementById('country-code-btn');
  const list = document.getElementById('country-list');
  const dropdown = document.getElementById('country-dropdown');
  const mainHeader = document.getElementById('main-header-link');

  closePlayer(); // Close player on page load
    if (input) {
        input.value = ''; // Clear search input
    }

  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      searchVideos();
    }
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    list.style.display = (list.style.display === 'block') ? 'none' : 'block';
    btn.classList.toggle('active');
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', () => {
    list.style.display = 'none';
    btn.classList.remove('active');
  });

  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  const videoId = params.get('v');
  if (lang) {
    lastRegionCode = lang;
  } mainHeader.href = browserUrl("PrivaTube.html?lang=" + lastRegionCode); // Update header link to include region code
  // Update the button display
  if (btn) {
    btn.innerHTML = `${lastRegionCode} ▼`;
  }

  // Handle country selection
  list.querySelectorAll('div').forEach(item => {
  item.addEventListener('click', (e) => {
    const code = item.getAttribute('data-code');
    btn.innerHTML = `${code} ▼`;
    list.style.display = 'none';
    btn.classList.remove('active');
    lastRegionCode = code;
    const url = new URL(window.location);
    url.searchParams.set('lang', lastRegionCode);
    window.history.replaceState({}, '', url);
    mainHeader.href = browserUrl("PrivaTube.html?lang=" + lastRegionCode); // Update header link to include region code
    });
 });
  
  fetchApiKey().then(key => {
  if (key && videoId) {
    API_KEY = key;
    playVideo(videoId)
  } else {
    closePlayer();
    }
  // If key is missing/invalid, promptForApiKey() is already called inside fetchApiKey()
  }).catch(err => {
    // Optional: log error, but don't show homepage
    console.error("API Key error:", err);
  });

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      searchVideos();
    });
  }

  const shareBtn = document.getElementById('share-btn');
  const shareModal = document.getElementById('share-modal');
  const shareLink = document.getElementById('share-link');
  const shareCloseBtn = document.getElementById('share-close-btn');

  if (shareBtn && shareModal && shareLink && shareCloseBtn) {
    shareBtn.onclick = function() {
      if (!lastPlayedVideoId) return;
      const shareUrl = `https://ccypri3n.github.io/PrivaTube/?v=${lastPlayedVideoId}`;
      shareLink.value = shareUrl;
      shareModal.style.display = 'flex';
      shareLink.select();
    };
    shareCloseBtn.onclick = function() {
      shareModal.style.display = 'none';
    };
    // Optional: close modal when clicking backdrop
    shareModal.querySelector('.api-key-modal-backdrop').onclick = function() {
      shareModal.style.display = 'none';
    };
  }
// Copy share link functionality
  const copyBtn = document.getElementById('copy-share-link-btn');
  if (copyBtn && shareLink) {
    copyBtn.onclick = function() {
      shareLink.select();
      document.execCommand('copy');
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1200);
    };
  }

});

function linkify(text) {
  // Regex to match URLs (http/https)
  text = text.replace(
    /(https?:\/\/[^\s]+)/g,
    (match, url) => `<a href="${browserUrl(url)}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
    // 2. Linkify local .html links with optional query parameters
  text = text.replace(
    /\b([a-zA-Z0-9_-]+\.html(?:\?[^\s]*)?)/g,
    (match, url) => `<a href="${browserUrl(url)}"></a>`
  );
  return text;
}

// --- Video Player Logic ---

// Show video info based on videoId (Description, Title, Channel Info)
async function videoInfoShow(videoId) {
  if (videoId) {
    let video = null;
    try {
      const resp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`);
      const data = await resp.json();
      if (data.items && data.items.length > 0) {
        console.log("Video data fetched successfully:", data);
        video = data.items[0];
        document.getElementById('video-title').textContent = video.snippet.title;
        document.getElementById('video-description').innerHTML = youtubeDescriptiontoPrivaTube(video.snippet.description);
        document.getElementById('view-count').textContent = `${Number(video.statistics.viewCount).toLocaleString()} views`;
        document.getElementById('like-count').textContent = `${video.statistics.likeCount ? Number(video.statistics.likeCount).toLocaleString()+" likes": ''}`;
      } else {
        throw new Error("No video data");
      }
    } catch (err) {
      console.error("Error fetching video info:", err);
      // Reset video info if fetch fails
      document.getElementById('video-title').textContent = 'Video Title';
      document.getElementById('video-description').textContent = 'Video description will appear here.';
      document.getElementById('view-count').textContent = 'Views: N/A';
      document.getElementById('like-count').textContent = 'Likes: N/A';
      video = null;
    }

    // Only fetch channel info if video was found
    if (video) {
      try {
        console.log("Fetching channel info for video:", video);
        const channelID = video.snippet.channelId;
        const channelResp = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${API_KEY}`);
        const channelData = await channelResp.json();
        if (channelData.items && channelData.items.length > 0) {
          const channel = channelData.items[0];
          // After fetching channel info:
          document.getElementById('channel-name').textContent = channel.snippet.title;
          document.getElementById('channel-name').style.cursor = "pointer";

          document.getElementById('channel-avatar').src = channel.snippet.thumbnails.default.url;
          document.getElementById('channel-avatar').alt = channel.snippet.title;
          document.getElementById('channel-avatar').style.cursor = "pointer";
          document.getElementById('channel-link').href = createChannelUrl(channelID);
          document.getElementById('channel-subscribers').textContent =
            channel.statistics.subscriberCount
              ? `${Number(channel.statistics.subscriberCount).toLocaleString()} subscribers`
              : '';
          document.title = `PrivaTube - Watching "${channel.snippet.title}"`;
          displayComments(videoId); // Load comments for the video
          console.log("Channel info fetched successfully:", channel);
        }
      } catch (err) {
        console.error("Error fetching channel info:", err);
        document.getElementById('channel-avatar').src = '';
        document.getElementById('channel-avatar').alt = '';
        document.getElementById('channel-avatar').style.cursor = "default";
        document.getElementById('channel-name').textContent = 'Channel Name';
        document.getElementById('channel-name').style.cursor = "default";
        document.getElementById('channel-subscribers').textContent = 'Channel Subscribers: N/A';
      }
    } else {
      document.getElementById('channel-avatar').src = '';
      document.getElementById('channel-avatar').alt = '';
      document.getElementById('channel-name').textContent = '';
      document.getElementById('channel-subscribers').textContent = '';
    }
  } else {
    document.getElementById('video-title').textContent = "";
    document.getElementById('video-description').textContent = "";
    document.getElementById('video-description').innerHTML = "";
    document.getElementById('view-count').textContent = "";
    document.getElementById('like-count').textContent = "";
    document.getElementById('channel-avatar').src = '';
    document.getElementById('channel-avatar').alt = '';
    document.getElementById('channel-avatar').style.cursor = "default";
    document.getElementById('channel-name').textContent = '';
    document.getElementById('channel-name').style.cursor = "default";
    document.getElementById('channel-subscribers').textContent = '';
  }
}

let lastPlayedVideoId = null;

async function playVideo(videoId) {
  window.scrollTo(0, 0);
  lastPlayedVideoId = videoId; // Track for sharing
  document.body.classList.add('video-playing');
  const url = new URL(window.location);
  url.searchParams.delete('ch');
  url.searchParams.delete('q');
  url.searchParams.set('v', videoId);
  const time = url.searchParams.get('t');
  // Use pushState to update URL without reloading
  window.history.replaceState({}, '', url);
  let videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  if (time && !isNaN(Number(time))) {
    videoUrl += `?start=${Number(time)}`;
  }
  const playerDiv = document.getElementById('video');
  const resultsDiv = document.getElementById('results');
  const bannerDiv = document.getElementById('channel-banner');
  const videoInfoDiv = document.getElementById('video-info');
  playerDiv.innerHTML = `<iframe
      class="video-embed"
      src="${videoUrl}"
      title="PrivaTube Video Player"
      allow="web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>`;
  playerDiv.style.display = 'block';
  if (resultsDiv) resultsDiv.style.display = 'none';
  if (bannerDiv) bannerDiv.style.display = 'none';
  if (videoInfoDiv) videoInfoDiv.style.display = 'block'; // <-- Show info
  videoInfoShow(videoId);
  
}

function closePlayer() {
  document.body.classList.remove('video-playing');
  const playerDiv = document.getElementById('video');
  const resultsDiv = document.getElementById('results');
  const bannerDiv = document.getElementById('channel-banner');
  const videoInfoDiv = document.getElementById('video-info');
  playerDiv.innerHTML = '';
  playerDiv.style.display = 'none';
  if (resultsDiv) resultsDiv.style.display = '';
  if (bannerDiv) bannerDiv.style.display = '';
  if (videoInfoDiv) videoInfoDiv.style.display = 'none'; // <-- Hide info
  videoInfoShow(false);
}

function createChannelUrl(channelId) {
  const url = new URL(window.location);
  const lang = url.searchParams.get('lang') || "FR";
  let params = new URLSearchParams();
  params.set('ch', channelId);
  params.set('lang', lang);
  console.log("Channel URL with params:", params.toString());
  channelUrl = browserUrl("PrivaTube.html?" + params.toString());
  return(channelUrl);
}

function youtubeDescriptiontoPrivaTube(description) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  if (!description) return '';
  // Remove excessive whitespace
  description = description.replace(/\s+/g, ' ').trim();
    // Regex to match YouTube video URLs (both with and without "www.")
  const ytUrlRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g;

  // Replace each YouTube video URL with your custom format
  description = description.replace(ytUrlRegex, (match, videoId) => {
    return browserUrl(`video.html?v=${videoId}`);
  });

  // If you want to also match youtu.be short links:
  const ytShortUrlRegex = /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/g;
  description = description.replace(ytShortUrlRegex, (match, videoId) => {
    return browserUrl(`video.html?v=${videoId}`);
  });

  // Replace YouTube channel URLs with channel ID (not handle)
  // Channel IDs are 24 characters, start with UC, and contain letters, numbers, -, _
  description = description.replace(
    /https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/g,
    (match, channelId) => browserUrl(`PrivaTube.html?ch=${channelId}`)
  );

  return linkify(description);
}

function youtubeCommentPrivaTube(comment) {
  if (!comment) return '';

  // Remove excessive whitespace
  comment = comment.replace(/\s+/g, ' ').trim();

  // 1. Replace YouTube video URLs (with optional &t= and other params)
  // Example: https://www.youtube.com/watch?v=abcdefghijk&t=123s&ab_channel=Test
  const ytUrlRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(&[^\s]*)?/g;
  comment = comment.replace(ytUrlRegex, (match, videoId, params) => {
    return browserUrl(`video.html?v=${videoId}${params ? params : ''}`);
  });

  // 2. Replace youtu.be short links (with optional ?t= and other params)
  // Example: https://youtu.be/abcdefghijk?t=123
  const ytShortUrlRegex = /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(\?[^\s]*)?/g;
  comment = comment.replace(ytShortUrlRegex, (match, videoId, params) => {
    return browserUrl(`video.html?v=${videoId}${params ? params : ''}`);
  });

  // 3. Replace YouTube channel URLs with channel ID (not handle)
  // Example: https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx
  comment = comment.replace(
    /https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/g,
    browserUrl('PrivaTube.html?ch=$1')
  );

  return comment;
}



function displayComments(videoId) {
  const commentWrapper = document.getElementById('comment-wrapper');
  if (!commentWrapper) {
    console.error('No comment element found in html:', commentWrapper);
    return;
  }

  commentWrapper.innerHTML = ''; // Clear previous comments
  if (!videoId) {
    commentWrapper.textContent = 'No video selected.';
    return;
  }

  fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const comment = item.snippet.topLevelComment.snippet;
          // Example: inside your displayComments function
          const commentDiv = document.createElement('div');
          const channelUrl = createChannelUrl(comment.authorChannelId.value)
          const rawText = comment.textDisplay || comment.textOriginal || '';
          if (!rawText) {
            console.warn("Comment text is empty, skipping:", comment);
            return; // Skip empty comments
          }
          else {
            text = youtubeCommentPrivaTube(rawText);
          }
          // Create comment element
          commentDiv.className = 'comment';
          commentDiv.innerHTML = `
            <a href="${channelUrl}" class="comment-avatar-link">
              <img src="${comment.authorProfileImageUrl}" alt="  " class="comment-avatar">
            </a>
            <div class="comment-main">
              <div class="comment-header">
              ${comment.authorChannelId ? `<a href="${channelUrl}" class="comment-author-link"><label class="comment-author">${comment.authorDisplayName}</label></a>` : `<strong class="comment-author">${comment.authorDisplayName}</strong>`}
                <span class="comment-date">${
                new Date(comment.publishedAt).toLocaleString(undefined, {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
              }</span>
              </div>
              <div class="comment-text">${text}</div>
            </div>
          `;
          commentWrapper.appendChild(commentDiv);
        });
      } else {
        commentsDiv.textContent = 'No comments available.';
      }
    })
    .catch(err => {
      console.error("Error fetching comments:", err);
      commentsDiv.textContent = 'Error loading comments.';
    });
}

function browserUrl(URL) {
  // Use browser.runtime.getURL to get the full URL for the extension
  const browserUrl = browser.runtime.getURL(`PrivaTube/${URL}`);
  console.log("Browser URL:", browserUrl);
  return browserUrl;
}