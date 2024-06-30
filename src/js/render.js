const liquid_elements = document.querySelectorAll('liquid');
const scripts = document.querySelectorAll('script');

document.addEventListener('DOMContentLoaded', e => {
    liquid_elements.forEach(async el => {
        let file = el.getAttribute('data-file');
        let options = await settings.getAll();
        liquid.render(file, options).then(html => {
            el.parentElement.innerHTML = html;
            scripts.forEach(script => {
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
        });
    });
})