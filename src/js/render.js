import renderliquid from "./renderliquid.js";
import common from './common.js';
import index from './index.js';
import menu from './menu.js';
import settings from './settings.js';

window.global = {
  callbacks: { common, index, menu, settings }
}

document.addEventListener('DOMContentLoaded', async e => {
  let options = await storage.getAll();
  let page = new URL(window.location.href);
  options.page = {
    pathname: page.pathname
  };
  options.menuopen = localStorage.getItem('menuopen') == 'true' ? 'expanded' : '';

  document.querySelectorAll('liquid').forEach(async el => {
    let file = el.getAttribute('data-file');
    renderliquid(file, options, el.parentElement).then(() => {
    });
  });

  ico.onNavChange(file => {
    renderliquid(file, options, document.getElementById('main-container'));
    document.querySelector(`.menu-item[aria-selected="true"]`).setAttribute('aria-selected', 'false');
    document.querySelector(`.menu-item[data-file="${file}"]`).setAttribute('aria-selected', 'true');
  })
});