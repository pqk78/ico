const form = document.querySelector('.form');
const drag_area = document.getElementById('form__drag-area');
const file = document.getElementById('file');

drag_area && drag_area.addEventListener('drop', e => {
    e.preventDefault();
    console.log(e);
});

form && form.addEventListener('submit', async e => {
    e.preventDefault();
    let image = file.files[0]?.path;
    if (image) {
        let data = new FormData(form);
        let formats = data.getAll('format');
        let custom_sizes = data.get('custom_sizes').replaceAll(' ', '').replaceAll('px', '').split(',').filter(e => e);
        let sizes = data.getAll('size');
        sizes.push(...custom_sizes);

        if (!formats?.length) {
            formats = ['auto'];
        }

        formats.forEach(format => {
            sizes.forEach(size => {
                let options = { image, format };
                if (size == 'auto') {
                    options.resize = false;
                }
                else {
                    options.resize = size.split('x').map(Number);
                }

                utils.convert(image, options).then(info => {
                    console.log(info)
                    utils.liquid('preview', {info}).then(html => {
                        document.querySelector('.form-output .output').insertAdjacentHTML('beforeend', html)
                    });
                });
            });
        });
    }
});