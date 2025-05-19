// background.js

function redirectYouTubeTab(tabId) {
  browser.tabs.executeScript(tabId, { file: "redirect.js" })
    .catch(err => console.error("Failed to inject script:", err));
}

browser.browserAction.onClicked.addListener((tab) => {
  if (tab.url.includes("youtube.com/watch") || tab.url.includes("youtube-nocookie.com")) {
    console.log(`Button clicked, running redirect.js on ${tab.id}`);
    redirectYouTubeTab(tab.id);
  } else {
    console.log("This button only works on YouTube or youtube-nocookie video pages.");
  }
});
