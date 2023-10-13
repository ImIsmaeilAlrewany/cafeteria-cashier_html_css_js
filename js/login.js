import collectData from "./layouts/collectData.js";

// start work with login collecting data from client
const login = document.getElementById('login');
const loginInputs = document.querySelectorAll('#login .form-control');
const loginWarnings = document.querySelectorAll('#login .form-text');

// collect all clients work data for full month
const clientsWork = JSON.parse(localStorage.getItem('clients-work')) || [];

// get the present date
const date = new Date();

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

      // set clients work data inside local storage
      if (clientsWork.length > 0) {
        for (let i = 0; i < clientsWork.length; i++) {
          if (clientsWork[i].clientName === matchedData.name) {

          }
          // if (date.toLocaleDateString() === )
        }
      } else {
        clientsWork.push(
          {
            clientName: matchedData.name,
            clientPhone: matchedData.phone,
            work: [
              {
                date: date.toLocaleDateString(),
                sessions: [
                  {
                    start: date.toLocaleTimeString(),
                    end: ''
                  }
                ],
                workHours: 0,
                completedTables: 0,
                canceledTables: 0,
                products: 0,
                money: 0
              }
            ]
          }
        );
      }

      login.submit();
    }
  }
});
