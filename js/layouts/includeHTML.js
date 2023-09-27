const includeHTML = async (url, container, script = false) => {
  const response = await fetch(url);
  const htmlContent = await response.text();
  document.querySelector(container).innerHTML = htmlContent;

  // Evaluate the scripts in the implemented file 
  if (script) {
    const scripts = document.querySelector(container).querySelectorAll("script");
    for (const script of scripts) { eval(script.textContent); };
  }
};
