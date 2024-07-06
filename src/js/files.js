export default async function files() {
  const deleteButtons = document.querySelectorAll('.delete-button');

  const deleteFile = e => {
    ico.deleteFile(e.currentTarget.getAttribute('data-file'));
    e.currentTarget.closest('.file').remove();
  }

  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteFile)
  })
}