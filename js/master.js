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
        outputEle.innerHTML = outputEle.innerHTML + (output || '');

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
  collectAndCreate(categoryModalSubmit, addCategoryInput, { arr: allCategories, ele: categoryModalWarning }, categoriesContainer, (data) => {
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

    categoriesList = categoriesList.filter(val => parseInt(val.id) != parseInt(data_id));
    idsList = idsList.filter(id => id != data_id);

    category.remove(); // category.parentElement.removeChild(category)
    localStorage.setItem('allIds', JSON.stringify(idsList));
    localStorage.setItem('menu-categories', JSON.stringify(categoriesList));
    allCategories = categoriesList;
    allIds = idsList;
    // document.querySelectorAll('[data-id="value"]');
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

