// notube-inject.js

(function() {
    // Wait for the DOM to load (Wait for the whole HTML-Webpage to be loaded)
    document.addEventListener("DOMContentLoaded", () => {
      // Get the video ID from URL query
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('video');
      if (videoId) {
        const options = browser.storage.local.get({
            download_format: 'mp4',
          }).then(options => {
        // Fill form fields
        const keyword = document.getElementById("keyword");
        if (keyword) keyword.value = `https://youtube.com/watch?v=${videoId}`;
  
        // Select format in dropdown
        const dropdown = document.getElementById("myDropdown");
        if (dropdown) dropdown.value = options.download_format;

        const submitBtn = document.getElementById("submit-button");
        if (submitBtn) submitBtn.click();

        });
      };
    });
})()