import toggleActive from "./layouts/toggleActive.js";
import generateId from "./layouts/generateId.js";
import collectAndCreate from "./layouts/collectAndCreate.js";
import printElementsAndForm from "./layouts/printElementsAndForm.js";
import findIdInArray from "./layouts/findIdInArray.js";
import findIdInArrayInArray from './layouts/findIdInArrayInArray.js';

// get all ids that are saved in local storage
let allIds = JSON.parse(localStorage.getItem('allIds')) || [];

// start work in menu add category modal
const categoriesContainer = document.getElementById('categories-container');
const categoryModalWarning = document.querySelector('#category-modal #warning-text');

// check if there is any category in local storage
let allCategories = [];
if (JSON.parse(localStorage.getItem('menu-categories')))
  allCategories = JSON.parse(localStorage.getItem('menu-categories'));

const savedCategories = allCategories.map(category => {
  return `<div id="category" class="category row shadow rounded me-3 ms-0 overflow-hidden" data-id="${category.id}">
    <div class="control col-3 row flex-column">
    <div id="delete-category" class="delete-category col-6 w-100" role="button"></div>
    <div id="edit-category" class="edit-category col-6 w-100" role="button"></div>
    </div>
    <div id="data" class="data col-9 d-flex justify-content-center align-items-center" role="button">
    ${category.name}
    </div>
    </div>`;
});

if (categoriesContainer) categoriesContainer.innerHTML = savedCategories.join(' ');

// open modal to add new categories to menu
const addCategory = document.querySelector('#add-category-button');
const categoryModal = document.getElementById('category-modal');
if (addCategory) toggleActive(addCategory, categoryModal);

// close modal display none the overlay
const closeCategoryModal = document.getElementById('close-category-button');
if (closeCategoryModal) toggleActive(closeCategoryModal, categoryModal);

// add new category and save in local storage
const categoryModalSubmit = document.getElementById('category-modal-submit');
const addCategoryInput = document.getElementById('add-category-input');

if (categoryModalSubmit)
  collectAndCreate(categoryModalSubmit, addCategoryInput, { arr: JSON.parse(localStorage.getItem('menu-categories')) || [], ele: categoryModalWarning }, categoriesContainer, (data) => {
    console.log('allCategories from add function', allCategories);
    const id = generateId();
    allCategories.push({ id: id, name: data, content: [] });
    localStorage.setItem('menu-categories', JSON.stringify(allCategories));

    return `<div id="category" class="category row shadow rounded me-3 ms-0 overflow-hidden" data-id="${id}">
    <div class="control col-3 row flex-column">
    <div id="delete-category" class="delete-category col-6 w-100" role="button"></div>
    <div id="edit-category" class="edit-category col-6 w-100" role="button"></div>
    </div>
    <div id="data" class="data col-9 d-flex justify-content-center align-items-center" role="button">
    ${data}
    </div>
    </div>`;
  });

// work on delete category from categories list
const deleteCategories = document.querySelectorAll('#delete-category');

function eventDeleteFromNewDOM(category) {
  category.addEventListener('click', (e) => {
    const category = e.target.parentElement.parentElement;
    let data_id = category.getAttribute('data-id');
    let categoriesList = JSON.parse(localStorage.getItem('menu-categories'));
    let idsList = JSON.parse(localStorage.getItem('allIds'));
    let index = findIdInArray(categoriesList, data_id);

    categoriesList = categoriesList.filter(val => parseInt(val.id) != parseInt(data_id));
    idsList = idsList.filter(id => id != data_id);

    category.remove(); // category.parentElement.removeChild(category)
    localStorage.setItem('allIds', JSON.stringify(idsList));
    localStorage.setItem('menu-categories', JSON.stringify(categoriesList));
    // allCategories = categoriesList;
    allCategories = JSON.parse(localStorage.getItem('menu-categories'));
    allIds = idsList;

    console.log('allCategories from delete function', allCategories);
    // document.querySelectorAll('[data-id="value"]');

    // after deleting a category
    // it must select the next one and display its items
    const categoriesContainer = document.querySelector('#categories-container');
    const itemsContainer = document.querySelector('#items-container');
    if (allCategories[index]) {
      categoriesContainer.children[index].classList.add('active');
      printElementsAndForm(allCategories[index]);
    } else if (allCategories[index - 1]) {
      categoriesContainer.children[index - 1].classList.add('active');
      printElementsAndForm(allCategories[index - 1]);
    } else {
      itemsContainer.innerHTML = '';
    }
  });
}

if (deleteCategories) deleteCategories.forEach(category => {
  eventDeleteFromNewDOM(category);
});

// work on edit category and save it after
const editCategories = document.querySelectorAll('#edit-category');
const editModalSubmit = document.querySelector('#edit-modal-submit');
const editModalInput = document.querySelector('#edit-modal-input');
const editModalWarning = document.querySelector('#warning-edit-text');
const editModal = document.getElementById('edit-modal');

function eventEditToNewDOM(category) {
  category.addEventListener('click', (e) => {
    const category = e.target.parentElement.parentElement;
    let categoriesList = JSON.parse(localStorage.getItem('menu-categories'));
    let data_id = category.getAttribute('data-id');
    let categoryIndex = findIdInArray(categoriesList, data_id);

    // open modal to edit the category
    editModal.classList.toggle('active');

    // edit new category and save in local storage
    collectAndCreate(editModalSubmit, editModalInput, { arr: categoriesList, ele: editModalWarning }, categoriesContainer, (data) => {
      categoriesList[categoryIndex].name = data;
      allCategories = categoriesList;
      document.querySelector(`[data-id="${data_id}"] #data`).innerHTML = data;
      localStorage.setItem('menu-categories', JSON.stringify(allCategories));
    });
  });
}

if (editCategories) editCategories.forEach(category => {
  eventEditToNewDOM(category);
});

// close edit modal
const closeModal = document.querySelector('#close-edit-button');
if (closeModal) toggleActive(closeModal, editModal);

//===================================================//

// work on category items and add new items
let menuCategories = document.querySelectorAll('#categories-container .category');
const itemsContainer = document.querySelector('.category-items #items-container');
const addItem = document.getElementById('add-item');
console.log('all categories in local storage: ', allCategories);

// add active to the first category then display all category items and add same it
if (menuCategories[0]) menuCategories[0].classList.add('active');

function categoryItem(item) {
  return `
  <div id="item" class="rounded col-sm-6 col-md-4 col-xl-3" data-id='${item.id}'>
    <div class="item card text-center pt-3 overflow-hidden mx-auto">
      <div class="card-body d-flex flex-column justify-content-between align-items-center">
        <h5 class="card-title">${item.name}</h5>
        <h6 class="card-subtitle mb-4 text-body-secondary">${lang === 'ar' ? 'الكمية:' : 'Quantity:'} <span>${item.quantity}</span></h6>
        <p class="card-text align-self-end">
          ${lang === 'ar' ? 'السعر:' : 'Price:'} <span>${item.price}</span>
        </p>
      </div>
      <div class="control col-3 row w-100 mx-auto pt-3">
        <div class="delete-item col-6 w-50" role="button"></div>
        <div class="edit-item col-6 w-50" role="button"></div>
      </div>
    </div>
    <form class="edit-item card-body card text-center p-3 active overflow-hidden mx-auto">
      <div class="my-3">
        <input type="text" class="form-control shadow border-0" id="edit-item-name">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="edit-item-quantity">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="edit-item-price">
      </div>
      <div class="mb-3 d-flex justify-content-between">
        <button type="button" class="back-button w-100 rounded border-0">${lang === 'ar' ? 'الرجوع' : 'Back'}</button>
        <button type="button" class="edit-item-button w-100 rounded border-0">${lang === 'ar' ? 'تعديل' : 'Edit'}</button>
      </div>
    </form>
  </div>`;
}

function formFunction(id) {
  return `<div class="col-sm-6 col-md-4 col-xl-3">
    <form id="add-item" class="add-item text-center p-3 rounded mx-auto" data-id="${id}">
      <div class="my-3">
        <input type="text" class="form-control shadow border-0" id="item-name" placeholder="${lang === 'ar' ? 'اسم السلعة' : 'Product Name'}">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="item-quantity" placeholder="${lang === 'ar' ? 'الكمية' : 'Quantity'}">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="item-price" placeholder="${lang === 'ar' ? 'الثمن' : 'Price'}">
      </div>
      <div class="mb-3">
        <button type="submit" class="add-item-button w-100 rounded border-0">${lang === 'ar' ? 'إضافة سلعة جديدة' : 'Add New Product'}</button>
      </div>
    </form>
  </div>`;
};

if (allCategories[0]) printElementsAndForm(allCategories[0]);

// select category
function selectCategory(ele) {
  // this made a big issue in the code don't forget to reset variable
  // or better put the used variable inside the function so anywhere will use it will work
  const menuCategories = document.querySelectorAll('.category');
  ele.addEventListener('click', () => {
    menuCategories.forEach(category => category.classList.remove('active'));

    ele.parentElement.classList.add('active');

    // find the selected element from allCategories list
    let selectedCategory;
    allCategories.forEach(category => {
      if (category.id === +ele.parentElement.dataset.id) selectedCategory = category;
    });
    if (selectedCategory) printElementsAndForm(selectedCategory);

    // addNewItemToCategory();
  });
}
if (menuCategories) document.querySelectorAll('.category #data').forEach(ele => {
  selectCategory(ele);
});

// work on add items in categories using dataset.id
function addNewItemToCategory() {
  const addItemForm = document.getElementById('add-item');
  const itemName = document.getElementById('item-name');
  const itemQuantity = document.getElementById('item-quantity');
  const itemPrice = document.getElementById('item-price');

  if (addItemForm) addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let selectedCategory;
    let selectedCategoryIndex;
    allCategories.forEach((category, index) => {
      if (category.id === +e.target.dataset.id) {
        selectedCategory = category;
        selectedCategoryIndex = index;
      }
    });

    const name = itemName.value.trim();
    const quantity = itemQuantity.value.trim();
    const price = itemPrice.value.trim();
    if (name && quantity && price) {
      const id = generateId();
      selectedCategory.content.push({ id, name, quantity, price });

      // save category in local storage again
      allCategories[selectedCategoryIndex] = selectedCategory;
      localStorage.setItem('menu-categories', JSON.stringify(allCategories));
      printElementsAndForm(selectedCategory);
    }
  });
}

// work on delete items from category then save it in local storage
const deleteItemElements = document.querySelectorAll('.control .delete-item');

function deleteItemFromCategory(element) {
  const itemId = +element.parentElement.parentElement.parentElement.dataset.id;
  const itemElement = element.parentElement.parentElement.parentElement;
  let categoriesArray = JSON.parse(localStorage.getItem('menu-categories'));
  let idsList = JSON.parse(localStorage.getItem('allIds'));

  let itemIndexInCategory;
  let categoryIndex;
  [categoryIndex, itemIndexInCategory] = findIdInArrayInArray(categoriesArray, 'content', itemId);

  // delete item from category content and save it
  categoriesArray[categoryIndex].content.splice(itemIndexInCategory, 1);
  localStorage.setItem('menu-categories', JSON.stringify(categoriesArray));
  allCategories = categoriesArray;

  // delete itemId from allIds and save it
  idsList = idsList.filter(id => id !== itemId);
  localStorage.setItem('allIds', JSON.stringify(idsList));
  allIds = idsList;

  // remove the element from dom
  itemElement.remove();
}

if (deleteItemElements) deleteItemElements.forEach(ele => {
  ele.addEventListener('click', (e) => {
    deleteItemFromCategory(ele);
  });
});

// activate edit item button to edit data then save it or go back
function activateEditItem(element) {
  const itemId = +element.parentElement.parentElement.parentElement.dataset.id;
  let categoriesArray = JSON.parse(localStorage.getItem('menu-categories'));
  let itemIndexInCategory;
  let categoryIndex;
  [categoryIndex, itemIndexInCategory] = findIdInArrayInArray(categoriesArray, 'content', itemId);

  // select form and parentElement to toggle active
  const formElement = document.querySelector(`[data-id="${itemId}"] form`);
  const cardElement = element.parentElement.parentElement;

  formElement.classList.toggle('active');
  cardElement.classList.toggle('active');

  // select all inputs in edit form
  const inputName = document.querySelector(`[data-id="${itemId}"] #edit-item-name`);
  const inputQuantity = document.querySelector(`[data-id="${itemId}"] #edit-item-quantity`);
  const inputPrice = document.querySelector(`[data-id="${itemId}"] #edit-item-price`);

  // put the data as default value in inputs
  inputName.value = categoriesArray[categoryIndex].content[itemIndexInCategory].name;
  inputQuantity.value = categoriesArray[categoryIndex].content[itemIndexInCategory].quantity;
  inputPrice.value = categoriesArray[categoryIndex].content[itemIndexInCategory].price;
}

// deactivate edit item button and don't edit data then go back to card
function backFromEditForm(element) {
  const itemId = +element.parentElement.parentElement.parentElement.dataset.id;

  // select form and element to toggle active
  const formElement = document.querySelector(`[data-id="${itemId}"] form`);
  const cardElement = document.querySelector(`[data-id="${itemId}"] .item`);

  // get back after clicking on back button
  formElement.classList.toggle('active');
  cardElement.classList.toggle('active');
}

// edit item data when clicking on edit button and save it in local storage
function editCategoryItem() {
  const editButtons = document.querySelectorAll(`.edit-item-button`);

  if (editButtons) editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = +button.parentElement.parentElement.parentElement.dataset.id;
      let categoriesArray = JSON.parse(localStorage.getItem('menu-categories'));
      let itemIndexInCategory;
      let categoryIndex;
      [categoryIndex, itemIndexInCategory] = findIdInArrayInArray(categoriesArray, 'content', itemId);

      // select form and parentElement to toggle active
      const formElement = document.querySelector(`[data-id="${itemId}"] form`);
      const cardElement = document.querySelector(`[data-id="${itemId}"] .item`);

      // collect all new data from inputs
      const newName = document.querySelector(`[data-id="${itemId}"] #edit-item-name`).value.trim();
      const newQuantity = document.querySelector(`[data-id="${itemId}"] #edit-item-quantity`).value.trim();
      const newPrice = document.querySelector(`[data-id="${itemId}"] #edit-item-price`).value.trim();

      if (newName && newQuantity && newPrice) {
        categoriesArray[categoryIndex].content[itemIndexInCategory] = {
          id: itemId,
          name: newName,
          price: newPrice,
          quantity: newQuantity
        };
        localStorage.setItem('menu-categories', JSON.stringify(categoriesArray));
        allCategories = categoriesArray;

        formElement.classList.toggle('active');
        cardElement.classList.toggle('active');
        printElementsAndForm(allCategories[categoryIndex]);
      }
    });
  });
}

export { selectCategory, eventDeleteFromNewDOM, eventEditToNewDOM, formFunction, categoryItem, addNewItemToCategory, deleteItemFromCategory, activateEditItem, backFromEditForm, editCategoryItem };

