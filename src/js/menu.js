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
      if (item.getAttribute('aria-selected') === 'true') {
        return;
      }
      let options = await storage.getAll();
      renderliquid(item.getAttribute('data-file'), options, document.getElementById('main-container'));
      menu.querySelector('[aria-selected="true"]').setAttribute('aria-selected', 'false');
      item.setAttribute('aria-selected', 'true');
    });
  });
}