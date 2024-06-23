const form = document.querySelector('.form');
const drag_area = document.getElementById('form__drag-area');
const file = document.getElementById('file');

drag_area && drag_area.addEventListener('drop', e => {
    e.preventDefault();
    console.log(e);
})

form.addEventListener('submit', e => {
    e.preventDefault();
    let image = file.files[0].path;
    image && utils.convert(image, {})
})