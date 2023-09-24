const includeHTML = async (url, container) => {
  const response = await fetch(url);
  const htmlContent = await response.text();
  document.querySelector(container).innerHTML = htmlContent;
};
