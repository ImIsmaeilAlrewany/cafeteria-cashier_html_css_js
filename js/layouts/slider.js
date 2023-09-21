// slide menu toggle
import toggleActive from "./toggleActive.js";
const bars = document.getElementById('bars');
const slideMenu = document.getElementById('slide-menu');

if (bars) toggleActive(bars, slideMenu);

// start work with logout
const logout = document.getElementById('logout');

if (logout) logout.addEventListener('click', () => {
  sessionStorage.removeItem('onlineClient');
  sessionStorage.setItem('isLoggedIn', false);
  location.reload();
});

