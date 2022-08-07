const fs = require("fs");
const { stringify } = require("csv-stringify");
const { resetHolderAmount } = require("../utils/resetHolderAmount");
const { fetchMultipleHolders } = require("../utils/fetchAirdropHolders");
const { filterAirdropHolders } = require("../utils/filterAirdropHolders");
const { fetchHolders } = require("../utils/fetchHolders");
const removeNonHolders = require("../utils/removeNonHolders");

const generateAirdropList = async () => {
  try {
    // 1. Get all holders of all tokens.
    const fetchRes = await fetchHolders();
    console.log("fetch result", fetchRes.length);
    // 2. reset amount value.
    const holders = resetHolderAmount(fetchRes);
    console.log("total holders", holders.length);
    // 3. Filter holders and remove specific accounts.
    const qualifiedHolders = filterAirdropHolders(holders);
    console.log("qualified holders", qualifiedHolders.length);
    // 4. Generate new array of accounts 3388 SOLS reward attached for each account.
    // let sum = 0;
    const csvAccounts = qualifiedHolders.map((acc) => {
      acc.reward = (acc.balance * 10) / 50;
      // sum = sum + acc.reward;
      return acc;
    });
    // filter non oceantoken holders
    console.log("Ocnt holders", csvAccounts.length);
    const finalList = await removeNonHolders(csvAccounts);
    console.log("both holders", finalList.length);
    // 6. create a csv file with the csvAccounts
    stringify(
      finalList,
      {
        header: true,
      },
      function (err, output) {
        fs.writeFile(
          __dirname + "/ocnt-reward-list.csv",
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
