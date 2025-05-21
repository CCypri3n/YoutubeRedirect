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
  const preserve_timestamp = document.getElementById('preserve_timestamp').value;
  const tab_history = document.getElementById('tab_history').value;

  browser.storage.local.set({ hl, cc_lang, cc_load_policy, theme, notifications_allowed, download_policy, download_format, preserve_timestamp, tab_history }).then(() => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    browser.runtime.sendMessage({ action: "rebuild-context-menus" });
    const close_settings = document.getElementById('close_settings').checked;
    browser.runtime.sendMessage({ log: `${close_settings}`})
    if (close_settings) {
      window.close();
    }
    else {
      setTimeout(() => {
      status.textContent = '';
    }, 2000);
    }
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
    preserve_timestamp: 1,
    tab_history: 1,
  }).then((result) => {
    document.getElementById('hl').value = result.hl;
    document.getElementById('cc_lang').value = result.cc_lang;
    document.getElementById('cc_load_policy').value = result.cc_load_policy;
    document.getElementById('theme').value = result.theme;
    document.getElementById('notifications_allowed').value = result.notifications_allowed;
    document.getElementById('download_policy').value = result.download_policy;
    document.getElementById('download_format').value = result.download_format;
    document.getElementById('tab_history').value = result.tab_history;
    document.getElementById('preserve_timestamp').value = result.preserve_timestamp;
    browser.runtime.sendMessage({ action: "rebuild-context-menus" });; // <- THIS ENSURES VISIBILITY IS UPDATED
    updateDownloadOptionsVisibility();
  });
}

function updateDownloadOptionsVisibility() {
  const val = Number(document.getElementById('download_policy').value);
  document.getElementById('downloadOptions').style.display = (val === 1) ? 'block' : 'none';
}
