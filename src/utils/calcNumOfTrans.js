const numOfTrans = (arr) => {
  return Math.ceil(arr.length / 100);
  // return Math.ceil(arr.length / 1); //test
};

module.exports = {
  numOfTrans,
};
