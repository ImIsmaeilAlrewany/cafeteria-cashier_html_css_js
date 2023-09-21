function selectTable() {
  const allTables = document.querySelectorAll('.table');
  const tablesInStorage = JSON.parse(localStorage.getItem('cafeteria-tables'));
  allTables.forEach((table, index) => {
    table.addEventListener('click', () => {
      sessionStorage.setItem('selected-table', JSON.stringify(tablesInStorage[index]));
      table.href = 'order.html';
    });
  });
}

export default selectTable;
