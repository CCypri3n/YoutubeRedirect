// download.js

(function() {
    const params = new URLSearchParams(window.location.search);
    let videoId = params.get('v');
    let currentUrl = window.location.href;

    // If not found, try to extract from embed URL
    if (!videoId && currentUrl.includes('/embed/')) {
        const path = new URL(currentUrl).pathname;
        videoId = path.split('/embed/')[1];
    }

    if (videoId) {
        // Ask background to open the download page
        browser.runtime.sendMessage({
            action: "open-download-tab",
            videoId: videoId
        });
    }
})();
