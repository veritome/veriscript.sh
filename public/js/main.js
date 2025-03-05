import * as components from './components.js';
import * as helpers from './helpers.js';

document.addEventListener('DOMContentLoaded', (event) => {
  // Theme handling
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Set initial theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  // Theme toggle button handler
  themeToggle.addEventListener('click', () => {
    helpers.toggleTheme();  // Changed from setColorScheme to toggleTheme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  });

  components.footer();

  const popoverContainer = document.getElementById('initialPopoverContainer');
  const popover = document.getElementById('initialPopover');
  components.warningPopover(popover, popoverContainer);

  document.getElementById('resetPrefsBtn').addEventListener('click', () => {
    helpers.deleteLocalStorage();
    location.reload();
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








