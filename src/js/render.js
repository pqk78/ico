const render = async (file, options, target) => {
  try {
    let html = await liquid.render(file, options);
    const load = () => {
      target.innerHTML = html;
      target.classList.remove('loading');
      target.classList.add('loaded');
    }
    if (target.classList.contains('loading')) {
      load()
    }
    else {
      target.classList.remove('loaded');
      target.classList.add('loading');
      setTimeout(load, 100);
    }
  } catch (err) {
    console.error(err)
  }
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
    calls.push(render(el.getAttribute('data-file'), options, el.parentElement));
  });

  try {
    await Promise.all(calls);
  } catch (err) {
    console.error(err);
  }

  setTimeout(() => {
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
      link.addEventListener('click', e => {
        e.preventDefault();
        if (link.hasAttribute('aria-current')) {
          return;
        }
        render(link.getAttribute('data-file'), options, document.getElementById('main-container'));
        menu.querySelector('[aria-current]').removeAttribute('aria-current');
        link.setAttribute('aria-current', 'page');
      });
    });
  }, 250);

  

});