import renderliquid from './renderliquid.js';

export default function menu() {
  const menu = document.querySelector('.util-menu');
  const expand = menu && menu.querySelector('.expand');
  const menulinks = menu && menu.querySelectorAll('a');

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

  menulinks && menulinks.forEach(link => {
    link.addEventListener('click', async e => {
      e.preventDefault();
      if (link.hasAttribute('aria-current')) {
        return;
      }
      let options = await storage.getAll();
      renderliquid(link.getAttribute('data-file'), options, document.getElementById('main-container'));
      menu.querySelector('[aria-current]').removeAttribute('aria-current');
      link.setAttribute('aria-current', 'page');
    });
  });
}