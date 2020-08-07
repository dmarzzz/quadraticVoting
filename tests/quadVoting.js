const { expect } = require("chai");

describe("deploy", function() {
  it("interact with deployed contract", async function() {
    const [owner] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("quadVoting");

    const ballot = await Ballot.deploy();
    await ballet.deployed();

  });
});
