const fs = require("fs");
const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");
const sourceKeys = StellarSdk.Keypair.fromSecret(/* wallet secret key */);
const { parse } = require("csv-parse");
const { numOfTrans } = require("../utils/calcNumOfTrans");
const { Asset } = require("stellar-sdk");

const sendAirdrops = async () => {
  const parser = parse(
    { columns: true, cast: true, delimiter: "," },
    async function (err, records) {
      try {
        const transArr = [];
        // 1. Determine the number transactions
        const transactionNum = numOfTrans(records);
        console.log("number of trans:", transactionNum);
        // 2. Build transactions
        const sourceAccount = await server.loadAccount(sourceKeys.publicKey());
        for (i = 0; i < 2; i++) {
          let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: "10000", // transaction fee in troops
            networkPassphrase: StellarSdk.Networks.PUBLIC,
          });
          const batch = records.slice(i * 100, (i + 1) * 100);
          console.log(batch.length, "current batch - num of users");
          // attatch payment operation for all users in the current batch
          for (x = 0; x < batch.length; x++) {
            // determine claimable dates for each transaction (variable claimable dates)
            const daysLimit = 259200; // 3 days in seconds
            const fracOfLimit = parseFloat((Math.random() + 0.6).toFixed(1));
            const limit = daysLimit * fracOfLimit;

            // create claimable conditions based on a time limit
            let accountCondition =
              StellarSdk.Claimant.predicateBeforeRelativeTime(limit.toString());
            let ownerCondition = StellarSdk.Claimant.predicateNot(
              StellarSdk.Claimant.predicateUnconditional()
            );
            transaction.addOperation(
              StellarSdk.Operation.createClaimableBalance({
                asset: new Asset("CODE", "ISSUER"),
                amount: "1000", // airdrop amount
                claimants: [
                  new StellarSdk.Claimant(batch[x].account, accountCondition),
                  new StellarSdk.Claimant(
                    sourceKeys.publicKey(),
                    ownerCondition
                  ),
                ],
              })
            );
          }
          // add a memo
          transaction.addMemo(StellarSdk.Memo.text("your token airdrop"));
          transaction.setTimeout(18640);
          transaction = transaction.build();
          transaction.sign(sourceKeys);
          transArr.push(transaction);
        }
        //   5. Loop through transaction arr and submit each transaction. Moves to next one only if previous one was successful.
        console.log(transArr.length, "num of transactions created");
        for (let i = 0; i < transArr.length; i++) {
          let result = await server.submitTransaction(transArr[i]);
          console.log(`Transaction ${i + 1} submitted successfully!`);
        }
      } catch (e) {
        if (e.response) {
          console.log(
            "Token Server Error: ",
            e.response.data.extras
              ? e.response.data.extras.result_codes
              : e.response.data
          );
        } else {
          console.log("Token Build Error: ", e.message);
        }
      }
    }
  );
  fs.createReadStream(__dirname + "/airdrop-reward-list.csv").pipe(parser);
};

const airdropScript = async () => {
  sendAirdrops();
};

module.exports = {
  airdropScript,
};
