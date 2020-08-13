const { expect } = require("chai");


describe("Instantiation", function() {
  it("Instantiate quadraticBallot contract", async function() {
    const [owner] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("quadraticBallot");
    //let args = ['1','2','3'] //[args.map((arg) => web3.utils.asciiToHex(arg))]
    const ballot = await Ballot.deploy();
    await ballot.deployed();
    const chairPerson = await ballot.getChairPerson();
    expect(chairPerson === owner.getAddress());

  });

  it("Vote against test", async function() {
    const Ballot = await ethers.getContractFactory("quadraticBallot");
    const ballot = await Ballot.deploy();
    await ballot.deployed();
    await ballot.vote(0,0)
    const voteCountAgainst = await ballot.getVoteCountAgainst(0);
    expect(voteCountAgainst === 1);
  });

  it("Vote for test", async function() {
    const Ballot = await ethers.getContractFactory("quadraticBallot");
    const ballot = await Ballot.deploy();
    await ballot.deployed();
    await ballot.vote(0,0)
    const voteCountFor = await ballot.getVoteCountFor(0);
    expect(voteCountFor === 1);
  });


});
