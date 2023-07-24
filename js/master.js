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

toggleActive(bars, slideMenu);

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
    "--gray": "#ccc"
  },
  dark: {
    "--primary": "#003049",
    "--secondary": "#0369A8",
    "--accent": "#FF8C00",
    "--background": "#121212",
    "--text": "#F0F0F0",
    "--secondary-hover": "#035486",
    "--gray": "#333"
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

tablesContainer.innerHTML = output.join(' ');

// open modal to add new tables for cafeteria
toggleActive(addTable, tablesModal);

// close modal display none the overlay
toggleActive(closeTableModal, tablesModal);

// ***submitting data function
const submitData = (submit, input, outputEle, callback) => {

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

submitData(addTableButton, addTableInput, tablesContainer, (data) => {
  tables.push({ id: tables.length + 1, name: data });
  localStorage.setItem('cafeteria-tables', JSON.stringify(tables));

  return `<a class="table m-2 rounded text-center overflow-hidden text-decoration-none" href="#" role="button">
    <i class="fa-solid fa-chair"></i>
    <span class="ms-2">${data}</span>
  </a>`;
});

//====================================================//



