(function() {
    // Extract the video ID from the URL
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const theme = 'dark';
    const hl = 'fr';
    const cc_lang = 'fr';
    if (videoId) {
      // Construct your custom URL
      const targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}?wmode=transparent&iv_load_policy=3&autoplay=1&html5=1&showinfo=0&rel=0&modestbranding=1&playsinline=0&theme=${theme}&hl=${hl}&cc_lang_pref=${cc_lang}`;
      // Redirect to the new site
      window.location.replace(targetUrl);
    }
  })();