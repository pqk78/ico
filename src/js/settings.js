const form = document.getElementById('settings-form');
const addSizeForm = document.getElementById('add-size--form');
const addSizeSubmit = document.getElementById('add-size--submit');
const colors = document.querySelectorAll('input[name="color-mode"]');
const sizes = document.querySelectorAll('input[name="size"]');
const sizesSelected = document.querySelectorAll('input[name="size-selected"]');
const resizes = document.querySelectorAll('input[name="resize"]');
const resizesSelected = document.querySelectorAll('input[name="resize-selected"]');
const restore = document.getElementById('restore-defaults');
const deleteButtons = document.querySelectorAll('.delete');

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
    settings.update(key, checkbox.checked)
    settings.unset(oldKey);

    size.setAttribute('data-size', key);
    checkbox.setAttribute('data-size', key);
  })
});

[...sizesSelected, ...resizesSelected].forEach(checkbox => {
  checkbox.addEventListener('change', e => {
    settings.update(checkbox.getAttribute('data-size'), checkbox.checked);
  })
});

deleteButtons.forEach(button => {
  button.addEventListener('click', e => {
    settings.unset(button.getAttribute('data-size'));
    button.closest('tr').remove();
  })
})

restore && restore.addEventListener('click', e => {
  // TO DO add confirmation popup
  settings.restoreDefaults();
  settings.updateColorMode('dark'); // TO DO, get this from settings
  form.reset();
  window.location.reload();
});

addSizeSubmit && addSizeSubmit.addEventListener('click', e => {
  // TO DO Validate input
  const feedback = document.getElementById('add-size--feedback');
  let size = document.getElementById('add-size--size').value.replaceAll('px', '');
  let key = size.indexOf('x') == -1 ? `settings.scale.${size}` : `settings.resize.${size}`;
  let val = document.getElementById('add-size--selected').checked;

  feedback && (feedback.innerHTML = '&nbsp;');
  try {
    settings.update(key, val);
    feedback && (feedback.textContent = 'New custom size added.');
  } catch (err) {
    feedback && (feedback.textContent = 'There was a problem adding the size');
  }
});