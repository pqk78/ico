const form = document.querySelector('.form');
const drag_area = document.getElementById('drag-area');
const fileInput = document.getElementById('file');
let imageList = [];

const addFiles = files => {
  let images = Array.from(files).filter(file => {
    if (file.type.indexOf('image/') !== 0) {
      return false;
    }
    let exists = false;
    imageList.forEach(image => {
      if (image.path == file.path) {
        exists = true;
      }
    });
    return !exists;
  })
  images.forEach(image => {
    liquid.render('preview', { input: true, name: image.name, path: image.path }).then(html => {
      document.querySelector('.form-input-preview').insertAdjacentHTML('beforeend', html)
    })
  })
  imageList.push(...images);
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
  drag_area.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
  });
  document.body.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
  })
});

['dragenter', 'dragover'].forEach(event => {
  drag_area.addEventListener(event, e => {
    drag_area.classList.add('drag-active');
  })
});

drag_area.addEventListener('dragleave', e => {
  drag_area.classList.remove('drag-active');
})

drag_area.addEventListener('drop', e => {
  drag_area.classList.remove('drag-active');
  addFiles(e.dataTransfer.files);
})

fileInput.addEventListener('change', e => {
  addFiles(fileInput.files);
})

form && form.addEventListener('submit', async e => {
  e.preventDefault();
  imageList.forEach(image => {
    let data = new FormData(form);
    let formats = data.getAll('format');
    let custom_sizes = data.get('custom_sizes').replaceAll(' ', '').replaceAll('px', '').split(',').filter(e => e);
    let sizes = data.getAll('size');
    let fit = data.get('fit');
    let position = data.get('position');
    let background = data.get('background');
    sizes.push(...custom_sizes);

    if (!formats?.length) {
      formats = ['auto'];
    }

    formats.forEach(format => {
      sizes.forEach(size => {
        let options = { image: image.path, format, fit, position, background };
        if (size == 'auto') {
          options.resize = false;
        }
        else {
          options.resize = size.split('x').map(Number);
        }
        let id = `${image.path}${size}${format}`.replaceAll('.', '-').replaceAll('/', '-');
        let loading = true;
        liquid.render('preview', { loading, id }).then(html => {
          document.querySelector('.form-output .output').insertAdjacentHTML('beforeend', html)
        })
        ico.convert(image.path, options).then(info => {
          loading = false;
          liquid.render('preview', { loading, info }).then(html => {
            document.getElementById(id).innerHTML = html;
          });
        });
      });
    });
  });
});