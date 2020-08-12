const { expect } = require("chai");

describe("Deploy", function() {
  it("interact with deployed contract", async function() {
    const [owner] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("quadraticBallot");

    const ballot = await Ballot.deploy();
    await ballot.deployed();
    
    const chairPerson = await ballot.getChairPerson();

    // expect(chairPerson.to.equal(owner.getAddress()));

  });
});
