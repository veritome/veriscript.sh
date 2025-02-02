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

export function saveColorScheme(root) {
  const primaryColor = root.style.getPropertyValue('--primary-color');
  const secondaryColor = root.style.getPropertyValue('--secondary-color');
  const accentColor = root.style.getPropertyValue('--accent-color');
  const textColor = root.style.getPropertyValue('--text-color');
  const backgroundColor = root.style.getPropertyValue('--background-color');

  localStorage.setItem('veriscript-primaryColor', primaryColor);
  localStorage.setItem('veriscript-secondaryColor', secondaryColor);
  localStorage.setItem('veriscript-accentColor', accentColor);
  localStorage.setItem('veriscript-textColor', textColor);
  localStorage.setItem('veriscript-backgroundColor', backgroundColor);
}

export function deleteLocalStorage() {
  localStorage.clear();
  smallPopUpBox('Preferences reset!', window.innerWidth / 2, window.innerHeight / 2, 1200);
}

export function acknowledgeWarning(button) {
  if (button && button.getAttribute('id') === 'warnBtnEver') {
    localStorage.setItem('veriscript-warnBtnEver', 'true');
  }
}

export function copyToClipboard(url, x, y) {
  var text = `curl --silent ${url} | bash`;

  navigator.clipboard.writeText(text)
    .then(function () {
      smallPopUpBox(`Copied!`, x, y);
    }, function () {
      alert('Failed to copy text');
    });
}

export function updateColor(value) {
  document.documentElement.style.setProperty('--primary-color', value);

  const { r, g, b } = hexToRgb(value);

  let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  const root = document.documentElement;

  if (luminance > 0.5) {
    // console.log("Light mode");
    // Light
    root.style.setProperty('--text-color', '#000000');
    root.style.setProperty('--background-color', '#ffffff');
  } else {
    // console.log("Dark mode");
    // Dark
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--background-color', '#000000');
  }

  saveColorScheme(root);
}

export function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace('#', '');

  // Convert hex to RGB components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return RGB object
  return { r, g, b };
}