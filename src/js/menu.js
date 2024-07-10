import renderliquid from './renderliquid.js';

export default function menu() {
  const menu = document.querySelector('.util-menu');
  const expand = menu && menu.querySelector('.expand');
  const menuItems = menu && menu.querySelectorAll('.menu-item');

  expand && expand.addEventListener('click', e => {
    let menu = expand.closest('.util-menu');
    if (menu.classList.contains('expanded')) {
      menu.classList.remove('expanded');
      localStorage.setItem('menuopen', false);
    }
    else {
      menu.classList.add('expanded');
      localStorage.setItem('menuopen', true);
    }
  });

  menuItems && menuItems.forEach(item => {
    item.addEventListener('click', async e => {
      e.preventDefault();
      loadPage(item.getAttribute('data-file'));
    });
  });
}

export async function loadPage(file) {
  if (document.querySelector(`.menu-item[data-file="${file}"]`).getAttribute('aria-selected') == 'true') {
    return;
  }
  let options = file == 'files' ? await ico.getFiles() : await storage.getAll();
  renderliquid(file, options, document.getElementById('main-container'));
  document.querySelector(`.menu-item[aria-selected="true"]`).setAttribute('aria-selected', 'false');
  document.querySelector(`.menu-item[data-file="${file}"]`).setAttribute('aria-selected', 'true');
  document.title = file == 'index' ? `Image Converter and Optimizer` : `${file.charAt(0).toUpperCase() + file.slice(1)} | Image Converter and Optimizer`;
}