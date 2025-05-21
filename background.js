// background.js


// Toggle the context menu for the subtitles
function createOrUpdateSubtitleMenu(enabled) {
  const title = enabled ? "Turn Subtitles Off" : "Turn Subtitles On";
  browser.contextMenus.remove("toggle-subtitles").catch(() => {}).then(() => {
    browser.contextMenus.create({
      id: "toggle-subtitles",
      title: title,
      contexts: ["browser_action"], // or "action" for MV3
    });
  });
}

function createOrUpdateNotificationMenu(enabled) {
  const title = enabled ? "Do not disturb" : "Do disturb";
  browser.contextMenus.remove("toggle-notifications").catch(() => {}).then(() => {
    browser.contextMenus.create({
      id: "toggle-notifications",
      title: title,
      contexts: ["browser_action"], // or "action" for MV3
    });
  });
}


// Toggle the context menu for download using notube.lol
function toggleDownloadMenu(enabled) {
  console.log("toggleDownloadMenu called with: ", enabled, typeof enabled);
  const title = "Download Video";
  browser.contextMenus.remove("download-video").catch(() => {}).then(() => {
    if (enabled) {
      console.log("toggleDownloadMenu activated with: ", enabled, typeof enabled);
      browser.contextMenus.create({
        id: "download-video",
        title: title,
        contexts: ["browser_action"], // or "action" for MV3
      });
    }
  });
}

function rebuildContextMenus(state) {
  browser.contextMenus.removeAll().then(() => {
    // Always in the same order:
    browser.contextMenus.create({
      id: "open-options",
      title: "Open Settings",
      contexts: ["browser_action"],
      icons: {
        "16": "icons/tune16.png"
      }
    });

    browser.contextMenus.create({
      id: "toggle-subtitles",
      title: state.cc_load_policy === 1 ? "Turn Subtitles Off" : "Turn Subtitles On",
      contexts: ["browser_action"],
      icons: {
        "16": state.cc_load_policy === 1 ? "icons/closed_captions_off16.png" : "icons/closed_captions16.png"
      }
    });
    browser.contextMenus.create({
      id: "toggle-notifications",
      title: state.notifications_allowed === 1 ? "Do not disturb" : "Do disturb",
      contexts: ["browser_action"],
      icons: {
        "16": state.notifications_allowed === 1 ? "icons/notifications_off16.png" : "icons/notifications16.png"
      }
    });
    if (state.download_policy === 1) {
      browser.contextMenus.create({
        id: "download-video",
        title: "Download Video",
        contexts: ["browser_action"],
        icons: {
          "16": "icons/download16.png"
        }
      });
    }

    browser.contextMenus.create({
      id: "url-github",
      title: "Support me on Github",
      contexts: ["browser_action"],
      icons: {
        "16": "icons/github16.png"
      }
    });

    browser.contextMenus.create({
      id: "open-in-nocookies",
      title: "Open without cookies / ads",
      contexts: ["link"]
    })

    browser.contextMenus.create({
      id: "open-in-current-tab",
      title: "in this tab",
      parentId: "open-in-nocookies",
      contexts: ["link"],
      icons: {
        "16": "icons/tab16.png"
      }
    })
    browser.contextMenus.create({
      id: "open-in-new-tab",
      title: "in a new tab",
      parentId: "open-in-nocookies",
      contexts: ["link"],
      icons: {
        "16": "icons/tab_new16.png"
      }
    })
  });
}

function getCurrentStateAndRebuildMenus() {
  browser.storage.local.get({
    cc_load_policy: 1,
    notifications_allowed: 1,
    download_policy: 0
  }).then(rebuildContextMenus);
}

// On extension startup:
getCurrentStateAndRebuildMenus();


// Remove any pre-existing cookies for that domain
browser.cookies.getAll({ domain: "youtube-nocookie.com" }).then(cookies => {
  for (const cookie of cookies) {
    browser.cookies.remove({
      url: "https://" + cookie.domain + cookie.path,
      name: cookie.name,
      storeId: cookie.storeId
    });
  }
});

function redirectYouTubeTab(tabId) {
  browser.tabs.executeScript(tabId, { file: "redirect.js" })
    .catch(err => console.error("Failed to inject script:", err));
}

function notify(title, content) {
    browser.storage.local.get({ notifications_allowed: 1 })
    .then(options => {
        if (options.notifications_allowed==1) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("icons/icon-48.png"),
                title,
                message: content,
              });
        }
        else {
            console.log(`Notfications are turned off - No notifcations with title "${title}" and content "${content}" send`)
        }
    });
}


// Listeners


// Block setting of cookies on requests
browser.webRequest.onHeadersReceived.addListener(
  function(details) {
    // Remove any Set-Cookie header from responses
    details.responseHeaders = details.responseHeaders.filter(
      h => h.name.toLowerCase() !== "set-cookie"
    );
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["*://www.youtube-nocookie.com/*"] },
  ["blocking", "responseHeaders"]
);

// On settings change:
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (
    changes.download_policy ||
    changes.notifications_allowed ||
    changes.cc_load_policy
  )) {
    getCurrentStateAndRebuildMenus();
  }
});


//handle contextMenu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-options") { //Open Settings
    // Open the options page in a popup window (400x600 is a nice size, adjust as needed)
    browser.windows.create({
      url: browser.runtime.getURL("options.html"),
      type: "popup",
      width: 500,
      height: 800,
      top: 100,
      left: 100
    });
  }
  else if (info.menuItemId === "toggle-subtitles") {
    // Read current state
    browser.storage.local.get({ cc_load_policy: 1 }).then(result => {
      const current = result.cc_load_policy === 1;
      const next = current ? 0 : 1; // Toggle
      // Save new state
      browser.storage.local.set({ cc_load_policy: next });
      // Update menu title accordingly
      browser.contextMenus.update("toggle-subtitles", {
        title: next ? "Turn Subtitles Off" : "Turn Subtitles On"
      });
    });
  }
  else if (info.menuItemId === "url-github") {
    browser.tabs.create({
      url: "https://github.com/CCypri3n/YoutubeRedirect"
    });
  }
  else if (info.menuItemId === "download-video") {
    if (tab.url.includes("youtube.com/watch") || tab.url.includes("youtube-nocookie.com")) {
      console.log(`Download context clicked, running download.js on ${tab.id}`);
      browser.tabs.executeScript(tab.id, { file: "download.js" })
        .catch(err => console.error("Failed to inject download script:", err));
    } 
    else {
      notify("Download not applicable", "This extension only works on youtube.com and youtube-nocookie.com.");
      console.log("This download button only works on YouTube or youtube-nocookie video pages.");
    }
  }
  else if (info.menuItemId === "toggle-notifications") {
    browser.storage.local.get({ notifications_allowed: 1 }).then(result => {
      const current = result.notifications_allowed === 1;
      const next = current ? 0 : 1; // Toggle
      // Save new state
      browser.storage.local.set({ notifications_allowed: next });
      // Update menu title accordingly
      browser.contextMenus.update("toggle-notifications", {
        title: next ? "Do Not Disturb" : "Do Disturb"
      });
    });
  }
  else if (info.menuItemId === "open-in-new-tab" || info.menuItemId === "open-in-current-tab") {
    console.log("Context-click on URL: "+info.linkUrl)
    if (info.linkUrl.includes("youtube.com/watch")) {
      const params = new URLSearchParams(info.linkUrl.split('?')[1]);
      const videoId = params.get('v');
      console.log("VideoId"+videoId+params+ typeof info.linkUrl)
      if (videoId) {
        const options = browser.storage.local.get({
          hl: 'en',
          cc_lang: 'en',
          cc_load_policy: 1,
          theme: 'dark',
          preserve_timestamp: 0,
          tab_history: 0,
        }).then((result) => {
          const targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}?wmode=transparent&iv_load_policy=3&autoplay=1&html5=1&showinfo=0&rel=0&modestbranding=1&playsinline=0&theme=${result.theme}&hl=${result.hl}&cc_lang_pref=${result.cc_lang}&cc_load_policy=${result.cc_load_policy}`;
         console.log(`targetUrl: ${targetUrl}`);

          if (info.menuItemId === "open-in-current-tab") {
            browser.tabs.update({url: targetUrl})
          }
          else {
            browser.tabs.create({url: targetUrl})
          }
    })}}}});


// Listener for the "actionclick"
browser.browserAction.onClicked.addListener((tab) => {
  if (tab.url.includes("youtube.com/watch") || tab.url.includes("youtube-nocookie.com")) {
    console.log(`Button clicked, running redirect.js on ${tab.id}`);
    redirectYouTubeTab(tab.id);
  } else {
    notify("Extension not applicable", "This extension only works on youtube.com and youtube-nocookie.com.");
    console.log("This button only works on YouTube or youtube-nocookie video pages.");
  }
});

// Listener for messages from other scripts
browser.runtime.onMessage.addListener((message, sender, sendReponse) => {
    if (message.log) {
      console.log("From content script:", message.log);
    }
    else if (message.notify) {
        const title = message.notify;
        const content = message.content;
        notify(title, content);
    }
    else if (message.action === "open-download-tab" && message.videoId) {
      browser.tabs.create({
        url: `https://notube.lol/?video=${encodeURIComponent(message.videoId)}`
      });
    }
    if (message.action === "rebuild-context-menus") {
      getCurrentStateAndRebuildMenus();
    }
  })

// Listener for install / updates
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open the options/settings page when the extension is first installed
    if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage();
    } else {
      window.open(browser.runtime.getURL("options.html"));
    }
  }
});
