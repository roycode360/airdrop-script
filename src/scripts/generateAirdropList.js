const fs = require("fs");
const { stringify } = require("csv-stringify");
const { resetHolderAmount } = require("../utils/resetHolderAmount");
const { fetchMultipleHolders } = require("../utils/fetchAirdropHolders");
const { filterAirdropHolders } = require("../utils/filterAirdropHolders");

const generateAirdropList = async () => {
  try {
    // 1. Get all holders of all tokens.
    const fetchRes = await fetchMultipleHolders();
    console.log("fetch result", fetchRes.length);
    // 2. reset amount value.
    const holders = resetHolderAmount(fetchRes);
    console.log("total holders", holders.length);
    // 3. Filter holders and remove specific accounts.
    const qualifiedHolders = filterAirdropHolders(holders);
    console.log("qualified holders", qualifiedHolders.length);
    // 4. Generate new array of accounts 3388 SOLS reward attached for each account.
    const csvAccounts = qualifiedHolders.map((acc) => {
      acc.reward = 3388;
      return acc;
    });
    // 6. create a csv file with the csvAccounts
    stringify(
      csvAccounts,
      {
        header: true,
      },
      function (err, output) {
        fs.writeFile(
          __dirname + "/airdrop-reward-list.csv",
          output,
          (err, data) => {
            console.log(data);
          }
        );
      }
    );
  } catch (e) {
    console.log("Airdrop list error", e);
  }
};

module.exports = generateAirdropList;
