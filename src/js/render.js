const render = async (el, options) => {
  let html = await liquid.render(el.getAttribute('data-file'), options);
  el.parentElement.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async e => {
  let calls = [];
  let options = await settings.getAll();
  let page = new URL(window.location.href);
  options.page = {
    pathname: page.pathname
  };
  options.menuopen = localStorage.getItem('menuopen') == 'true' ? 'expanded' : '';

  document.querySelectorAll('liquid').forEach(el => {
    calls.push(render(el, options));
  });

  await Promise.all(calls);

  document.querySelectorAll('script').forEach(script => {
    if (!script.getAttribute('src') && script.getAttribute('data-src')) {
      script.setAttribute('src', script.getAttribute('data-src'));
    }
  });

  document.querySelectorAll('.dialog-open').forEach(trigger => {
    let dialog = document.getElementById(trigger.getAttribute('data-dialog'));
    trigger.addEventListener('click', e => {
      dialog.showModal();
    });
    dialog.querySelectorAll('.dialog-close').forEach(trigger => {
      trigger.addEventListener('click', e => {
        dialog.close();
      })
    })
  });

  const expand = document.querySelector('.util-menu .expand');
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
})