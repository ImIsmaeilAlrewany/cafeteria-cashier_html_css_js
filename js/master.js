import toggleActive from "./layouts/toggleActive.js";
import generateId from "./layouts/generateId.js";
import collectAndCreate from "./layouts/collectAndCreate.js";
import printElementsAndForm from "./layouts/printElementsAndForm.js";
import findIdInArray from './layouts/findIdInArray.js';
import findIdInArrayInArray from './layouts/findIdInArrayInArray.js';

// get all ids that are saved in local storage
let allIds = JSON.parse(localStorage.getItem('allIds')) || [];

// get all ids that are saved in local storage
let tables = JSON.parse(localStorage.getItem('cafeteria-tables')) || [];

// get all ids that are saved in local storage
let allCategories = JSON.parse(localStorage.getItem('menu-categories')) || [];

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


//=================================================//

// work on order page starting with taking the table name
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





