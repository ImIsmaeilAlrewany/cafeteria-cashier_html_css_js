// slide menu toggle
import toggleActive from "./toggleActive.js";
const bars = document.getElementById('bars');
const slideMenu = document.getElementById('slide-menu');

if (bars) toggleActive(bars, slideMenu);

// add active to the correct file link
document.querySelectorAll('nav ul li a').forEach(link => {
  if (link.dataset.file === path) link.classList.add('active');
});

// start work with logout
const logout = document.getElementById('logout');

if (logout) logout.addEventListener('click', () => {
  // save the end of session and workHours for clients
  const onlineClient = JSON.parse(sessionStorage.getItem('onlineClient')) || [];
  const clientsWork = JSON.parse(localStorage.getItem('clients-work')) || [];
  for (let i = 0; i < clientsWork.length; i++) {
    const sessions = clientsWork[i].work[clientsWork[i].work.length - 1].sessions;
    if (clientsWork[i].clientName === onlineClient.name) {
      sessions[sessions.length - 1].end = Date.now();
      const start = sessions[sessions.length - 1].start;
      const end = sessions[sessions.length - 1].end;

      // get hours
      const hours = (+end - +start) / 3600000;
      clientsWork[i].work[clientsWork[i].work.length - 1].workHours += hours;
      localStorage.setItem('clients-work', JSON.stringify(clientsWork));
      break;
    }
  }

  // logout from website
  sessionStorage.removeItem('onlineClient');
  sessionStorage.setItem('isLoggedIn', false);
  location.reload();
});

