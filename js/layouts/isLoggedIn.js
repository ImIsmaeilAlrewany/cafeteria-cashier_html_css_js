// check if client is logged in
const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'));
if (!isLoggedIn) location.href = './login.html';