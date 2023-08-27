// start with slide menu
const bars = document.getElementById('bars');
const slideMenu = document.getElementById('slide-menu');

// ***custom function to toggle active class
function toggleActive(button, element) {
  button.addEventListener('click', () => {
    element.classList.toggle('active');
  });
};

if (bars) toggleActive(bars, slideMenu);

//====================================================//

// start with changing mode (light - dark)
const light = document.getElementById('light');
const dark = document.getElementById('dark');

// container of colors
const colors = {
  light: {
    "--primary": "#0069D9",
    "--secondary": "#03A9F4",
    "--accent": "#FF4081",
    "--background": "#FFFFFF",
    "--text": "#212121",
    "--secondary-hover": "#57bfef",
    "--gray": "#ccc",
    "--accent-hover": "#f15389"
  },
  dark: {
    "--primary": "#003049",
    "--secondary": "#0369A8",
    "--accent": "#FF8C00",
    "--background": "#121212",
    "--text": "#F0F0F0",
    "--secondary-hover": "#035486",
    "--gray": "#333",
    "--accent-hover": "#f9a43c"
  }
};

// ***change css variables function and save in local storage
const changeVar = (colors, mode) => {
  for (const prop in colors) {
    document.documentElement.style.setProperty(prop, colors[prop]);
    localStorage.setItem('mode', mode);
  }
};

light.addEventListener('click', () => {
  changeVar(colors.light, 'light');
});

dark.addEventListener('click', () => {
  changeVar(colors.dark, 'dark');
});

// check mode while loading pages
// I use this event listener in document to change mode before I see the default one
document.addEventListener('DOMContentLoaded', () => {
  const colorsMode = localStorage.getItem('mode');

  if (colorsMode)
    if (colorsMode === 'light') changeVar(colors.light, 'light');
    else changeVar(colors.dark, 'dark');
});

//===================================================//

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
  return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" href="#" data-id="${t.id}" role="button">
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
    tables.push({ id: id, name: data });
    localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

    return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" href="#" data-id="${id}" role="button">
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
    let index;

    for (let i = 0; i < categoriesList.length; i++) {
      if (categoriesList[i].id === +data_id) index = i;
    }

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
    let categoryIndex;

    for (let i = 0; i < categoriesList.length; i++) {
      if (categoriesList[i].id == data_id) {
        categoryIndex = i;
        break;
      }
    }

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
        <button type="submit" class="edit-item-button w-100 rounded border-0">تعديل</button>
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
  let categoryId;
  let categoryIndex;

  for (let i = 0; i < categoriesArray.length; i++) {
    for (let n = 0; n < categoriesArray[i].content.length; n++) {
      if (categoriesArray[i].content[n].id === itemId) {
        itemIndexInCategory = n;
        categoryId = categoriesArray[i].id;
        categoryIndex = i;
        break;
      }
    }
  }

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

// activate edit item button and edit data then save it or go back
const editItemButtons = document.querySelectorAll('.control .edit-item');
function activateEditItem(element) {
  const itemId = +element.parentElement.parentElement.parentElement.dataset.id;
  let categoriesArray = JSON.parse(localStorage.getItem('menu-categories'));
  let itemIndexInCategory;
  let categoryId;
  let categoryIndex;

  for (let i = 0; i < categoriesArray.length; i++) {
    for (let n = 0; n < categoriesArray[i].content.length; n++) {
      if (categoriesArray[i].content[n].id === itemId) {
        itemIndexInCategory = n;
        categoryId = categoriesArray[i].id;
        categoryIndex = i;
        break;
      }
    }
  }

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

  // get back after clicking on back button
  const backElement = document.querySelectorAll(`.back-button`);

  backElement.forEach(ele => {
    ele.addEventListener('click', () => {
      formElement.classList.toggle('active');
      cardElement.classList.toggle('active');
    });
  });

  // edit item in category content and save it
  // categoriesArray[categoryIndex].content[itemIndexInCategory] = {
  //   id: itemId,
  //   name: newName,
  //   price: newPrice,
  //   quantity: newQuantity
  // };
  // localStorage.setItem('menu-categories', JSON.stringify(categoriesArray));
  // allCategories = categoriesArray;

  // if (newName && newQuantity && newPrice) {
  //   console.log('new name is: ', newName);
  //   console.log('new quantity is: ', newQuantity);
  //   console.log('new price is: ', newPrice);
  // }
}

