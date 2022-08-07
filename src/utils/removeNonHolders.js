const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");
const axios = require("axios");

const removeNonHolders = async (ocntHolders) => {
  const oceantokensHolders = [];
  const bothHolders = [];
  try {
    for (i = 1; i > -1; i++) {
      // console.log("cursor", i === 1 ? 1 : (i - 1) * 200 + 1, "limit", i * 200);
      const fracOfHolders = await axios.get(
        `https://api.stellar.expert/explorer/public/asset/OCEANTOKEN-GCWYGXMLDEQBIXT5IRLP6H3YYTJ6N43U2XX2EGJENNF4ACP7WOFCVYGO/holders?order=asc&cursor=${
          i === 1 ? 0 : (i - 1) * 200
        }&limit=${i * 200}`
      );
      if (fracOfHolders.data._embedded.records.length === 0) {
        break;
      }
      oceantokensHolders.push(...fracOfHolders.data._embedded.records);
    }
    console.log("Oceantokens holders", oceantokensHolders.length);
    for (let i = 0; i < oceantokensHolders.length; i++) {
      ocntHolders.forEach((user) => {
        if (user.account === oceantokensHolders[i].account) {
          bothHolders.push(user);
        }
      });
    }
    return bothHolders;
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = removeNonHolders;
