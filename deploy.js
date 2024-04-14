const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const url = process.env.RPC_URL;
  const provider = new ethers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync(
    "./FairFlowAccounts_sol_Transactions.abi",
    "utf-8"
  );
  const bin = fs.readFileSync(
    "./FairFlowAccounts_sol_Transactions.bin",
    "utf-8"
  );
  const currentNonce = await provider.getTransactionCount(
    wallet.address,
    "latest"
  ); // Fetch the current nonce

  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
  // console.log("Deploying contract...");
  const contract = await contractFactory.deploy({ nonce: currentNonce });
  await contract.deploymentTransaction().wait(1);
  console.log(`Contract deployed to: ${contract.getAddress}`);

  const senderAddress = "0xFbe408B27f9BE095762d4D097Fe3168cE41487eE";
  const sendingPurpose = "Concrete Purchase";
  const transactionResponse = await contract.addTransaction(
    "25000",
    senderAddress,
    sendingPurpose,
    { nonce: currentNonce + 1 }
  );
  const transactionReceipt = await transactionResponse.wait(1);

  console.log(`Transaction Response: ${transactionReceipt}`);

  // const deploymentReceipt = await contract.deploymentTransaction();
  // console.log(deploymentReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
