const StellarSdk = require("stellar-sdk");
const stellarServer = new StellarSdk.Server("https://horizon.stellar.org");
const axios = require("axios");

const fetchClaimables = async () => {
  const claimables = [];
  let main;
  try {
    const { data } = await axios.get(
      "https://horizon.stellar.org/claimable_balances?claimant=GBLFUYWWGJDZVMWA7DEFQGYSS3WIU47HBISYHOUSDT6H2HBWFQFEYM2P"
    );
    data._embedded.records.forEach(async (claimable) => {
      const token = await axios.get(
        `https://api.stellar.expert/explorer/public/asset/${
          claimable.asset.split(":")[0]
        }-${claimable.asset.split(":")[1]}`
      );
      const claimableObj = {
        ...token.data,
        claimId: claimable.id,
        amount: claimable.amount,
        asset_code: claimable.asset.split(":")[0],
        asset_issuer: claimable.asset.split(":")[1],
      };
      claimables.push(claimableObj);
      console.log(claimableObj, "------------");
    });
    const sourceAccount = await stellarServer.loadAccount(
      "GCLHGB6TRIVCZR3AHKAKAWSMV2AXJB5K6LBVQ2Z42GK6U3WXR4QYPC4H"
    );
    main = sourceAccount.balances;
    const resObj = {
      claimables,
      main,
    };
  } catch (e) {
    console.log(e.message, "error------");
  }
};

module.exports = {
  fetchClaimables,
};
