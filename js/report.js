import selectFromMenu from './layouts/selectFromMenu.js';

// work on report page and starts with select from menu options
const optionsList = document.querySelectorAll('.report .options li');

if (optionsList) selectFromMenu(optionsList, () => { });