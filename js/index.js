import toggleActive from "./layouts/toggleActive.js";
import generateId from "./layouts/generateId.js";
import collectAndCreate from "./layouts/collectAndCreate.js";
import selectTable from "./layouts/selectTable.js";

// work with adding tables and save it in local storage
const addTable = document.getElementById('add-table');
const tablesModal = document.getElementById('tables-modal');
const addTableInput = document.getElementById('add-table-input');
const addTableButton = document.getElementById('add-table-submit');
const closeTableModal = document.getElementById('close-table-button');
const tablesContainer = document.getElementById('tables-container');
const tableModalWarning = document.querySelector('#tables-modal #warning-text');

let tables = [];

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

// display all data using collectAndCreate function
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

// verify table button when click on it and go to order page
selectTable();
