import collectData from './layouts/collectData.js';

// start work with edit profiles data
const profile = document.getElementById('profile');
const profileName = document.getElementById('profile-cashier-name');
const profilePhone = document.getElementById('profile-cashier-phone');
const profilePassword = document.getElementById('profile-cashier-password');
const profileNewPassword = document.getElementById('profile-cashier-newpassword');
const profileWarnings = document.querySelectorAll('#profile .form-text');

// all warning messages if client entered wrong data
const warningMessages = [
  lang === 'ar' ? 'مسموح فقط الحروف وأزيد من ثلاث حروف' : 'Only Letters And Over Three',
  lang === 'ar' ? 'مسموح فقط أرقام الهاتف' : 'Only Phone Numbers',
  lang === 'ar' ? 'لا يقل عن 7 وعلى الأقل حرف أو رمز' : 'At Least 7 Letters And A Symbol'
];

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
  // e.preventDefault();
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
              isFormValid = false;
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
      uniqueMessage: lang === 'ar' ? 'هذا الإسم استخدم من قبل' : 'This Name Is In Use'
    },
    {
      key: 'phone',
      condition: data.phone.length != 11 || !Number(data.phone),
      unique: true,
      uniqueMessage: lang === 'ar' ? 'هذا الرقم استخدم من قبل' : 'This Phone Number Is In Use'
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
    profileWarnings[2].innerHTML = lang === 'ar' ? 'الرقم السري خطأ حاول من جديد' : 'Password Is Wrong Try Again';
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

