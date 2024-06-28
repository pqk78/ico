const liquid_elements = document.querySelectorAll('liquid');
const scripts = document.querySelectorAll('script');

document.addEventListener('DOMContentLoaded', e => {
    liquid_elements.forEach(el => {
        let file = el.getAttribute('data-file');
        liquid.render(file).then(html => {
            el.parentElement.innerHTML = html;
            scripts.forEach(script => {
                if (!script.getAttribute('src') && script.getAttribute('data-src')) {
                    script.setAttribute('src', script.getAttribute('data-src'));
                }
            });
        });
    });
})