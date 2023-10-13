// work on showing details for the selected table in done/ canceled tables/ pages
const ddList = document.querySelectorAll('.details dd');
const tableId = JSON.parse(sessionStorage.getItem('process-details')) || 0;
const canceled = JSON.parse(localStorage.getItem('canceled-tables')) || [];
const done = JSON.parse(localStorage.getItem('paid-orders')) || [];
const doneAndCanceled = [...done, ...canceled];

// find all data that this id contains from array in array
// but here is a small issue which is we don't know if this id in canceled tables / done tables
let data;

for (let i = 0; i < doneAndCanceled.length; i++) {
  for (let n = 0; n < doneAndCanceled[i].data.length; n++) {
    if (tableId === doneAndCanceled[i].data[n].table.id) {
      data = [
        doneAndCanceled[i].date,
        doneAndCanceled[i].data[n].cashier,
        doneAndCanceled[i].data[n].table.name,
        doneAndCanceled[i].data[n].table.id,
        doneAndCanceled[i].data[n].canceledTime || doneAndCanceled[i].data[n].paidTime || 'none',
        doneAndCanceled[i].data[n].ordersNumber + ' طلبات',
        doneAndCanceled[i].data[n].totalPrice + ' جنية',
        doneAndCanceled[i].data[n].table.order.map(o => o.name),
      ];
    }
  }
}

// display data
ddList.forEach((dd, i) => dd.textContent = data[i]);
