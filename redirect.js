// redirect.js

(async function() {
  console.log("PrivaTube Redirect Script Loaded");
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('v');
  const currentUrl = window.location.href;
  console.log("Current URL:", currentUrl);
  browser.runtime.sendMessage({ log: `Current URL: ${currentUrl}` });

  const options = window._redirectOptions || {
  hl: 'en',
  cc_lang: 'en',
  cc_load_policy: 1,
  theme: 'dark',
  preserve_timestamp: 0,
  tab_history: 0,
  privatube: 1,
};
  console.log("Opions:", options);
  let timestamp = ""
  try {
    if (Number(options.preserve_timestamp) && (currentUrl.includes("youtube.com/watch") || currentUrl.includes("youtube-nocookie.com/embed") || currentUrl.includes("PrivaTube/video.html"))) {
      browser.runtime.sendMessage({ log: `Fetching with ${options.preserve_timestamp}, ${typeof options.preserve_timestamp}`})
      const ts = getTimestamp();
      browser.runtime.sendMessage({ log: `Fetched Timestamp: ${ts} with ${options.preserve_timestamp}, ${typeof options.preserve_timestamp}`})
        if (currentUrl.includes("youtube.com/watch") && ts) {
          timestamp = `&start=${Math.floor(ts)}`;
        }
        else if (ts) {
          timestamp = `&t=${Math.floor(ts)}s`;
        }
        browser.runtime.sendMessage({ log: `Set Timestamp: ${timestamp} with ${options.preserve_timestamp}, ${typeof options.preserve_timestamp}`})
    }}
  catch (error) {
    console.error("Error fetching timestamp:", error);
    browser.runtime.sendMessage({ log: `Error fetching timestamp: ${error.message}` });
  }
  
  console.log("Current URL:", currentUrl);
  if (videoId && currentUrl.includes("youtube.com/watch")) {
  const targetUrl = options.privatube
    ? browserUrl(`PrivaTube.html?v=${videoId}&wmode=transparent&iv_load_policy=3&autoplay=1&html5=1&showinfo=0&rel=0&modestbranding=1&playsinline=0&theme=${options.theme}&hl=${options.hl}&cc_lang_pref=${options.cc_lang}&cc_load_policy=${options.cc_load_policy}${timestamp}`)
    : `https://www.youtube-nocookie.com/embed/${videoId}?hl=${options.hl}&cc_lang_pref=${options.cc_lang}&cc_load_policy=${options.cc_load_policy}`;    browser.runtime.sendMessage({ log: `targetUrl: ${targetUrl}` });
    if (Number(options.tab_history)) {
      window.location.assign(targetUrl);
    }
    else {
      window.location.replace(targetUrl)
    }

  } else if (currentUrl.includes("youtube-nocookie.com/embed")) {
    const path = new URL(currentUrl).pathname;
    const videoId = path.split('/embed/')[1];
    if (videoId) {
      const targetUrl = `https://youtube.com/watch?v=${videoId}&themeRefresh=1${timestamp}`;
      browser.runtime.sendMessage({ log: `targetUrl: ${targetUrl}` });
      if (Number(options.tab_history)) {
        window.location.assign(targetUrl);
      }
      else {
        window.location.replace(targetUrl)
      }
    }
  } else if (currentUrl.includes("PrivaTube/video.html")) {
    const videoId = params.get('v');
    if (videoId) {
      const targetUrl = `https://youtube.com/watch?v=${videoId}&themeRefresh=1${timestamp}`;
      browser.runtime.sendMessage({ log: `targetUrl: ${targetUrl}` });
      if (Number(options.tab_history)) {
        window.location.assign(targetUrl);
      }
      else {
        window.location.replace(targetUrl)
      }
    }
  }
})();

function getTimestamp() {
  const currentUrl = window.location.href;
  browser.runtime.sendMessage({ log: "Fetching timestamp from player." });

  let ytvideo = null;

  if (currentUrl.includes("youtube.com/watch") || currentUrl.includes("youtube-nocookie.com/embed") || currentUrl.includes("PrivaTube/video.html")) {
    ytvideo = document.querySelector('video.html5-main-video');
    if (ytvideo) {
      return Number(ytvideo.currentTime);
    } else {
      browser.runtime.sendMessage({ log: "ERROR: Video player element not found." });
      return null;
    }
  }
  return null;
}

function browserUrl(URL) {
  // Use browser.runtime.getURL to get the full URL for the extension
  const browserUrl = browser.runtime.getURL(`PrivaTube/${URL}`);
  console.log("Browser URL:", browserUrl);
  return browserUrl;
}