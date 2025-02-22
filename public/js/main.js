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
});

// Function to initialize search functionality
function initializeSearch() {
  const searchBar = document.getElementById('scriptSearch');
  const scriptItems = document.querySelectorAll('.script-item');
  const categories = document.querySelectorAll('.category-card');
  const sections = document.querySelectorAll('.category-card h3');

  if (!searchBar) return; // Exit if search bar doesn't exist

  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let hasVisibleItems = false;
    
    scriptItems.forEach(item => {
      const scriptName = item.querySelector('code').textContent.toLowerCase();
      const metadata = item.querySelector('.script-metadata')?.textContent.toLowerCase() || '';
      const matches = scriptName.includes(searchTerm) || metadata.includes(searchTerm);
      item.style.display = matches ? 'block' : 'none';
      if (matches) hasVisibleItems = true;
    });

    // Show/hide sections based on visible items
    sections.forEach(section => {
      const nextElement = section.nextElementSibling;
      if (nextElement) {
        const visibleItems = nextElement.querySelectorAll('.script-item').length > 0 &&
          Array.from(nextElement.querySelectorAll('.script-item'))
            .some(item => item.style.display !== 'none');
        section.style.display = visibleItems ? 'block' : 'none';
      }
    });

    // Show/hide categories based on visible items
    categories.forEach(category => {
      const visibleItems = category.querySelectorAll('.script-item').length > 0 &&
        Array.from(category.querySelectorAll('.script-item'))
          .some(item => item.style.display !== 'none');
      category.style.display = visibleItems ? 'block' : 'none';
    });
  });
}

// Export the search initialization function
export { initializeSearch };








