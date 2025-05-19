(function() {
  // Extract the video ID from the URL
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('v');
  const currentUrl = window.location.href;
  console.log(`ID:${videoId}`);

  if (videoId && currentUrl.includes("youtube.com/watch")) {
    const theme = 'dark';
    const hl = 'fr';
    const cc_lang = 'fr';

    // Construct your custom URL to redirect to the nocookie embed player
    const targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}?wmode=transparent&iv_load_policy=3&autoplay=1&html5=1&showinfo=0&rel=0&modestbranding=1&playsinline=0&theme=${theme}&hl=${hl}&cc_lang_pref=${cc_lang}`;
    console.log(`Redirect to nocookies:${targetUrl}`);
    // Redirect to the new site
    window.location.replace(targetUrl);

  } else if (currentUrl.includes("youtube-nocookie.com/embed")) {
    // If already on nocookie embed link, optionally redirect back to standard watch URL
    const path = new URL(currentUrl).pathname;
    const videoId = path.split('/embed/')[1];
    console.log(`Fetched VideoId from nocookies:${videoId}`);
    if (videoId) {
      const targetUrl = `https://youtube.com/watch?v=${videoId}`;
      console.log(`Redirect to youtube:${targetUrl}`);
      window.location.replace(targetUrl);
    }
  }
})();
