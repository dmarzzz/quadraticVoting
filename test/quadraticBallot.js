const { expect } = require("chai");

  let owner;
  let ballot;
  let Ballot;
  let startingBalance = 8;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Ballot = await ethers.getContractFactory("quadraticBallot");
    ballot = await Ballot.deploy(startingBalance);
    ballot.deployed();
  })

  describe(" get chair person", function () {

    it("Should equal the address of the sender", async function () {
      expect(await ballot.getChairPerson()).to.equal(await owner.getAddress());
    })
    
  
  })

  describe("Voting", function() {

  it("1 Vote 'AGAINST'", async function() {
    await ballot.registerVoter();
    await ballot.vote(0,0)
    const voteCountAgainst = await ballot.getVoteCountAgainst(0);
    expect(await voteCountAgainst).to.equal(1);
  });

  it("2 Vote 'AGAINST'", async function() {
    await ballot.registerVoter();
    await ballot.vote(0,0)
    await ballot.vote(0,0)
    const voteCountAgainst = await ballot.getVoteCountAgainst(0);
    expect(await voteCountAgainst).to.equal(2);
  });

  it("1 Vote 'FOR'", async function() {
    await ballot.registerVoter()
    await ballot.vote(0,1)
    const voteCountFor = await ballot.getVoteCountFor(0);
    expect(await voteCountFor).to.equal(1);
  });

  it("2 Vote 'FOR'", async function() {
    await ballot.registerVoter();
    await ballot.vote(0,1)
    await ballot.vote(0,1)
    const voteCountAgainst = await ballot.getVoteCountFor(0);
    expect(await voteCountAgainst).to.equal(2);
  });
})

  describe("Balance", function() {

    it("test voter balance after 1 vote", async function() {
      await ballot.registerVoter();
      const balanceBefore = await ballot.getBalance();
      await ballot.vote(0,0)
      await ballot.getVoteCountAgainst(0);
      expect(await ballot.getBalance()).to.not.equal(balanceBefore);
    });
    
    it("test voter balance after 2 votes", async function() {
      await ballot.registerVoter();
      await ballot.vote(0,0)
      await ballot.vote(0,0)
      expect(await ballot.getBalance()).to.equal(startingBalance-3);
    });
    
    it("test voter balance after 3 votes", async function() {
      await ballot.registerVoter();
      await ballot.vote(0,0)
      await ballot.vote(0,0)
      await ballot.vote(0,0)
      expect(await ballot.getBalance()).to.equal(startingBalance-7);
    });

    it("close vote and against wins", async function() {
      await ballot.registerVoter();
      await ballot.vote(0,0)
      await ballot.vote(0,1)
      await ballot.vote(0,0)
      await ballot.closeVote(0)
      expect(await ballot.getWinner()).to.equal(0);
    });

  })










