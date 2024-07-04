import renderliquid from "./renderliquid.js";
// const render = async (file, options, target) => {
//   try {
//     let html = await liquid.render(file, options);
//     const load = (file) => {
//       target.innerHTML = html;
//       target.classList.remove('loading');
//       target.classList.add('loaded');
//       callbacks[file] && callbacks[file]();
//     }
//     if (target.classList.contains('loading')) {
//       load(file);
//     }
//     else {
//       target.classList.remove('loaded');
//       target.classList.add('loading');
//       setTimeout(load, 100, file);
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }

document.addEventListener('DOMContentLoaded', async e => {
  let options = await storage.getAll();
  let page = new URL(window.location.href);
  options.page = {
    pathname: page.pathname
  };
  options.menuopen = localStorage.getItem('menuopen') == 'true' ? 'expanded' : '';

  document.querySelectorAll('liquid').forEach(el => {
    renderliquid(el.getAttribute('data-file'), options, el.parentElement)
  });
});