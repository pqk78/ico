const form = document.querySelector('.form');
const colors = document.querySelectorAll('input[name="color-mode"]');

colors.forEach(color => {
    color.addEventListener('change', e => {
        let value;
        colors.forEach(c => {
            c.checked && (value = c.value);
        });
        utils.updateSettings('settings.theme.mode.value', value);
        utils.updateColorMode(value);
    })
})