const fs = require("fs");
const { parse } = require("csv-parse");
const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");
const sourceKeys = StellarSdk.Keypair.fromSecret(
  process.env.AIRDROP_SECRET_KEY
);

const totalSum = async () => {
  const parser = parse(
    { columns: true, cast: true, delimiter: "," },
    async function (err, records) {
      try {
        const sum = records.reduce((partialSum, a) => partialSum + a.reward, 0);
        console.log(sum);
      } catch (e) {
        console.log(e);
      }
    }
  );
  fs.createReadStream(__dirname + "/ocnt-reward-list.csv").pipe(parser);
};

module.exports = {
  setDomain,
  totalSum,
};
