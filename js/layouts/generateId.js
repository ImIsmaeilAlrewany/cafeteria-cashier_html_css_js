// generate ids function
let allIds = JSON.parse(localStorage.getItem('allIds')) || [];

const generateId = () => {
  const generate = () => Math.floor(Math.random() * (999999 - 0)) + 100000;

  const id = generate();
  for (let i = 0; i < allIds.length; i++) if (allIds[i] === id) generateId();

  allIds.push(id);
  localStorage.setItem('allIds', JSON.stringify(allIds));
  return id;
};

export default generateId;
