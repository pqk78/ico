const form = document.querySelector('.form');
const drag_area = document.getElementById('form__drag-area');

drag_area && drag_area.addEventListener('drop', e => {
    e.preventDefault();
    console.log(e);
})

form.addEventListener('submit', e => {
    e.preventDefault();
    utils.convert();
})