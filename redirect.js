// redirect.js

(async function() {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('v');
  const currentUrl = window.location.href;

  const options = await browser.storage.local.get({
    hl: 'en',
    cc_lang: 'en',
    cc_load_policy: 1,
    theme: 'dark'
  });

  if (videoId && currentUrl.includes("youtube.com/watch")) {
    const targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}?wmode=transparent&iv_load_policy=3&autoplay=1&html5=1&showinfo=0&rel=0&modestbranding=1&playsinline=0&theme=${options.theme}&hl=${options.hl}&cc_lang_pref=${options.cc_lang}&cc_load_policy=${options.cc_load_policy}`;
    browser.runtime.sendMessage({ log: `targetUrl: ${targetUrl}` });
    window.location.replace(targetUrl);

  } else if (currentUrl.includes("youtube-nocookie.com/embed")) {
    const path = new URL(currentUrl).pathname;
    const videoId = path.split('/embed/')[1];
    if (videoId) {
      const targetUrl = `https://youtube.com/watch?v=${videoId}`;
      browser.runtime.sendMessage({ log: `targetUrl: ${targetUrl}` });
      window.location.replace(targetUrl);
    }
  }
})();
