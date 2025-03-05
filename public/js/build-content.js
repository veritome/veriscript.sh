import * as helpers from './helpers.js';
import { copyToClipboard } from './helpers.js';
import { contentConfig } from './content-config.js';

function displayCodeViewer(codePopoverContainer, codeContent, url, fileFormat) {
  fetch(url)
    .then(response => response.text())
    .then(text => {
      let highlightLang = 'bash';
      switch (fileFormat) {
        case 'py':
          highlightLang = 'language-python';
          break;
        case 'js':
          highlightLang = 'language-javascript';
          break;
        default:
          highlightLang = 'language-bash';
      }

      codeContent.classList.add(highlightLang);
      codeContent.textContent = text;
      codePopoverContainer.style.display = 'block';

      hljs.highlightAll();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to load file content');
    });
}

function createScriptItem(script) {
  const scriptItem = document.createElement('div');
  scriptItem.className = 'script-item';

  const leftContent = document.createElement('div');
  const codeElement = document.createElement('code');
  codeElement.setAttribute('name', script.path);
  codeElement.setAttribute('data-file-format', script.format);
  codeElement.textContent = script.name;

  leftContent.appendChild(codeElement);

  const rightContent = document.createElement('div');
  const eyeIcon = document.createElement('i');
  eyeIcon.className = 'fa-regular fa-eye icon-right-padding';
  eyeIcon.setAttribute('name', script.path);
  
  const clipboardIcon = document.createElement('i');
  clipboardIcon.className = 'fa-regular fa-clipboard icon-right-padding';
  clipboardIcon.setAttribute('name', script.path);
  
  const downloadIcon = document.createElement('i');
  downloadIcon.className = 'fa-solid fa-download';
  downloadIcon.setAttribute('name', script.path);

  rightContent.appendChild(eyeIcon);
  rightContent.appendChild(clipboardIcon);
  rightContent.appendChild(downloadIcon);

  scriptItem.appendChild(leftContent);
  scriptItem.appendChild(rightContent);

  return scriptItem;
}

function createSection(section) {
  const sectionTitle = document.createElement('h3');
  sectionTitle.id = section.id;
  sectionTitle.textContent = section.title;

  const scriptContainer = document.createElement('div');
  section.scripts.forEach(script => {
    scriptContainer.appendChild(createScriptItem(script));
  });

  return [sectionTitle, scriptContainer];
}

function createCategory(category) {
  const categoryCard = document.createElement('div');
  categoryCard.className = 'category-card';
  categoryCard.id = category.id;

  const title = document.createElement('h2');
  title.className = 'category-title';
  title.textContent = category.title;

  const scriptList = document.createElement('div');
  scriptList.className = 'script-list';

  categoryCard.appendChild(title);
  categoryCard.appendChild(scriptList);

  category.sections.forEach(section => {
    const [sectionTitle, sectionContent] = createSection(section);
    scriptList.appendChild(sectionTitle);
    scriptList.appendChild(sectionContent);
  });

  return categoryCard;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('fileTreeContainer');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Generate content from config
  contentConfig.categories.forEach(category => {
    container.appendChild(createCategory(category));
  });

  // Set up click handlers for view icons
  document.querySelectorAll('.fa-eye').forEach(icon => {
    icon.addEventListener('click', (e) => {
      const scriptPath = e.target.getAttribute('name');
      const format = e.target.closest('.script-item').querySelector('code').getAttribute('data-file-format');
      const codePopoverContainer = document.getElementById('codePopoverContainer');
      const codeContent = document.getElementById('codeContent');
      displayCodeViewer(codePopoverContainer, codeContent, scriptPath, format);
    });
  });

  // Set up click handlers for clipboard icons
  document.querySelectorAll('.fa-clipboard').forEach(icon => {
    icon.addEventListener('click', (e) => {
      const scriptPath = e.target.getAttribute('name');
      const rect = e.target.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top;
      const scriptUrl = window.location.origin + '/' + scriptPath;
      copyToClipboard(scriptUrl, x, y);
    });
  });
  
  // Set up click handlers for download icons
  document.querySelectorAll('.fa-download').forEach(icon => {
    icon.addEventListener('click', (e) => {
      const scriptPath = e.target.getAttribute('name');
      const scriptUrl = window.location.origin + '/' + scriptPath;
      const rect = e.target.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top;
      
      // Create a temporary anchor element to trigger the download
      fetch(scriptUrl)
        .then(response => response.text())
        .then(content => {
          const element = document.createElement('a');
          const fileName = scriptPath.split('/').pop();
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          element.setAttribute('href', url);
          element.setAttribute('download', fileName);
          element.style.display = 'none';
          
          document.body.appendChild(element);
          element.click();
          
          // Clean up
          document.body.removeChild(element);
          URL.revokeObjectURL(url);
          
          smallPopUpBox('Downloaded!', x, y);
        })
        .catch(error => {
          console.error('Error downloading script:', error);
          smallPopUpBox('Download failed!', x, y);
        });
    });
  });

  document.documentElement.addEventListener('click', (e) => {
    // Only close if clicking outside the code content
    if (e.target.id !== 'codeContent') {
      document.getElementById('codePopoverContainer').style.display = 'none';
      document.getElementById('codeContent').removeAttribute('data-highlighted');
      
    }
  });
});
