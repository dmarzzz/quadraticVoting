const { expect } = require("chai");

  let owner;
  let ballot;
  let Ballot;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Ballot = await ethers.getContractFactory("quadraticBallot");
    ballot = await Ballot.deploy();
    ballot.deployed();
  })

  describe(" get chair person", function () {

    it("Should equal the address of the sender", async function () {
      expect(await ballot.getChairPerson()).to.equal(await owner.getAddress());
    })
    
  
  })

  describe("Instantiation", function() {

  it("Vote 'AGAINST' test", async function() {
    await ballot.registerVoter();
    await ballot.vote(0,0)
    const voteCountAgainst = await ballot.getVoteCountAgainst(0);
    const balance = await ballot.getBalance();
    expect(await voteCountAgainst).to.equal(1);
  });

  it("Vote 'FOR' test", async function() {
    await ballot.registerVoter()
    await ballot.vote(0,1)
    const voteCountFor = await ballot.getVoteCountFor(0);
    expect(await voteCountFor).to.equal(1);
  });

  it("test voter balance after 1 vote", async function() {
    await ballot.registerVoter();
    const balanceBefore = await ballot.getBalance();
    await ballot.vote(0,0)
    await ballot.getVoteCountAgainst(0);
    expect(await ballot.getBalance()).to.not.equal(balanceBefore);
  });

  it("test voter balance after 2 votes", async function() {
    await ballot.registerVoter();
    const balanceBefore = await ballot.getBalance();
    await ballot.vote(0,0)
    await ballot.vote(0,0)
    expect(await ballot.getBalance()).to.equal(7);
  });

  it("test voter balance after 3 votes", async function() {
    await ballot.registerVoter();
    const balanceBefore = await ballot.getBalance();
    await ballot.vote(0,0)
    await ballot.vote(0,0)
    await ballot.vote(0,0)
    expect(await ballot.getBalance()).to.equal(3);
  });


});
