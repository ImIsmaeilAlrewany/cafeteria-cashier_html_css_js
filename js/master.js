import toggleActive from "./layouts/toggleActive.js";

// generate ids function
let allIds = [];
if (localStorage.getItem('allIds'))
  allIds = JSON.parse(localStorage.getItem('allIds'));

const generateId = () => {
  const generate = () => Math.floor(Math.random() * (999999 - 0)) + 100000;

  const id = generate();
  for (let i = 0; i < allIds.length; i++) if (allIds[i] === id) generateId();

  allIds.push(id);
  localStorage.setItem('allIds', JSON.stringify(allIds));
  return id;
};

//===================================================//

// work with adding tables and save it in local storage
const addTable = document.getElementById('add-table');
const tablesModal = document.getElementById('tables-modal');
const addTableInput = document.getElementById('add-table-input');
const addTableButton = document.getElementById('add-table-submit');
const closeTableModal = document.getElementById('close-table-button');
const tablesContainer = document.getElementById('tables-container');
const tableModalWarning = document.querySelector('#tables-modal #warning-text');

let tables = [
  // {
  //   id: generateId(),
  //   name: "طاولة 1",
  //   order: []
  // }
];

if (!localStorage.getItem('cafeteria-tables')) {
  // save tables in local storage
  localStorage.setItem('cafeteria-tables', JSON.stringify(tables));
} else {
  // get tables from local storage after loading the page
  tables = JSON.parse(localStorage.getItem('cafeteria-tables'));
}

// show up tables restoring from local storage
const output = tables.map((t) => {
  return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" data-id="${t.id}" role="button">
    <i class="fa-solid fa-chair"></i>
    <span class="ms-2">${t.name}</span>
  </a>`;
});

if (tablesContainer) tablesContainer.innerHTML = output.join(' ');

// open modal to add new tables for cafeteria
if (addTable) toggleActive(addTable, tablesModal);

// close modal display none the overlay
if (closeTableModal) toggleActive(closeTableModal, tablesModal);

// ***get data and create elements function
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
        document.querySelectorAll('.category #data').forEach(ele => {
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

if (addTableButton)
  collectAndCreate(addTableButton, addTableInput, { arr: tables, ele: tableModalWarning }, tablesContainer, (data) => {
    const id = generateId();
    tables.push({ id: id, name: data, order: [] });
    localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

    return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" data-id="${id}" role="button">
    <i class="fa-solid fa-chair"></i>
    <span class="ms-2">${data}</span>
  </a>`;
  });

//====================================================//

// start work with adding new clients (register)
const register = document.getElementById('register');
const registerInputs = document.querySelectorAll('.register .form-control');
const registerWarnings = document.querySelectorAll('.register .form-text');

// first because we use local storage and there is no database
// when we use this application on any other browser will directly go to login
// but because at that time there will be no account data in local storage
// we need to add admin account globally when website opens
// if there is already data nothing will happen but if there is no data will add it
if (!JSON.parse(localStorage.getItem('clients')))
  localStorage.setItem('clients', JSON.stringify([{
    name: 'admin',
    phone: '',
    password: '1234admin'
  }]));

// ***collecting clients data function
// to use it your input must have data-from custom attribute
const collectData = (inputs) => {
  let outputObject = {};

  inputs.forEach(input => {
    outputObject[input.dataset.from] = input.value.trim();
  });

  return outputObject;
};

// all warning messages if client entered wrong data
const warningMessages = [
  'مسموح فقط الحروف وأزيد من ثلاث حروف',
  'مسموح فقط أرقام الهاتف',
  'لا يقل عن 7 وعلى الأقل حرف أو رمز'
];

// submit data and check if it correct then save it
if (register) register.addEventListener('submit', (e) => {
  const data = collectData(registerInputs);
  let dataCorrect = false;
  let dataUnique = false;
  let clients = [];

  // get any data in local storage first
  if (localStorage.getItem('clients')) {
    const savedData = localStorage.getItem('clients');
    clients.push(...JSON.parse(savedData));
  }

  // check name, phone and password if are correct
  if (data.name.length < 3 || Number(data.name)) {
    e.preventDefault();
    dataCorrect = false;
    registerWarnings[0].innerHTML = warningMessages[0];
  } else {
    registerWarnings[0].innerHTML = '';

    if (data.phone.length != 11 || !Number(data.phone)) {
      e.preventDefault();
      dataCorrect = false;
      registerWarnings[1].innerHTML = warningMessages[1];
    } else {
      registerWarnings[1].innerHTML = '';

      if (data.password.length < 7 || Number(data.password)) {
        e.preventDefault();
        dataCorrect = false;
        registerWarnings[2].innerHTML = warningMessages[2];
      } else {
        dataCorrect = true;
        registerWarnings[2].innerHTML = '';
      }
    }
  }

  // check if data is unique
  if (clients.length !== 0)
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].name === data.name || clients[i].phone === data.phone) {
        dataUnique = false;
        break;
      } else {
        dataUnique = true;
      }
    }
  else dataUnique = true;

  if (!dataUnique) {
    e.preventDefault();
    registerWarnings.forEach(w => {
      w.innerHTML = 'الإسم أو رقم الهاتف استخدم من قبل';
    });
  }

  // if data correct save it in local storage
  if (dataUnique && dataCorrect) {
    clients.push(data);
    localStorage.setItem('clients', JSON.stringify(clients));
  }
});


// start work with login collecting data from client
const login = document.getElementById('login');
const loginInputs = document.querySelectorAll('#login .form-control');
const loginWarnings = document.querySelectorAll('#login .form-text');

// submit data and check if it correct then login and save in session storage
if (login) login.addEventListener('submit', (e) => {
  const data = collectData(loginInputs);
  let isLoggedIn = false;

  // check name or phone and password if they are certainly existed
  const clients = JSON.parse(localStorage.getItem('clients'));

  if (clients.length > 0) {
    let matchedData = {};

    // check client existed
    for (let i = 0; i < clients.length; i++) {
      if (data.name === clients[i].name || data.name === clients[i].phone) {
        matchedData = clients[i];
        loginWarnings[0].innerHTML = '';
        break;
      } else {
        e.preventDefault();
        isLoggedIn = false;
        loginWarnings[0].innerHTML = 'هذا الكاشير غير موجود';
      }
    }

    // if client name or phone is correct and existed check password
    if (data.password !== matchedData.password) {
      e.preventDefault();
      isLoggedIn = false;
      loginWarnings[1].innerHTML = 'الرقم السري غير صحيح';
    } else {
      loginWarnings[1].innerHTML = '';
      isLoggedIn = true;

      // if data matches save client is loggedIn in session storage
      sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      sessionStorage.setItem('onlineClient', JSON.stringify(matchedData));
      login.submit();
    }
  }
});


// start work with logout
const logout = document.getElementById('logout');

if (logout) logout.addEventListener('click', () => {
  sessionStorage.removeItem('onlineClient');
  sessionStorage.setItem('isLoggedIn', false);
  location.reload();
});

//===================================================//

// start work with edit profiles data
const profile = document.getElementById('profile');
const profileName = document.getElementById('profile-cashier-name');
const profilePhone = document.getElementById('profile-cashier-phone');
const profilePassword = document.getElementById('profile-cashier-password');
const profileNewPassword = document.getElementById('profile-cashier-newpassword');
const profileWarnings = document.querySelectorAll('#profile .form-text');

// set cashier data
const profileData = JSON.parse(sessionStorage.getItem('onlineClient'));
if (profileName) profileName.value = profileData.name;
if (profilePhone) profilePhone.value = profileData.phone;
if (profilePassword) profilePassword.value = '*'.repeat(profileData.password.length);

// get the clientIndex (cashier) after comparing it with local storage
const getClientIndex = (arr, client) => {
  let index;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === client.name && arr[i].phone === client.phone && arr[i].password === client.password) {
      index = i;
      break;
    }
  }
  return index;
};

// submit new data will be after clicking on edit profile button
if (profile) profile.addEventListener('submit', (e) => {
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  let isFormValid = false;
  let clientIndex = getClientIndex(clients, profileData);

  const data = collectData([profileName, profilePhone, profileNewPassword]);
  const oldPassword = profilePassword.value.trim();

  // check new data is correct and unique function
  // to check unique you need to put a boolean value
  const checkData = (key, condition, warningEle, warningMes, unique, uniqueMes) => {
    if (data[key] && data[key] !== profileData[key]) {
      e.preventDefault();
      if (condition) {
        e.preventDefault();
        warningEle.innerHTML = warningMes;
      } else {
        if (unique) {
          for (let i = 0; i < clients.length; i++) {
            if (data[key] === clients[i][key]) {
              e.preventDefault();
              profileWarnings[0].innerHTML = uniqueMes;
              break;
            } else {
              isFormValid = true;
            }
          }
        } else {
          isFormValid = true;
        }
      }
    } else {
      data[key] = '';
    }
  };

  // array to use in checkCorrect function
  const funcArguments = [
    {
      key: 'name',
      condition: data.name.length < 3 || Number(data.name),
      unique: true,
      uniqueMessage: 'هذا الإسم استخدم من قبل'
    },
    {
      key: 'phone',
      condition: data.phone.length != 11 || !Number(data.phone),
      unique: true,
      uniqueMessage: 'هذا الرقم استخدم من قبل'
    },
    {
      key: 'password',
      condition: data.password.length < 7 || Number(data.password),
      unique: false
    }
  ];


  // current password must be right if you want to edit anything
  if (oldPassword === profileData.password) {
    profileWarnings[2].innerHTML = '';

    // use checkData function
    funcArguments.forEach((argument, i) => {
      checkData(
        argument.key,
        argument.condition,
        profileWarnings[i],
        warningMessages[i],
        argument.unique,
        argument.uniqueMessage
      );
    });

  } else {
    e.preventDefault();
    profileWarnings[2].innerHTML = 'الرقم السري خطأ حاول من جديد';
  }

  // after checking all data (unique and correct) time to save it 
  if (isFormValid) {
    for (const prop in clients[clientIndex]) {
      if (data[prop]) clients[clientIndex][prop] = data[prop];
    }

    localStorage.setItem('clients', JSON.stringify(clients));
    sessionStorage.setItem('onlineClient', JSON.stringify(clients[clientIndex]));
    profile.submit();
  }
});

// delete cashier account
const deleteProfile = document.getElementById('profile-cashier-delete');

if (deleteProfile) deleteProfile.addEventListener('click', () => {
  const clients = JSON.parse(localStorage.getItem('clients'));
  let clientIndex = getClientIndex(clients, profileData);

  // set data in session storage
  sessionStorage.removeItem('onlineClient');
  sessionStorage.setItem('isLoggedIn', false);

  // set data in local storage
  clients.splice(clientIndex, 1);
  localStorage.setItem('clients', JSON.stringify(clients));

  // redirect to login page
  location.href = '../login.html';
});

//===============================================//

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
        <h6 class="card-subtitle mb-4 text-body-secondary">الكمية: <span>${item.quantity}</span></h6>
        <p class="card-text align-self-end">
          السعر: <span>${item.price}</span>
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
        <button type="button" class="back-button w-100 rounded border-0">الرجوع</button>
        <button type="button" class="edit-item-button w-100 rounded border-0">تعديل</button>
      </div>
    </form>
  </div>`;
}

function formFunction(id) {
  return `<div class="col-sm-6 col-md-4 col-xl-3">
    <form id="add-item" class="add-item text-center p-3 rounded mx-auto" data-id="${id}">
      <div class="my-3">
        <input type="text" class="form-control shadow border-0" id="item-name" placeholder="اسم السلعة">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="item-quantity" placeholder="الكمية">
      </div>
      <div class="mb-3">
        <input type="text" class="form-control shadow border-0" id="item-price" placeholder="الثمن">
      </div>
      <div class="mb-3">
        <button type="submit" class="add-item-button w-100 rounded border-0">إضافة سلعة جديدة</button>
      </div>
    </form>
  </div>`;
};

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
// adding this will repeat the function, I already use it inside printElementsAndForm
// addNewItemToCategory();

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

//=================================================//

// work on order page starting with taking the table name
function selectTable() {
  const allTables = document.querySelectorAll('.table');
  const tablesInStorage = JSON.parse(localStorage.getItem('cafeteria-tables'));
  allTables.forEach((table, index) => {
    table.addEventListener('click', () => {
      sessionStorage.setItem('selected-table', JSON.stringify(tablesInStorage[index]));
      table.href = 'order.html';
    });
  });
}
selectTable();

// add order page section label depends on the table data
const sectionLabel = document.querySelector('.order-menu h2 span');
const tableData = JSON.parse(sessionStorage.getItem('selected-table'));

if (sectionLabel) sectionLabel.innerHTML = tableData.name;

// display all categories in order menu in order page
const categoriesListElement = document.querySelector('.order-menu .menu-categories');
const displayCategories = allCategories.map((category, index) => {
  if (category) return `
  <li class="m-0 me-3 p-0 shadow rounded d-flex align-items-center justify-content-center ${index === 0 ? 'active' : ''}" role="button" data-id="${category.id}">${category.name}</li>`;
  else return `
  <li class="m-0 p-0 d-flex justify-content-center align-items-center w-100 rounded">لا يوجد أصناف</li>`;
});
if (categoriesListElement)
  categoriesListElement.innerHTML = displayCategories.join(' ');

// display first category content in order menu in order page
const itemsListElement = document.querySelector('.order-menu .category-items');
const itemsElementArray = (array) => {
  return array.map(item => {
    if (item) return `
  <li class="m-0 p-3 shadow rounded d-flex align-items-center justify-content-center flex-column overflow-hidden" role="button" data-id="${item.id}">
    <h6 class="m-0 mb-2 p-0">${item.name}</h6>
    <p class="m-0 p-0 align-self-end">السعر: ${item.price}</p>
  </li>`;
    else return `
  <li class="m-0 p-0 d-flex justify-content-center align-items-center w-100 rounded">قم بإضافة الأقسام أولا ثم ما تحتوية</li>`;
  });
};
if (itemsListElement && allCategories.length > 0)
  itemsListElement.innerHTML = itemsElementArray(allCategories[0].content).join(' ');

// change the selected category and display its items
const listItemElements = document.querySelectorAll('.order-menu .menu-categories li');
if (listItemElements) listItemElements.forEach((element, index) => {
  element.addEventListener('click', () => {
    listItemElements.forEach(ele => {
      ele.classList.remove('active');
    });

    element.classList.add('active');
    itemsListElement.innerHTML = itemsElementArray(allCategories[index].content).join(' ');

    addOrder();
  });
});

// add orders to the table by clicking on items
function addOrder() {
  const allItemsInList = document.querySelectorAll('.order-menu .category-items li');
  let categoryIndex;
  let itemIndex;
  let tableIndex;

  allItemsInList.forEach(item => {
    item.addEventListener('click', () => {
      [categoryIndex, itemIndex] = findIdInArrayInArray(allCategories, 'content', item.dataset.id);

      // first get all item data and decrement the quantity
      const { id, name, price } = allCategories[categoryIndex].content[itemIndex];
      let unique = true;

      // check if this item is already added in order to not repeat it
      JSON.parse(sessionStorage.getItem('selected-table')).order.forEach(ele => {
        if (ele.id == id) unique = false;
      });

      if (unique) {
        allCategories[categoryIndex].content[itemIndex].quantity--;
        localStorage.setItem('menu-categories', JSON.stringify(allCategories));

        // second add the selected item into table order array
        const table = JSON.parse(sessionStorage.getItem('selected-table'));
        tableIndex = findIdInArray(tables, table.id);
        tables[tableIndex].order.push({ id, name, quantity: 1, total: price, price });
        localStorage.setItem('cafeteria-tables', JSON.stringify(tables));
        sessionStorage.setItem('selected-table', JSON.stringify(tables[tableIndex]));

        // display the new add order to orders table
        displayOrders(true);
      }
    });
  });
}
addOrder();

// common function to find Id in array by getting array and id
function findIdInArray(array, id) {
  let index;
  for (let i = 0; i < array.length; i++) {
    if (+array[i].id === +id) index = i;
  }

  return index;
}

// common function to find Id in array inside array by getting array and id
function findIdInArrayInArray(array, secondArray, id) {
  let indexes = [];

  for (let i = 0; i < array.length; i++) {
    for (let n = 0; n < array[i][secondArray].length; n++) {
      if (+array[i][secondArray][n].id === +id) {
        indexes = [i, n];
      }
    }
  }

  return indexes;
}

// increment function to the order quantity and total price
const incrementQuantity = (tableData) => {
  const addElements = document.querySelectorAll('[data-functionality="add"]');
  let clickedElement;

  addElements.forEach((ele, index) => {
    ele.addEventListener('click', () => {
      clickedElement = ele.parentElement;

      // change table data and save it
      +tableData.order[index].quantity++;
      tableData.order[index].total = +tableData.order[index].price * +tableData.order[index].quantity;
      sessionStorage.setItem('selected-table', JSON.stringify(tableData));
      tables[findIdInArrayInArray(tables, 'order', clickedElement.dataset.id)[0]] = tableData;
      localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

      // change data in categories and save it
      const [categoryIndex, itemIndex] = findIdInArrayInArray(allCategories, 'content', clickedElement.dataset.id);
      allCategories[categoryIndex].content[itemIndex].quantity--;
      localStorage.setItem('menu-categories', JSON.stringify(allCategories));

      // change DOM data by calling the function again
      displayOrders(true);
    });
  });
};

// decrement function to the order quantity and total price
const decrementQuantity = (tableData) => {
  const addElements = document.querySelectorAll('[data-functionality="sub"]');
  let clickedElement;

  addElements.forEach((ele, index) => {
    ele.addEventListener('click', () => {
      clickedElement = ele.parentElement;

      // change table data and save it
      +tableData.order[index].quantity--;

      // check if the order becomes zero it must be deleted
      if (+tableData.order[index].quantity <= 0) {
        tableData.order[index].quantity++;
        deleteFunction(index, tableData, clickedElement);
      } else {
        tableData.order[index].total = +tableData.order[index].total - +tableData.order[index].price;
        sessionStorage.setItem('selected-table', JSON.stringify(tableData));
        tables[findIdInArrayInArray(tables, 'order', clickedElement.dataset.id)[0]] = tableData;
        localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

        // change data in categories and save it
        const [categoryIndex, itemIndex] = findIdInArrayInArray(allCategories, 'content', clickedElement.dataset.id);
        allCategories[categoryIndex].content[itemIndex].quantity++;
        localStorage.setItem('menu-categories', JSON.stringify(allCategories));
      }

      // change DOM data by calling the function again
      displayOrders(true);
    });
  });
};

// delete function to the order from session and local storage and DOM

// I made this function because I am gonna use it in decrement function
function deleteFunction(index, tableData, clickedElement) {
  // change data in categories and save it
  const [categoryIndex, itemIndex] = findIdInArrayInArray(allCategories, 'content', clickedElement.dataset.id);
  allCategories[categoryIndex].content[itemIndex].quantity = +allCategories[categoryIndex].content[itemIndex].quantity + +tableData.order[index].quantity;
  console.log(tableData.order[index].quantity);
  localStorage.setItem('menu-categories', JSON.stringify(allCategories));

  // delete order at all from table
  tableData.order.splice(index, 1);
  sessionStorage.setItem('selected-table', JSON.stringify(tableData));
  tables[findIdInArrayInArray(tables, 'order', clickedElement.dataset.id)[0]] = tableData;
  localStorage.setItem('cafeteria-tables', JSON.stringify(tables));
}

const deleteOrder = (tableData) => {
  const addElements = document.querySelectorAll('[data-functionality="del"]');
  let clickedElement;

  addElements.forEach((ele, index) => {
    ele.addEventListener('click', () => {
      clickedElement = ele.parentElement;
      deleteFunction(index, tableData, clickedElement);

      // change DOM data by calling the function again
      displayOrders(true);
    });
  });
};

// work on display all orders in the orders place in page (in table)
function displayOrders(edit) {
  let tableBody;
  let tableFoot;
  if (edit) {
    tableBody = document.querySelector('.orders-display table tbody');
    tableFoot = document.querySelector('.orders-display table tfoot');
  } else {
    tableBody = document.querySelector('.orders table tbody');
    tableFoot = document.querySelector('.orders table tfoot');
  }

  const tableData = JSON.parse(sessionStorage.getItem('selected-table'));
  let totalArray = [];

  if (tableData.order.length) {
    tableBody.innerHTML = '';
    tableData.order.forEach((ele, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', ele.id);

      const elementData = [index + 1, ele.name, `${ele.price} جنية`, ele.quantity, `${ele.total} جنية`];
      // check if edit add last three elements
      if (edit) elementData.push('+', '-', 'x');

      for (let i = 0; i < elementData.length; i++) {
        const td = document.createElement('td');
        td.className = 'py-2 px-3 text-nowrap text-center';
        td.textContent = elementData[i];

        if (elementData[i] == '+' || elementData[i] == '-' || elementData[i] == 'x') {
          td.setAttribute('role', 'button');

          if (elementData[i] == '+') td.dataset.functionality = 'add';
          if (elementData[i] == '-') td.dataset.functionality = 'sub';
          if (elementData[i] == 'x') td.dataset.functionality = 'del';
        }

        // push all these elements inside tr element
        tr.appendChild(td);
      }

      // save all elements price in an array will be totalArray
      totalArray.push(ele.total);

      // push tr element inside table body
      tableBody.appendChild(tr);
    });

    // add the last tr in the table which it will be the total
    const tr = document.createElement('tr');
    const tdData = [
      '#',
      'صافي الفاتورة',
      totalArray.reduce((total, val) => +total + +val) + ' جنية'
    ];

    for (let i = 0; i < tdData.length; i++) {
      const td = document.createElement('td');
      td.className = 'py-2 px-3 text-nowrap';
      td.textContent = tdData[i];
      td.style.fontWeight = 'bold';
      td.style.fontSize = '14px';

      if (i === 1)
        if (edit) td.setAttribute('colspan', '6');
        else td.setAttribute('colspan', '3');
      else td.classList.add('text-center');

      tr.appendChild(td);
    }

    tableFoot.innerHTML = '';
    tableFoot.appendChild(tr);
  } else {
    tableBody.innerHTML = `<tr>
      <th colspan="8" class="py-2 px-3 text-nowrap text-center">لا يوجد طلبات لعرضها</th>
    </tr>`;
    tableFoot.innerHTML = '';
  }

  incrementQuantity(tableData);
  decrementQuantity(tableData);
  deleteOrder(tableData);
}
if (document.querySelector('.orders-display table tbody')) displayOrders(true);

// work on order page buttons remove table button
const removeTable = document.querySelector('.orders-display .remove-table');
if (removeTable) removeTable.addEventListener('click', () => {
  // what if I already ordered some items and want to delete
  // in this case I must increment quantity in menu categories for each item
  const table = JSON.parse(sessionStorage.getItem('selected-table'));

  if (table.order.length > 0)
    table.order.forEach(element => {
      const [categoryIndex, itemIndex] = findIdInArrayInArray(allCategories, 'content', element.id);
      allCategories[categoryIndex].content[itemIndex].quantity += +element.quantity;
      localStorage.setItem('menu-categories', JSON.stringify(allCategories));
    });

  // save table in canceled tables in local storage
  const onlineClient = JSON.parse(sessionStorage.getItem('onlineClient'));
  const canceledTables = JSON.parse(localStorage.getItem('canceled-tables')) || [];
  const dateAndTime = new Date().toLocaleString();
  const dateOnly = dateAndTime.slice(0, dateAndTime.indexOf(','));
  const getMonth = (string) => {
    return string.slice(dateOnly.indexOf('/') + 1, dateOnly.lastIndexOf('/'));
  };

  // the canceled tables will be like this [{date: '', data: [{}]}]
  let [isNewDay, objectIndex] = [true, null];
  let isNewMonth = true;
  canceledTables.forEach((table, index) => {
    if (table.date === dateOnly) isNewDay = false;
    else isNewDay = true;

    if (table.date === dateOnly) objectIndex = index;

    if (getMonth(table.date) === getMonth(dateOnly)) isNewMonth = false;
    else isNewMonth = true;
  });
  if (!isNewMonth) {
    if (isNewDay) {
      canceledTables.push({ date: dateOnly, data: [{ table: table, cashier: onlineClient.name, cancelTime: dateAndTime }] });
    } else {
      canceledTables[objectIndex].data.push({ table: table, cashier: onlineClient.name, cancelTime: dateAndTime });
    }
  } else {
    localStorage.removeItem('canceled-tables');
    canceledTables.push({ date: dateOnly, data: [{ table: table, cashier: onlineClient.name, cancelTime: dateAndTime }] });
  }
  localStorage.setItem('canceled-tables', JSON.stringify(canceledTables));

  // delete table id from all ids list in local storage and save it
  let idsList = JSON.parse(localStorage.getItem('allIds'));
  idsList = idsList.filter(id => id != table.id);
  localStorage.setItem('allIds', JSON.stringify(idsList));

  // delete table from session storage and local storage from tables array
  // redirect to index page to select another table or add a new one
  const index = findIdInArray(tables, table.id);
  sessionStorage.removeItem('selected-table');
  tables.splice(index, 1);
  localStorage.setItem('cafeteria-tables', JSON.stringify(tables));
  location.href = 'index.html';
});

// work on order page buttons order table button
const orderTable = document.querySelector('.orders-display .order-order');
if (document.querySelector('.orders table')) displayOrders(false);
if (orderTable) orderTable.addEventListener('click', () => {
  // check if there is no orders it won't work at all
  const table = JSON.parse(sessionStorage.getItem('selected-table'));
  if (table.order.length > 0) {
    // get time now to save it in table in session and local storage
    const dateAndTime = new Date().toLocaleString();
    const tableIndex = findIdInArray(tables, table.id);
    table.orderTime = dateAndTime;
    sessionStorage.setItem('selected-table', JSON.stringify(table));
    tables[tableIndex] = table;
    localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

    // this is chat GPT idea
    // in this solution a problem which is when I open website locally won't work
    // so I always need a host to work properly lik liveServer or gitHub host
    // Error(Blocked a frame with origin "null" from accessing a cross-origin frame)
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'print.html';
    document.body.appendChild(iframe);

    iframe.onload = function () {
      setTimeout(function () {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 1000); // Adjust the delay as needed
    };
  }
});

// work on order page buttons remove table button
const payOrder = document.querySelector('.orders-display .pay-order');
if (payOrder) payOrder.addEventListener('click', () => {
  // check if there is no orders it won't work at all
  const table = JSON.parse(sessionStorage.getItem('selected-table'));
  const onlineClient = JSON.parse(sessionStorage.getItem('onlineClient'));
  const dateAndTime = new Date().toLocaleString();
  const dateOnly = dateAndTime.slice(0, dateAndTime.indexOf(','));

  if (table.order.length > 0 && table.orderTime) {
    // find paid orders in local storage and add the new ones to it then save
    const paidOrders = JSON.parse(localStorage.getItem('paid-orders')) || [];
    const totalPrice = table.order.map(object => +object.total).reduce((accumulator, currentValue) => accumulator + currentValue);
    const ordersNumber = table.order.map(object => +object.quantity).reduce((accumulator, currentValue) => accumulator + currentValue);
    const getMonth = (string) => {
      return string.slice(dateOnly.indexOf('/') + 1, dateOnly.lastIndexOf('/'));
    };

    // the paid orders will be like this [{date: '', data: [{}]}]
    let [isNewDay, objectIndex] = [true, null];
    let isNewMonth = true;
    paidOrders.forEach((table, index) => {
      if (table.date === dateOnly) isNewDay = false;
      else isNewDay = true;

      if (table.date === dateOnly) objectIndex = index;

      if (getMonth(table.date) === getMonth(dateOnly)) isNewMonth = false;
      else isNewMonth = true;
    });
    if (!isNewMonth) {
      if (isNewDay) {
        paidOrders.push({ date: dateOnly, data: [{ cashier: onlineClient.name, table: table, paidTime: dateAndTime, ordersNumber, totalPrice }] });
      } else {
        paidOrders[objectIndex].data.push({ cashier: onlineClient.name, table: table, paidTime: dateAndTime, ordersNumber, totalPrice });
      }
    } else {
      localStorage.removeItem('paid-orders');
      paidOrders.push({ date: dateOnly, data: [{ cashier: onlineClient.name, table: table, paidTime: dateAndTime, ordersNumber, totalPrice }] });
    }
    localStorage.setItem('paid-orders', JSON.stringify(paidOrders));

    // delete table id from all ids list in local storage and save it
    let idsList = JSON.parse(localStorage.getItem('allIds'));
    idsList = idsList.filter(id => id != table.id);
    localStorage.setItem('allIds', JSON.stringify(idsList));

    // delete table from session storage and local storage from tables array
    // redirect to index page to select another table or add a new one
    const index = findIdInArray(tables, table.id);
    sessionStorage.removeItem('selected-table');
    tables.splice(index, 1);
    localStorage.setItem('cafeteria-tables', JSON.stringify(tables));
    location.href = 'index.html';
  }
});

//================================================//





