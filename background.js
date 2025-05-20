// background.js

// Add quick access to settings in context menu
browser.contextMenus.create({
  id: "open-options",
  title: "Open Settings",
  contexts: ["browser_action"]
});

// Toggle the context menu for the subtitles
function createOrUpdateSubtitleMenu(enabled) {
  const title = enabled ? "Turn Subtitles Off" : "Turn Subtitles On";
  browser.contextMenus.create({
    id: "toggle-subtitles",
    title: title,
    contexts: ["browser_action"], // or "action" for MV3
  });
}

// On extension startup, create the menu based on stored value
browser.storage.local.get({ cc_load_policy: 1 }).then(result => {
  createOrUpdateSubtitleMenu(result.cc_load_policy === 1);
});


//handle contextMenu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-options") { //Open Settings
    // Open the options page
    if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage();
    } else {
      window.open(browser.runtime.getURL("options.html"));
    }
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


browser.browserAction.onClicked.addListener((tab) => {
  if (tab.url.includes("youtube.com/watch") || tab.url.includes("youtube-nocookie.com")) {
    console.log(`Button clicked, running redirect.js on ${tab.id}`);
    redirectYouTubeTab(tab.id);
  } else {
    notify("Extension not applicable", "This extension only works on youtube.com and youtube-nocookie.com.");
    console.log("This button only works on YouTube or youtube-nocookie video pages.");
  }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.log) {
      console.log("From content script:", message.log);
    }
    else if (message.notify) {
        const title = message.notify;
        const content = message.content;
        notify(title, content);
    }
  });