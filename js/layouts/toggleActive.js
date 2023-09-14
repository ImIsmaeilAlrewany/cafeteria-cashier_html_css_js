// custom function to toggle active class
function toggleActive(button, element) {
  button.addEventListener('click', () => {
    element.classList.toggle('active');
  });
};

export default toggleActive;