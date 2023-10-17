// this is a function I made it in layout instead of repeating it
// it takes elements array and json object to change elements content
const checkLang = (allElements, object) => {
  if (lang === 'en') {
    allElements.forEach(ele => {
      if (Object.keys(object).includes(ele.textContent))
        ele.textContent = object[ele.textContent];
    });
  }
};
