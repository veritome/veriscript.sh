import { smallPopUpBox } from './components.js';

export function getScriptUrl(endpoint) {
  if (window.location.hostname === 'veriscript.sh') {
    return `https://veriscript.sh/${endpoint}`;
  } else if (window.location.hostname === 'veriscript.pages.dev') {
    return `https://veriscript.pages.dev/${endpoint}`;
  } else {
    return `http://localhost:5500/${endpoint}`;
  }
}

export function deleteLocalStorage() {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  smallPopUpBox('Preferences reset!', window.innerWidth / 2, window.innerHeight / 2, 1200);
}

export function acknowledgeWarning(button) {
  if (button && button.getAttribute('id') === 'warnBtnEver') {
    localStorage.setItem('veriscript-warnBtnEver', 'true');
  }
}

export function copyToClipboard(url, x, y) {
  var text = `curl -s ${url} | bash -s -- `;

  navigator.clipboard.writeText(text)
    .then(function () {
      smallPopUpBox(`Copied!`, x, y);
    }, function () {
      alert('Failed to copy text');
    });
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}