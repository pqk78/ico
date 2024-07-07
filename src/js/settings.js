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
      storage.unset(button.getAttribute('data-size'));
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
    let group = size.indexOf('x') == -1 ? 'scale' : 'resize';
    let key = `settings.${group}.${size}`;
    let val = document.getElementById('add-size--selected').checked;
    let table = document.querySelector(`#table-${group} tbody`);

    feedback && (feedback.innerHTML = '&nbsp;');
    try {
      storage.update(key, val);
      let tr = document.createElement('tr');
      tr.className = 'added-new';
      let out = `<th scope="row" id="size-${size}">${size}</th>` +
      `<td><input type="checkbox" class="toggle" id="size-${size}-selected" name="resize-selected" ${val ? 'checked' : ''} aria-label="Checked by default" aria-describedby="size-${size}" data-size="settings.resize.${size}"></td>` +
      `<td><button class="delete" aria-label="Delete size" title="Delete" type="button" data-size="settings.resize.${size}">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
        <path fill="none" d="M296 64h-80a7.91 7.91 0 0 0-8 8v24h96V72a7.91 7.91 0 0 0-8-8" />
        <path fill="none" d="M292 64h-72a4 4 0 0 0-4 4v28h80V68a4 4 0 0 0-4-4" />
        <path fill="currentColor" d="M447.55 96H336V48a16 16 0 0 0-16-16H192a16 16 0 0 0-16 16v48H64.45L64 136h33l20.09 314A32 32 0 0 0 149 480h214a32 32 0 0 0 31.93-29.95L415 136h33ZM176 416l-9-256h33l9 256Zm96 0h-32V160h32Zm24-320h-80V68a4 4 0 0 1 4-4h72a4 4 0 0 1 4 4Zm40 320h-33l9-256h33Z" />
        </svg></button></td>`;
      tr.innerHTML += out;
      tr.querySelector('.delete').addEventListener('click', e => {
        storage.unset(e.currentTarget.getAttribute('data-size'));
        tr.remove();
      })
      table.appendChild(tr);
      setTimeout(() => {
        tr.classList.remove('added-new');
      }, 2500)
      addSizeForm.reset();
      e.currentTarget.closest('dialog').close();

    } catch (err) {
      feedback && (feedback.textContent = 'There was a problem adding the size');
      console.error(err);
    }
  });
}