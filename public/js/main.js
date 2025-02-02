import * as components from './components.js';
import * as helpers from './helpers.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', localStorage.getItem('veriscript-primaryColor') || '#0ca733');
  root.style.setProperty('--secondary-color', localStorage.getItem('veriscript-secondaryColor') || '#000000');
  root.style.setProperty('--accent-color', localStorage.getItem('veriscript-accentColor') || '#ff9900');
  root.style.setProperty('--text-color', localStorage.getItem('veriscript-textColor') || '#000000');
  root.style.setProperty('--background-color', localStorage.getItem('veriscript-backgroundColor') || '#ffffff');


  components.footer();

  const popoverContainer = document.getElementById('initialPopoverContainer');
  const popover = document.getElementById('initialPopover');
  components.warningPopover(popover, popoverContainer);

  document.getElementById('resetPrefsBtn').addEventListener('click', () => {
    helpers.deleteLocalStorage();
  });

  document.getElementById('colorPicker').addEventListener('change', (event) => {
    helpers.updateColor(event.target.value);
  });

  document.getElementById('warnBtnEver')?.addEventListener('click', (event) => {
    helpers.acknowledgeWarning(event.target);
  });

});







