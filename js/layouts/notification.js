// work on notification system for categories items
// if an item is about to run out will show a notification message every 10 seconds
function displayNotification(item) {
  const div = document.createElement('div');
  const p = document.createElement('p');
  div.className = 'notification position-absolute border-0 rounded mx-3 shadow';
  p.className = 'p-3 text-center m-0';
  p.textContent = `${item} ${lang === 'ar' ? 'على وشك النفاذ' : 'About To Runout'}`;
  div.appendChild(p);
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000); // remove after 3 seconds
}

const notificationHandler = (array) => {
  const menu = JSON.parse(localStorage.getItem('menu-categories'));

  // find all items quantity below 10 and save them in an Array
  menu.forEach(category => {
    category.content.forEach(item => {
      if (item) if (item.quantity <= 10) array.push(item.name);
    });
  });
};

function notification() {
  let itemsBelow = [];
  let delay = 0;
  notificationHandler(itemsBelow);

  // this AI solution still the output is reversed
  for (let i = 0; i < itemsBelow.length; i++) {
    delay += 3000;
    setTimeout(() => displayNotification(itemsBelow[i]), delay + (i * 3000));
  }

  setTimeout(notification, delay + 10000);
}
notification();
