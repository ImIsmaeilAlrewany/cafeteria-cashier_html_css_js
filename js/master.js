// start with slide menu
const bars = document.getElementById('bars');
const slideMenu = document.getElementById('slide-menu');

// ***custom function to toggle active class
function toggleActive(button, element) {
  button.addEventListener('click', () => {
    if (element.classList.contains('active')) element.classList.remove('active');
    else element.classList.add('active');
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

// work with adding tables and save it in local storage
const addTable = document.getElementById('add-table');
const tablesModal = document.getElementById('tables-modal');
const addTableInput = document.getElementById('add-table-input');
const addTableButton = document.getElementById('add-table-submit');
const closeTableModal = document.getElementById('close-table-button');
const tablesContainer = document.getElementById('tables-container');

let tables = [
  {
    id: 1,
    name: "طاولة 1",
  }
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
  return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" href="#" role="button">
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
const collectAndCreate = (submit, input, outputEle, callback) => {

  // return callback func to other func to invoke it
  const effect = (data) => callback(data);
  let inputData = '';

  submit.onclick = function (e) {
    e.preventDefault();
    inputData = input.value;
    input.value = '';

    const output = effect(inputData);
    outputEle.innerHTML = outputEle.innerHTML + output;
  };
};

if (addTableButton)
  collectAndCreate(addTableButton, addTableInput, tablesContainer, (data) => {
    tables.push({ id: tables.length + 1, name: data });
    localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

    return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" href="#" role="button">
    <i class="fa-solid fa-chair"></i>
    <span class="ms-2">${data}</span>
  </a>`;
  });

//====================================================//

// start work with adding new clients (register)
const register = document.getElementById('register');
const registerInputs = document.querySelectorAll('.register .form-control');
const registerWarnings = document.querySelectorAll('.register .form-text');

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

// submit new data will be after clicking on edit profile button
if (profile) profile.addEventListener('submit', (e) => {
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  let isFormValid = true;
  let clientIndex;

  for (let i = 0; i < clients.length; i++) {
    if (clients[i].name === profileData.name && clients[i].phone === profileData.phone && clients[i].password === profileData.password) {
      clientIndex = i;
      break;
    }
  }

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
              isFormValid = false;
              profileWarnings[0].innerHTML = uniqueMes;
              break;
            }
          }
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
  }
});



