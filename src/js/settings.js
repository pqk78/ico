export default function settings() {
  const form = document.getElementById('settings-form');
  const addSizeForm = document.getElementById('add-size--form');
  const addSizeSubmit = document.getElementById('add-size--submit');
  const formats = document.querySelectorAll('input[name="format-selected"]');
  const colors = document.querySelectorAll('input[name="color-mode"]');
  const tempFiles = document.querySelectorAll('input[name="temp-files"]');
  const sizes = document.querySelectorAll('input[name="size"]');
  const sizesSelected = document.querySelectorAll('input[name="size-selected"]');
  const resizes = document.querySelectorAll('input[name="resize"]');
  const resizesSelected = document.querySelectorAll('input[name="resize-selected"]');
  const fits = document.querySelectorAll('input[name="fit"]');
  const positions = document.querySelectorAll('input[name="position"]');
  const restore = document.getElementById('restore-defaults');
  const deleteButtons = document.querySelectorAll('.delete');

  formats.forEach(format => {
    format.addEventListener('change', e => {
      storage.update(format.getAttribute('data-format'), format.checked);
    });
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
      storage.update(key, checkbox.checked)
      storage.unset(oldKey);

      size.setAttribute('data-size', key);
      checkbox.setAttribute('data-size', key);
    })
  });

  [...sizesSelected, ...resizesSelected].forEach(checkbox => {
    checkbox.addEventListener('change', e => {
      storage.update(checkbox.getAttribute('data-size'), checkbox.checked);
    })
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
      settings.unset(button.getAttribute('data-size'));
      button.closest('tr').remove();
    })
  });

  colors.forEach(color => {
    color.addEventListener('change', e => {
      let formData = new FormData(form);      
      storage.update('settings.theme.mode.value', formData.get('color-mode'));
      storage.updateColorMode(formData.get('color-mode'));
    })
  });

  tempFiles.forEach(option => {
    option.addEventListener('change', e => {
      let formData = new FormData(form);
      storage.update('settings.temp_files.schedule.value', formData.get('temp-files'));
    })
  })

  fits.forEach(fit => {
    fit.addEventListener('change', e => {
      let formData = new FormData(form);      
      storage.update('settings.fit.value', formData.get('fit'));
    })
  })

  positions.forEach(position => {
    position.addEventListener('change', e => {
      let formData = new FormData(form);    
      storage.update('settings.position.value', formData.get('position'));
    })
  });

  restore && restore.addEventListener('click', e => {
    // TO DO add confirmation popup
    storage.restoreDefaults();
    storage.updateColorMode('dark'); // TO DO, get this from settings
    form.reset();
    liquid.render('settings').then((html) => {
      document.getElementById('main-container').innerHTML = html;
      settings();
      window.global.callbacks.common();
    });
  });

  addSizeSubmit && addSizeSubmit.addEventListener('click', e => {
    // TO DO Validate input
    const feedback = document.getElementById('add-size--feedback');
    let size = document.getElementById('add-size--size').value.replaceAll('px', '');
    let key = size.indexOf('x') == -1 ? `settings.scale.${size}` : `settings.resize.${size}`;
    let val = document.getElementById('add-size--selected').checked;

    feedback && (feedback.innerHTML = '&nbsp;');
    try {
      storage.update(key, val);
      feedback && (feedback.textContent = 'New custom size added.');
    } catch (err) {
      feedback && (feedback.textContent = 'There was a problem adding the size');
    }
  });
}