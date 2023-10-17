// change language button work
const langButton = document.querySelector('.nav-options #lang');

if (langButton)
  langButton.addEventListener('click', (e) => {
    if (e.target.dataset.lang === 'ar') {
      localStorage.setItem('lang', 'en');
      e.target.innerHTML = `<i class="fa-solid fa-a"></i>`;
      e.target.dataset.lang = 'en';
      location.reload();
    } else if (e.target.dataset.lang === 'en') {
      localStorage.setItem('lang', 'ar');
      e.target.innerHTML = `<i class="fa-solid fa-e"></i>`;
      e.target.dataset.lang = 'ar';
      location.reload();
    }
  });

// check the language
if (langButton)
  if (lang === 'ar') {
    langButton.innerHTML = `<i class="fa-solid fa-e"></i>`;
    langButton.dataset.lang = 'ar';
  } else {
    langButton.innerHTML = `<i class="fa-solid fa-a"></i>`;
    langButton.dataset.lang = 'en';
  }
