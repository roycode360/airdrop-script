const axios = require("axios");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const fs = require("fs");
const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");

const getOperations = async () => {
  let claimants = [];
  let next;
  for (i = 0; i > -1; i++) {
    const { data } = await axios(
      next
        ? next
        : `https://horizon.stellar.org/accounts/GB7LCWO6XBPU2JVLZNC6C6ZSHQK4WE5WVXWDRYCHW7SFDKB3UC5LNAIR/operations?limit=200`
    );
    if (data._embedded.records.length === 0) {
      break;
    }
    // console.log("current batch", i);
    for (x = 0; x < data._embedded.records.length; x++) {
      if (data._embedded.records[x].amount === "3388.0000000") {
        const userObj = {
          account: data._embedded.records[x].claimants[0].destination,
          deadline: data._embedded.records[x].claimants[0].predicate.rel_before,
        };
        if (
          data._embedded.records[x].claimants[0].predicate.rel_before === "0"
        ) {
          claimants.push(userObj);
          console.log(
            data._embedded.records[x].claimants[0].predicate.rel_before
          );
        }
      }
      // console.log("processed user", x);
    }
    next = data._links.next.href;
  }
  console.log("Users", claimants.length);
  stringify(
    claimants,
    {
      header: true,
    },
    function (err, output) {
      fs.writeFile(
        __dirname + "/airdrop-error-list.csv",
        output,
        (err, data) => {
          console.log(data);
        }
      );
    }
  );
  // const { data } = await axios(
  //   "https://horizon.stellar.org/accounts/GB7LCWO6XBPU2JVLZNC6C6ZSHQK4WE5WVXWDRYCHW7SFDKB3UC5LNAIR/operations?limit=200"
  // );
  // console.log(
  //   console.log(data._embedded.records[90])
  //   // data._links.next.href
  //   // data._embedded.records[90].claimants[0].destination,
  //   // data._embedded.records[90].claimants[0].predicate.rel_before
  // );
};

// const getAirdropAdresses = async () => {
//   const parser = parse(
//     { columns: true, cast: true, delimiter: "," },
//     async function (err, records) {
//       console.log(records.length);

//       let accounts = [];
//       for (let i = 0; i < records.length; i++) {
//         const walletId = await axios(
//           `https://horizon.stellar.org/accounts/${records[i].account}`
//         );
//         accounts.push(walletId);
//         console.log(i);
//       }
//       console.log(accounts.length, "-----");
//     }
//   );
//   fs.createReadStream(__dirname + "/airdrop-reward-list.csv").pipe(parser);
// };

module.exports = {
  getOperations,
  // getAirdropAdresses,
};
