const { expect } = require("chai");

describe("Instantiation", function() {
  it("Instantiate quadraticBallot contract", async function() {
    const [owner] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("quadraticBallot");

    const ballot = await Ballot.deploy([]);
    await ballot.deployed();
    const chairPerson = await ballot.getChairPerson();

    expect(chairPerson === owner.getAddress());

  });
});
