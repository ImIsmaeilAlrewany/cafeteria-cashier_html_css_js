// bring all done tables
const paidOrders = JSON.parse(localStorage.getItem('paid-orders')) || [];

// bring all canceled tables
const canceled = JSON.parse(localStorage.getItem('canceled-tables')) || [];

// display function to the data for the correct date
const showDay = (button, select, array, callback) => {
  button.addEventListener('click', () => {
    for (let i = 0; i < array.length; i++) {
      if (select.value === array[i].date) {
        callback(array[i].data);
        break;
      }
    }
  });
};

// display all tables (rows and columns) inside table body function
const buildTable = (table, array, length) => {
  table.innerHTML = '';
  for (let i = 0; i < length; i++) {
    const tr = document.createElement('tr');
    const tdData = [array[i].table.name, array[i].cashier, array[i].ordersNumber, array[i].totalPrice + ` ${lang === 'ar' ? 'جنية' : 'LE'}`];

    // add td data in tr
    tdData.forEach(d => {
      const td = document.createElement('td');
      td.textContent = d;
      tr.append(td);
    });

    // this to open details page so I get the table id and get all data around it
    tr.onclick = function () {
      sessionStorage.setItem('process-details', JSON.stringify(array[i].table.id));
      location.href = '../../details.html';
    };
    table.append(tr);
  }
};

// show only mount of rows function
const showRows = (button, select, array, tableBody) => {
  let data;

  button.addEventListener('click', () => {
    // get data first
    for (let i = 0; i < array.length; i++) {
      if (array[i].date === selectDate.value) data = array[i].data;
    }

    // show the mount of rows
    if (data.length > +select.value) buildTable(tableBody, data, +select.value);
    else buildTable(tableBody, data, data.length);
  });
};
