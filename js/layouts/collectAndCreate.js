import selectTable from "./selectTable.js";
import { selectCategory, eventDeleteFromNewDOM, eventEditToNewDOM, deleteItemFromCategory } from '../menu.js';
import printElementsAndForm from "./printElementsAndForm.js";

// get data and create elements function
const collectAndCreate = (submit, input, warningMes, outputEle, callback) => {
  // return callback func to other func to invoke it
  const effect = (data) => callback(data);
  let inputData = '';
  let isWarning = false;

  submit.onclick = function (e) {
    e.preventDefault();
    inputData = input.value.trim();
    if (inputData.length > 2) {
      input.value = '';

      for (let i = 0; i < warningMes.arr.length; i++) {
        if (warningMes.arr[i].name === inputData) {
          warningMes.ele.innerHTML = 'استخدم من قبل';
          isWarning = true;
          break;
        } else {
          warningMes.ele.innerHTML = 'اجعلها كلمتين فقط';
          isWarning = false;
        }
      }

      if (!isWarning) {
        const output = effect(inputData);
        let allCategories = JSON.parse(localStorage.getItem('menu-categories'));
        outputEle.innerHTML = outputEle.innerHTML + (output || '');

        // reselect tables and add event to the new ones
        selectTable();

        // print category data after adding a new one
        const category = document.querySelector('#category');
        if (category) category.classList.add('active');
        printElementsAndForm(allCategories[0]);

        // change selected category after adding a new one
        const data = document.querySelectorAll('.category #data');
        if (data.length > 0) data.forEach(ele => {
          selectCategory(ele);
        });

        // add event listener to the new added category and delete when click
        let deleteCategories = document.querySelectorAll('#delete-category');
        if (deleteCategories) deleteCategories.forEach(category => {
          eventDeleteFromNewDOM(category);
        });

        // add event listener to the new added category and edit when click
        let editCategories = document.querySelectorAll('#edit-category');
        if (editCategories) editCategories.forEach(category => {
          eventEditToNewDOM(category);
        });

        // delete items from categories after adding a new category
        let deleteItemElements = document.querySelectorAll('.control .delete-item');
        if (deleteItemElements) deleteItemElements.forEach(ele => {
          ele.addEventListener('click', (e) => {
            deleteItemFromCategory(ele);
          });
        });
      }
    }
  };
};

export default collectAndCreate;
