const resetHolderAmount = (holdersArr) => {
  holdersArr.forEach((holder) => {
    holder.balance = Math.round(holder.balance / 10000000);
  });
  return holdersArr;
};

module.exports = {
  resetHolderAmount,
};
