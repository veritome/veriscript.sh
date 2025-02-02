import * as helpers from './helpers.js';

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
          highlightLang = 'language-bash';;
      }

      codeContent.classList.add(highlightLang);
      codeContent.textContent = text;
      codePopoverContainer.style.display = 'block';

      hljs.highlightAll(codeContent);

      document.getElementById('closeCode').addEventListener('click', function () {
        codePopoverContainer.style.display = 'none';
        codeContent.removeAttribute('data-highlighted')
      });
      window.addEventListener('click', function (event) {
        codePopoverContainer.style.display = 'none';
        codeContent.removeAttribute('data-highlighted')
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to load file content');
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
  const listings = document.querySelectorAll('.listing');
  const codePopoverContainer = document.getElementById('codePopoverContainer');
  const codeContent = document.getElementById('codeContent');

  // 'listing' is a "list item" element that contains three elements in the following order:
  // 1. A <i> element that will be used to view the endpoint
  // 2. A <code> element that displays the file listing
  // 3. A <i> element that will be used to copy the endpoint

  listings.forEach(listing => {
    const viewIcon = listing.children[0];
    const endpoint = listing.children[1];
    const copyIcon = listing.children[2];

    const url = helpers.getScriptUrl(endpoint.getAttribute('name'));

    viewIcon.addEventListener('click', event => {
      displayCodeViewer(codePopoverContainer, codeContent, url, endpoint.getAttribute('data-file-format'));
    });

    copyIcon.addEventListener('click', event => {
      helpers.copyToClipboard(url, event.clientX, event.clientY);
    });
  });

});
