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
        if (lang === 'ar')
          loginWarnings[0].innerHTML = 'هذا الكاشير غير موجود';
        else
          loginWarnings[0].innerHTML = 'This Cashier Isn\'t Existed';
      }
    }

    // if client name or phone is correct and existed check password
    if (data.password !== matchedData.password) {
      e.preventDefault();
      isLoggedIn = false;
      if (lang === 'ar')
        loginWarnings[1].innerHTML = 'الرقم السري غير صحيح';
      else
        loginWarnings[1].innerHTML = 'Password Isn\'t Correct';
    } else {
      // e.preventDefault();
      loginWarnings[1].innerHTML = '';
      isLoggedIn = true;

      // if data matches save client is loggedIn in session storage
      sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      sessionStorage.setItem('onlineClient', JSON.stringify(matchedData));

      // set the site language in local storage
      if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'ar');

      // set clients work data inside local storage
      const clientWorkNewDayNewMonth = {
        date: date.toLocaleDateString(),
        sessions: [
          {
            start: Date.now(),
            end: ''
          }
        ],
        workHours: 0,
        completedTables: 0,
        canceledTables: 0,
        products: 0,
        money: 0
      };

      const clientWorkDataFirstSave = {
        clientName: matchedData.name,
        clientPhone: matchedData.phone,
        work: [clientWorkNewDayNewMonth]
      };

      if (clientsWork.length > 0) {
        let clientIndex;
        for (let i = 0; i < clientsWork.length; i++) {
          if (clientsWork[i].clientName === matchedData.name) clientIndex = i;
        }

        // after searching on the client I exact
        if (typeof clientIndex === 'number') {
          // I have found the client data already in local storage
          const workList = clientsWork[clientIndex].work;
          if (new Date(workList[workList.length - 1].date).getMonth() === date.getMonth()) {
            // here if it is the same month
            // we need to check the day
            if (new Date(workList[workList.length - 1].date).getDate() === date.getDate()) {
              // the day is already in
              workList[workList.length - 1].sessions.push(
                {
                  start: Date.now(),
                  end: ''
                }
              );
            } else {
              //the day is new
              workList.push(clientWorkNewDayNewMonth);
            }
          } else {
            // here if they are not the same so we start a new array
            workList = [clientWorkNewDayNewMonth];
          }
        } else {
          // I didn't find the client in local storage so I am gonna add
          clientsWork.push(clientWorkDataFirstSave);
        }
      } else {
        clientsWork.push(clientWorkDataFirstSave);
      }

      localStorage.setItem('clients-work', JSON.stringify(clientsWork));
      login.submit();
    }
  }
});
