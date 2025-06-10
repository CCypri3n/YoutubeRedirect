let apiKeyVisible = false;
let storedApiKey = "";

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('download_policy').addEventListener('change', updateDownloadOptionsVisibility);
  document.querySelectorAll(
    '#hl, #cc_lang, #cc_load_policy, #theme, #notifications_allowed, #download_policy, #download_format, #preserve_timestamp, #tab_history, #privatube'
  ).forEach(el => {
    el.addEventListener('change', saveOptions);
  });

  // Toggle API key visibility
  document.getElementById('toggleApiKeyBtn').addEventListener('click', function() {
    apiKeyVisible = !apiKeyVisible;
    updateApiKeyInputVisibility();
  });

  restoreOptions();
});

document.getElementById('privatube').addEventListener('change', function() {
  document.getElementById('playerLabel').textContent = this.checked ? "PrivaTube" : "Nocookie";
});


// API KEY HANDLING

document.getElementById('saveApiKeyBtn').addEventListener('click', function() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) {
    showApiKeyToast('API key cannot be empty.', true);
    return;
  }
  const testResp = fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=dQw4w9WgXcQ&key=${apiKey}`
        ).then(response => {
    if (!response.ok) {
      showApiKeyToast('Invalid API key or poor connection.', true);
      return
    }
  browser.storage.local.set({ api_key: apiKey }).then(() => {
    showApiKeyToast('API key saved!');
    storedApiKey = apiKey;
    updateApiKeyInputVisibility();
  });
  })
});

function showApiKeyToast(message, isError) {
  const status = document.getElementById('apiKeyStatus');
  status.textContent = message;
  status.style.background = isError ? '#b2002d' : 'crimson';
  status.classList.add('show');
  clearTimeout(status._timeout);
  status._timeout = setTimeout(() => {
    status.classList.remove('show');
  }, 1800);
}


// Update the API key input's visibility and placeholder
function updateApiKeyInputVisibility() {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const toggleBtn = document.getElementById('toggleApiKeyBtn');
  apiKeyInput.type = apiKeyVisible ? "text" : "password";
  toggleBtn.textContent = apiKeyVisible ? "Hide" : "Show";
  if (!apiKeyInput.value && storedApiKey) {
    apiKeyInput.placeholder = apiKeyVisible ? storedApiKey : "••••••••••••••••";
  } else if (!storedApiKey) {
    apiKeyInput.placeholder = "(not set)";
  }
}

function saveOptions() {
  const hl = document.getElementById('hl').value;
  const cc_lang = document.getElementById('cc_lang').value;
  const cc_load_policy = document.getElementById('cc_load_policy').checked ? 1 : 0;
  const theme = document.getElementById('theme').value;
  const notifications_allowed = document.getElementById('notifications_allowed').checked ? 1 : 0;
  const download_policy = document.getElementById('download_policy').checked ? 1 : 0;
  const download_format = document.getElementById('download_format').value;
  const preserve_timestamp = document.getElementById('preserve_timestamp').checked ? 1 : 0;
  const tab_history = document.getElementById('tab_history').checked ? 1 : 0;
  const privatube = document.getElementById('privatube').checked ? 1 : 0;

  // Use the input value if set, otherwise keep the stored key
  const api_key = document.getElementById('apiKeyInput').value || storedApiKey;

  browser.storage.local.set({
    hl, cc_lang, cc_load_policy, theme, notifications_allowed,
    download_policy, download_format, preserve_timestamp, tab_history, api_key, privatube
  }).then(() => {
    const status = document.getElementById('status');
    showToast('Settings saved!');
    browser.runtime.sendMessage({ action: "rebuild-context-menus" });
    if (window.opener) {
      window.close();
    } else {
      setTimeout(() => { status.textContent = ''; }, 2000);
    }
  });
  browser.runtime.sendMessage({
    log: `Options updated to ${hl + cc_lang + cc_load_policy + theme + notifications_allowed + download_policy + download_format + preserve_timestamp + tab_history + privatube}`
  });
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
    api_key: "",
    privatube: 1,
  }).then((result) => {
    document.getElementById('hl').value = result.hl;
    document.getElementById('cc_lang').value = result.cc_lang;
    document.getElementById('cc_load_policy').checked = !!result.cc_load_policy;
    document.getElementById('theme').value = result.theme;
    document.getElementById('notifications_allowed').checked = !!result.notifications_allowed;
    document.getElementById('download_policy').checked = !!result.download_policy;
    document.getElementById('download_format').value = result.download_format;
    document.getElementById('tab_history').checked = !!result.tab_history;
    document.getElementById('preserve_timestamp').checked = !!result.preserve_timestamp;
    document.getElementById('privatube').checked = !!result.privatube;
    document.getElementById('playerLabel').textContent = document.getElementById('privatube').checked ? "PrivaTube" : "Nocookie";

    storedApiKey = result.api_key || "";
    document.getElementById('apiKeyInput').value = "";
    updateApiKeyInputVisibility();

    browser.runtime.sendMessage({ action: "rebuild-context-menus" });
    updateDownloadOptionsVisibility();
  });
}

function updateDownloadOptionsVisibility() {
  const val = document.getElementById('download_policy').checked ? 1 : 0;
  document.getElementById('downloadOptions').style.display = (val === 1) ? 'block' : 'none';
}

function showToast(message) {
  const status = document.getElementById('status');
  status.innerHTML = `<span class="checkmark">&#10003;</span>${message}`;
  status.classList.add('show');
  clearTimeout(status._timeout);
  status._timeout = setTimeout(() => {
    status.classList.remove('show');
  }, 1800);
}