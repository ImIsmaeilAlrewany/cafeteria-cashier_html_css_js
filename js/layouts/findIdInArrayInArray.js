// common function to find Id in array inside array by getting array and id
function findIdInArrayInArray(array, secondArray, id) {
  let indexes = [];

  for (let i = 0; i < array.length; i++) {
    for (let n = 0; n < array[i][secondArray].length; n++) {
      if (+array[i][secondArray][n].id === +id) {
        indexes = [i, n];
      }
    }
  }

  return indexes;
}

export default findIdInArrayInArray;
