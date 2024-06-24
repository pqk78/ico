const liquid_elements = document.querySelectorAll('liquid');
const scripts = document.querySelectorAll('script');

document.addEventListener('DOMContentLoaded', e => {
    fetch('./settings.json')
        .then(response => response.json())
        .then(data => {
            liquid_elements.forEach(el => {
                let file = el.getAttribute('data-file');
                utils.liquid(file, data).then(html => {
                    el.parentElement.innerHTML = html;
                    scripts.forEach(script => {
                        if (!script.getAttribute('src') && script.getAttribute('data-src')) {
                            script.setAttribute('src', script.getAttribute('data-src'));
                        }
                    });
                });
            });
        })

    
})

