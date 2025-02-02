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
  var text = `curl -s ${url} | bash -s -- `;

  navigator.clipboard.writeText(text)
    .then(function () {
      smallPopUpBox(`Copied!`, x, y);
    }, function () {
      alert('Failed to copy text');
    });
}

export function updateColor(value) {
  document.documentElement.style.setProperty('--primary-color', value);
  setColorScheme(document.documentElement, value);
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

export function rgbToHex(r, g, b) {
  // Convert RGB components to hex
  const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

export function darkenRgb(r, g, b, percent) {
  // Calculate darkening factor
  const factor = 1 - (percent / 100);

  // Darken each component
  const newR = Math.max(Math.round(r * factor), 0);
  const newG = Math.max(Math.round(g * factor), 0);
  const newB = Math.max(Math.round(b * factor), 0);

  // Return the new RGB object
  return { newR, newG, newB };
}

export function toDarkHex(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const { newR, newG, newB } = darkenRgb(r, g, b, percent);
  return rgbToHex(newR, newG, newB);
}

export function isDarkHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

export function setColorScheme(root, currentPrimaryColor) {

  if (isDarkHex(currentPrimaryColor)) {
    root.style.setProperty('--primary-color', currentPrimaryColor);
    root.style.setProperty('--secondary-color', toDarkHex(currentPrimaryColor, 70)); // Shadow and borders
    root.style.setProperty('--accent-color', '#000000');  //Button background
    root.style.setProperty('--text-color', '#FFFFFF');
    root.style.setProperty('--content-text-color', '#000000');
    root.style.setProperty('--background-color', toDarkHex(currentPrimaryColor, -70));
  } else {
    root.style.setProperty('--primary-color', currentPrimaryColor);
    root.style.setProperty('--secondary-color', toDarkHex(currentPrimaryColor, -70));
    root.style.setProperty('--accent-color', '#000000');
    root.style.setProperty('--text-color', '#000000');
    root.style.setProperty('--content-text-color', '#FFFFFF');
    root.style.setProperty('--background-color', toDarkHex(currentPrimaryColor, 70));
  }

  saveColorScheme(root);
}