// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "buidlerevm") {
    console.warn(
      "You are trying to deploy a contract to the Buidler EVM network, which" +
        "gets automatically created and destroyed every time. Use the Buidler" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const quadraticBallot = await ethers.getContractFactory("quadraticBallot");
  const ballot = await quadraticBallot.deploy(8);
  await ballot.deployed();

  console.log("ballot address:", ballot.address);

  // We also save the contract's artifacts and address in the client directory
  saveClientFiles(ballot);
}

//TO DO: save artifacts to demo and backend

function saveClientFiles(ballot) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ballot: ballot.address }, undefined, 2)
  );

  fs.copyFileSync(
    __dirname + "/../artifacts/Ballot.json",
    contractsDir + "/Ballot.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
