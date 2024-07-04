import index from './index.js';
import menu from './menu.js';
import settings from './settings.js';

const common = () => {
  const scripts = document.querySelectorAll('script');
  const dialogClose = document.querySelectorAll('.dialog-dlose');
  const dialogOpen = document.querySelectorAll('.dialog-open');
  const close = (e, dialog) => {
    dialog.close();
  }
  const open = (e, dialog) => {
    dialog.showModal();
  }

  scripts.forEach(script => {
    if (!script.getAttribute('src') && script.getAttribute('data-src')) {
      script.setAttribute('src', script.getAttribute('data-src'));
    }
  });

  dialogOpen.forEach(trigger => {
    let dialog = document.getElementById(trigger.getAttribute('data-dialog'));
    trigger.addEventListener('click', open, dialog);
  });

  dialogClose.forEach(trigger => {
    let dialog = trigger.closest('dialog');
    trigger.addEventListener('click', close, dialog)
  })
}

export { index, common, menu, settings }