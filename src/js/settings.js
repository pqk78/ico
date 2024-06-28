const form = document.querySelector('.form');
const colors = document.querySelectorAll('input[name="color-mode"]');
const sizes = document.querySelectorAll('input[name="size"]');
const sizesSelected = document.querySelectorAll('input[name="size-selected"]');
const resizes = document.querySelectorAll('input[name="resize"]');
const resizesSelected = document.querySelectorAll('input[name="resize-selected"]');

colors.forEach(color => {
    color.addEventListener('change', e => {
        let value;
        colors.forEach(c => {
            c.checked && (value = c.value);
        });
        utils.updateSettings('settings.theme.mode.value', value);
        utils.updateColorMode(value);
    })
});

[...sizes,...resizes].forEach(size => {
    size.addEventListener('blur', e => {
        let key = `settings.scale.${size.value.replaceAll(' ', '').replaceAll('px', '')}`;
        let oldKey = size.getAttribute('data-size');

        if (key == oldKey) {
            return;
        }

        let value = document.getElementById(size.getAttribute('data-selected')).checked;
        utils.updateSettings(key, value)
        utils.updateSettings(oldKey, 'delete');
    })
})