const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(
  cors({
    origin: '*',
  })
);

/**
 * Demonstrates the use of Gateway Network & Contract classes
 */

// Needed for reading the connection profile as JS object
const fs = require('fs');
// Used for parsing the connection profile YAML file
const yaml = require('js-yaml');
// Import gateway class
const {
  Gateway,
  FileSystemWallet,
  DefaultEventHandlerStrategies,
  Transaction,
} = require('fabric-network');

// Constants for profile
const CONNECTION_PROFILE_PATH = '../profiles/dev-connection.yaml';
// Path to the wallet
const FILESYSTEM_WALLET_PATH = './user-wallet';
// Identity context used
const USER_ID = 'Admin@budget.com';
// Channel name
const NETWORK_NAME = 'airlinechannel';
// Chaincode
const CONTRACT_ID = 'erc20';

//READ Request Handlers
app.get('/', (req, res) => {
  res.send('Welcome to Blockchain REST API with Node.js!!');
});

app.get('/api/transactions/:id', async (req, res) => {
  await queryContract(req.params.id).then((str) => {
    const detailsStartIndex = str?.indexOf('"status":') + 9;
    const detailsEndIndex = str?.indexOf('}');

    const details = str?.slice(detailsStartIndex, detailsEndIndex - 1)?.split('+');
    const result = details
      ? {
          from: details[0],
          to: details[1],
          amount: details[2],
          status: details[3],
          timestamp: details[4],
        }
      : {};
    res.status(200).json({ response: str, result });
  });
});

//CREATE Request Handler
app.post('/api/transactions', async (req, res) => {
  await submitTxnContract(req.body).then((str) => {
    const idStartIndex = str?.indexOf('id:') + 4;
    const idEndIndex = idStartIndex + 36;
    const id = str.slice(idStartIndex, idEndIndex);
    res.status(200).json({ response: str, id: id });
  });
});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8082;
app.listen(port, () =>
  console.log(`Listening on https://localhost:${port} ...`)
);

let gateway = undefined;
let contract = undefined;
// Sets up the gateway | executes the invoke & query
main();

/**
 * Executes the functions for query & invoke
 */
async function main() {
  // 1. Create an instance of the gatway
  gateway = new Gateway();

  // 2. Setup the gateway object
  await setupGateway();

  // 3. Get the network
  let network = await gateway.getNetwork(NETWORK_NAME);
  // console.log('##################NETWORK');
  // console.log(network);

  // 5. Get the contract
  contract = await network.getContract(CONTRACT_ID);
  // console.log('##################CONTRACT');
  // console.log(contract);

  const client = gateway.getClient();
  // console.log('##################CLIENT', client);

  const identity = gateway.getCurrentIdentity();
  // console.log('##################IDENTITY', identity);

  // 6. Query the chaincode
  // await queryContract(contract)

  // 7. Execute the transaction
  // await submitTxnContract(contract)
  // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
  // await submitTxnTransaction(contract);

  // await queryContract(contract);
}

/**
 * Queries the chaincode
 * @param {object} contract
 */
async function queryContract(transactionId) {
  try {
    // Query the chaincode
    // let response = await contract.evaluateTransaction(
    //   'getTransaction',
    //   transactionId
    // );
    let response = await queryTxnTransaction(contract, transactionId);

    console.log(`Query Response=${response.toString()}`);
    return `Query Response=${response.toString()}`;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Submit the transaction
 * @param {object} contract
 */
async function submitTxnContract(body) {
  try {
    // Submit the transaction
    // let response = await contract.submitTransaction(
    //   'setTransaction',
    //   body.from,
    //   body.to,
    //   body.amount,
    //   body.status
    // );

    let response = await submitTxnTransaction(contract, body);

    console.log(`Query Response=${response.toString()}`);
    return `Query Response=${response.toString()}`;
  } catch (e) {
    // fabric-network.TimeoutError
    console.log(e);
  }
}

/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
async function setupGateway() {
  // 2.1 load the connection profile into a JS object
  let connectionProfile = yaml.safeLoad(
    fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8')
  );

  // 2.2 Need to setup the user credentials from wallet
  const wallet = new FileSystemWallet(FILESYSTEM_WALLET_PATH);

  // 2.3 Set up the connection options
  let connectionOptions = {
    identity: USER_ID,
    wallet: wallet,
    discovery: { enabled: false, asLocalhost: true },
    /*** Uncomment lines below to disable commit listener on submit ****/
    eventHandlerOptions: {
      strategy: null,
    },
  };

  // 2.4 Connect gateway to the network
  await gateway.connect(connectionProfile, connectionOptions);
  console.log(gateway);
}

/**
 * Creates the transaction & uses the submit function
 * Solution to exercise
 * To execute this add the line in main() => submitTxnTransaction(contract)
 * @param {object} contract
 */
async function submitTxnTransaction(contract, body) {
  // Provide the function name
  let txn = contract.createTransaction('setTransaction');

  // Get the name of the transaction
  console.log(txn.getName());

  // Get the txn ID
  console.log(txn.getTransactionID());

  // Submit the transaction
  try {
    let response = await txn.submit(
      body.from,
      body.to,
      body.amount,
      body.status
    );
    console.log('transaction.submit()=', response.toString());
    return response.toString();
  } catch (e) {
    console.log(e);
  }
}

async function queryTxnTransaction(contract, id) {
  // Provide the function name
  let txn = contract.createTransaction('getTransaction');

  // Get the name of the transaction
  console.log(txn.getName());

  // Get the txn ID
  console.log(txn.getTransactionID());

  // Submit the transaction
  try {
    let response = await txn.submit(id);
    console.log('transaction.submit()=', response.toString());
    return response.toString();
  } catch (e) {
    console.log(e);
  }
}
