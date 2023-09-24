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
  sessionStorage.removeItem('onlineClient');
  sessionStorage.setItem('isLoggedIn', false);
  location.reload();
});

