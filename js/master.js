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

// ***change css variables function
const changeVar = (button, colors) => {
  button.addEventListener('click', () => {
    for (const prop in colors) {
      document.documentElement.style.setProperty(prop, colors[prop]);
    }
  });
};

changeVar(light, colors.light);
changeVar(dark, colors.dark);

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

// submit data and check if it correct then save it
if (register) register.addEventListener('submit', (e) => {
  const data = collectData(registerInputs);
  let dataCorrect = false;
  let dataUnique = true;
  let clients = [];

  // get any data in local storage first
  if (localStorage.getItem('clients')) {
    const savedData = localStorage.getItem('clients');
    clients.push(...JSON.parse(savedData));
  }

  // array of objects to use in checkCorrect function
  const funcArguments = [
    {
      condition: data.name.length < 3 || Number(data.name),
      message: 'مسموح فقط الحروف وأزيد من ثلاث حروف'
    },
    {
      condition: data.phone.length != 11 || !Number(data.phone),
      message: 'مسموح فقط أرقام الهاتف'
    },
    {
      condition: data.password.length < 7 || Number(data.password),
      message: 'لا يقل عن 7 وعلى الأقل حرف أو رمز'
    }
  ];

  // ***function to check correct input data
  // it needs condition and output(element, message)
  const checkData = (condition, warningEle, warningMes) => {
    if (condition) {
      e.preventDefault();
      dataCorrect = false;
      warningEle.innerHTML = warningMes;
    } else {
      dataCorrect = true;
      warningEle.innerHTML = '';
    }
  };

  // check name, phone and password if are correct
  funcArguments.forEach((argument, index) => {
    checkData(argument.condition, registerWarnings[index], argument.message);
  });

  // check if data is unique
  if (clients.length !== 0)
    clients.forEach(client => {
      if (client.name !== data.name && client.phone !== data.phone) {
        dataUnique = true;
      } else {
        dataUnique = false;
        e.preventDefault();
        registerWarnings.forEach(w => {
          w.innerHTML = 'الإسم أو رقم الهاتف استخدم من قبل';
        });
      }
    });

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


