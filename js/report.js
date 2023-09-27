import selectFromMenu from './layouts/selectFromMenu.js';

const reference = [
  { name: 'general', path: '../layouts/report-general.html' },
  { name: 'done', path: '../layouts/report-done.html' },
  { name: 'canceled', path: '../layouts/report-canceled.html' },
  { name: 'runout', path: '../layouts/report-runout.html' },
  { name: 'cashier', path: '../layouts/report-cashier.html' },
];

// when loading the page first includes general file
includeHTML(reference[0].path, '.option-details', true);

// work on report page and starts with select from menu options
const optionsList = document.querySelectorAll('.report .options li');

if (optionsList) selectFromMenu(optionsList, (index) => {
  for (let i = 0; i < reference.length; i++) {
    if (optionsList[index].dataset.option === reference[i].name) {
      includeHTML(reference[i].path, '.option-details', true);
    }
  }
});

