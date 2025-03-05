export function footer() {
  const footer = document.getElementById('footer');
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `<p> &copy; ${currentYear} - veriscript - All rights reserved.</p>`;
}

export function warningPopover(popover, popoverContainer) {
  if (localStorage.getItem('veriscript-warnBtnEver') === 'true') {
    popoverContainer.remove();
    return;
  }

  popover.classList.add('slide-in-elliptic-top-fwd');

  document.addEventListener('click', () => {
    if (popover) {
      popover.classList.remove('pulsate-fwd');
      popover.classList.add('roll-out-blurred-left');

      setTimeout(() => {
        popoverContainer.remove();
      }, 1000);
    }
  }, { once: true });

  setTimeout(() => {
    popover.classList.remove('slide-in-elliptic-top-fwd');
    popover.classList.add('pulsate-fwd');
  }, 800);
}

export function smallPopUpBox(text, x, y, exitTime = 1000) {
  // Create floating text container
  const floatingText = document.createElement('div');
  floatingText.style.cssText = `
    position: fixed;
    top: ${y}px;
    left: ${x}px;
    transform: translate(-50%, -50%);
    background-color: var(--primary-color);
    padding: 15px 30px;
    font-family: "veriscriptfont", sans-serif;
    font-size: 1.2em;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  // Add text content
  floatingText.textContent = text;

  // Add to document
  document.body.appendChild(floatingText);

  // Fade in
  setTimeout(() => {
    floatingText.style.opacity = '1';
  }, 100);

  // Remove after delay
  setTimeout(() => {
    floatingText.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, 300);
  }, exitTime);
}