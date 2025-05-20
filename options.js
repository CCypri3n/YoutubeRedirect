//options.js 

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('saveBtn').addEventListener('click', saveOptions);

  // Set up the change listener for dynamic option visibility
  document.getElementById('download_policy').addEventListener('change', updateDownloadOptionsVisibility);

  restoreOptions(); // Restore all options and update visibility
});

function saveOptions() {
  const hl = document.getElementById('hl').value;
  const cc_lang = document.getElementById('cc_lang').value;
  const cc_load_policy = Number(document.getElementById('cc_load_policy').value);
  const theme = document.getElementById('theme').value;
  const notifications_allowed = document.getElementById('notifications_allowed').value;
  const download_policy = Number(document.getElementById('download_policy').value);
  const download_format = document.getElementById('download_format').value;

  browser.storage.local.set({ hl, cc_lang, cc_load_policy, theme, notifications_allowed, download_policy, download_format, }).then(() => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
      window.close();
    }, 2000);
  });
  browser.runtime.sendMessage({ log: `Options updated to ${hl + cc_lang + cc_load_policy + theme}` });
}

function restoreOptions() {
  browser.storage.local.get({
    hl: 'en',
    cc_lang: 'en',
    cc_load_policy: 1,
    theme: 'dark',
    notifications_allowed: 1,
    download_policy: 0,
    download_format: 'mp4',
  }).then((result) => {
    document.getElementById('hl').value = result.hl;
    document.getElementById('cc_lang').value = result.cc_lang;
    document.getElementById('cc_load_policy').value = result.cc_load_policy;
    document.getElementById('theme').value = result.theme;
    document.getElementById('notifications_allowed').value = result.notifications_allowed;
    document.getElementById('download_policy').value = result.download_policy;
    document.getElementById('download_format').value = result.download_format;
    updateDownloadOptionsVisibility(); // <- THIS ENSURES VISIBILITY IS UPDATED
  });
}

function updateDownloadOptionsVisibility() {
  const val = Number(document.getElementById('download_policy').value);
  document.getElementById('downloadOptions').style.display = (val === 1) ? 'block' : 'none';
}
