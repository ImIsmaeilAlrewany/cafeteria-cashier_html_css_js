import { formFunction, categoryItem, addNewItemToCategory, deleteItemFromCategory, activateEditItem, backFromEditForm, editCategoryItem } from '../menu.js';

const itemsContainer = document.querySelector('.category-items #items-container');
// this function I made it to use it whenever I edit or delete or add new element
function printElementsAndForm(data) {
  const categorySavedContent = data.content.map(item => {
    return categoryItem(item);
  });

  if (itemsContainer)
    itemsContainer.innerHTML = categorySavedContent.join(' ') + formFunction(data.id);

  addNewItemToCategory();

  // delete items from categories after displaying them
  let deleteItemElements = document.querySelectorAll('.control .delete-item');
  if (deleteItemElements) deleteItemElements.forEach(ele => {
    ele.addEventListener('click', (e) => {
      deleteItemFromCategory(ele);
    });
  });

  // edit items in categories after displaying them
  let editItemButtons = document.querySelectorAll('.control .edit-item');
  if (editItemButtons) editItemButtons.forEach(ele => {
    ele.addEventListener('click', (e) => {
      activateEditItem(ele);
    });
  });

  // back buttons to items
  let backToItemButtons = document.querySelectorAll('.back-button');
  if (backToItemButtons) backToItemButtons.forEach(ele => {
    ele.addEventListener('click', (e) => {
      backFromEditForm(ele);
    });
  });

  // edit categories items data when click on edit button
  editCategoryItem();
}

export default printElementsAndForm;
