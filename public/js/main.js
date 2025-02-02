import * as components from './components.js';
import * as helpers from './helpers.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const root = document.documentElement;
  const primaryColor = localStorage.getItem('veriscript-primaryColor') || '#c26161';

  helpers.setColorScheme(root, primaryColor);

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








