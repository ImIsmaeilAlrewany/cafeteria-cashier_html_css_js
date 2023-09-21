// ***collecting clients data function
// to use it your input must have data-from custom attribute
const collectData = (inputs) => {
  let outputObject = {};

  inputs.forEach(input => {
    outputObject[input.dataset.from] = input.value.trim();
  });

  return outputObject;
};

export default collectData;
