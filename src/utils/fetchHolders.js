const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");
const axios = require("axios");

const fetchHolders = async () => {
  const totalHolders = [];
  try {
    for (i = 1; i > -1; i++) {
      // console.log("cursor", i === 1 ? 1 : (i - 1) * 200 + 1, "limit", i * 200);
      const fracOfHolders = await axios.get(
        `https://api.stellar.expert/explorer/public/asset/OCNT-GBTUK75C3YMYDQ2I7UFVI7C5VEXSPFCUTXGLSUTLVS7CUYFMC5ITCX7H/holders?order=asc&cursor=${
          i === 1 ? 0 : (i - 1) * 200
        }&limit=${i * 200}`
      );
      if (fracOfHolders.data._embedded.records.length === 0) {
        break;
      }
      totalHolders.push(...fracOfHolders.data._embedded.records);
    }
    // const holders = result._embedded.records;
    console.log("Total holders", totalHolders.length);
    return totalHolders;
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  fetchHolders,
};
