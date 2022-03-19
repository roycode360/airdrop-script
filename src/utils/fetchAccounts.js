const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");

const fetchAccounts = async (arr) => {
  const accounts = [];

  for (i = 0; i < arr.length; i++) {
    await server
      .loadAccount(arr[i].account)
      .then((accountInfo) => {
        accounts.push(accountInfo);
      })
      .catch((e) => {
        console.log("Error: Account not found!");
      });
  }
  return accounts;
};

module.exports = {
  fetchAccounts,
};
