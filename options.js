document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);

function saveOptions() {
  const hl = document.getElementById('hl').value;
  const cc_lang = document.getElementById('cc_lang').value;
  const cc_load_policy = Number(document.getElementById('cc_load_policy').value); // convert to number
  const theme = document.getElementById('theme').value;
  const notifications_allowed = document.getElementById('notifications_allowed').value;

  browser.storage.local.set({ hl, cc_lang, cc_load_policy, theme, notifications_allowed}).then(() => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
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
    notifications_allowed: 1
  }).then((result) => {
    document.getElementById('hl').value = result.hl;
    document.getElementById('cc_lang').value = result.cc_lang;
    document.getElementById('cc_load_policy').value = result.cc_load_policy;
    document.getElementById('theme').value = result.theme;
    document.getElementById('notifications_allowed').value = result.notifications_allowed;
  });
}
