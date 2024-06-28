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
    settings.update('settings.theme.mode.value', value);
    settings.updateColorMode(value);
  })
});

[...sizes, ...resizes].forEach(size => {
  size.addEventListener('blur', e => {
    let key = `settings.scale.${size.value.replaceAll(' ', '').replaceAll('px', '')}`;
    let oldKey = size.getAttribute('data-size');

    if (key == oldKey) {
      return;
    }

    // TO DO
    // Exit if size already exists

    let checkbox = document.getElementById(size.getAttribute('data-selected'));
    settings.update(key, checkbox.value)
    settings.update(oldKey, 'delete');

    size.setAttribute('data-size', key);
    checkbox.setAttribute('data-size', key);
  })
});

[...sizesSelected, ...resizesSelected].forEach(checkbox => {
  checkbox.addEventListener('change', e => {
    console.log('change')
    settings.update(checkbox.getAttribute('data-size'), checkbox.value);
  })
})