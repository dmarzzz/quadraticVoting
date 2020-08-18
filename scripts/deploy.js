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

  const Ballot = await ethers.getContractFactory("quadraticBallot");
  const quadraticBallot = await Ballot.deploy(8, [ethers.utils.formatBytes32String('1'), ethers.utils.formatBytes32String('2') , ethers.utils.formatBytes32String('3')] );
  await quadraticBallot.deployed();

  console.log("ballot address:", quadraticBallot.address);

  // We also save the contract's artifacts and address in the client directory
  saveClientFiles(quadraticBallot);
}

//TO DO: save artifacts to demo and backend

function saveClientFiles(quadraticBallot) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ballot: quadraticBallot.address }, undefined, 2)
  );

  fs.copyFileSync(
    __dirname + "/../artifacts/quadraticBallot.json",
    contractsDir + "/quadraticBallot.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
