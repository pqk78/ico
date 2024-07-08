export default function common() {
  const scripts = document.querySelectorAll('script');
  const dialogClose = document.querySelectorAll('.dialog-close');
  const dialogOpen = document.querySelectorAll('.dialog-open');
  const links = document.querySelectorAll('a[href]');
  const tabContent = document.querySelectorAll('.tabs');
  const close = e => {
    e.currentTarget.dialog.close();
  }
  const open = e => {
    e.currentTarget.dialog.showModal();
  }
  const tabsUpdate = e => {
    let tab = e.currentTarget;
    let content = tab.closest('.tabs');
    if (tab.getAttribute('aria-selected') === 'true') {
      return;
    }
    let panel = document.getElementById(tab.getAttribute('aria-controls'));
    let currentTab = content.querySelector('.tab[aria-selected="true"]');
    let currentPanel = document.getElementById(currentTab.getAttribute('aria-controls'));

    currentTab.setAttribute('aria-selected', 'false');
    currentPanel.classList.remove('current');
    tab.setAttribute('aria-selected', 'true');
    panel.classList.add('current');
  }

  scripts.forEach(script => {
    if (!script.getAttribute('src') && script.getAttribute('data-src')) {
      script.setAttribute('src', script.getAttribute('data-src'));
    }
  });

  dialogOpen.forEach(trigger => {
    trigger.dialog = document.getElementById(trigger.getAttribute('data-dialog'));
    trigger.addEventListener('click', open);
  });

  dialogClose.forEach(trigger => {
    trigger.dialog = trigger.closest('dialog');
    trigger.addEventListener('click', close)
  });

  links.forEach(link => {
    link.addEventListener('click', e => {
      console.log('click', link.href)
      e.preventDefault();
      ico.openLink(link.href);
    });
  })

  tabContent.forEach(content => {
    let tabs = content.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', tabsUpdate);
    })
  });
}