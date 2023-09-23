const selectFromMenu = (menu, callback) => {
  menu.forEach((element, index) => {
    element.addEventListener('click', () => {
      menu.forEach(ele => {
        ele.classList.remove('active');
      });

      element.classList.add('active');
      callback(index);
    });
  });
};

export default selectFromMenu;
