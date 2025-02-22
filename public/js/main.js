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

  // Search functionality
  const searchBar = document.getElementById('scriptSearch');
  const scriptItems = document.querySelectorAll('.script-item');
  const categories = document.querySelectorAll('.category-card');
  const sections = document.querySelectorAll('.category-card h3');

  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let hasVisibleItems = false;
    
    scriptItems.forEach(item => {
      const scriptName = item.querySelector('code').textContent.toLowerCase();
      const metadata = item.querySelector('.script-metadata')?.textContent.toLowerCase() || '';
      const matches = scriptName.includes(searchTerm) || metadata.includes(searchTerm);
      item.style.display = matches ? '' : 'none';
      if (matches) hasVisibleItems = true;
    });

    // Show/hide sections based on visible items
    sections.forEach(section => {
      const nextElement = section.nextElementSibling;
      const visibleItems = nextElement.querySelectorAll('.script-item[style=""]').length;
      section.style.display = visibleItems > 0 ? '' : 'none';
    });

    // Show/hide categories based on visible items
    categories.forEach(category => {
      const visibleItems = category.querySelectorAll('.script-item[style=""]').length;
      category.style.display = visibleItems > 0 ? '' : 'none';
    });
  });

});








