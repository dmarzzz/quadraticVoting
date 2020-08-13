pragma solidity >0.6.99 <0.8.0;

contract quadraticBallot {

    struct Voter {  
        uint vote;
        uint balance;
    }


    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCountFor; // number of accumulated votes for
        uint voteCountAgainst; // number of accumulated votes against
        // mapping(address=> uint) voterFrequency;
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    //temporarily restricting to max length of 1 proposals for simplicity issua#1A
    mapping(address => uint) public voterFreq1;

    Proposal[] public proposals;

    
    constructor() {

        chairperson = msg.sender;

        // for(uint i =0; i < proposalNames.length ;i++){
            proposals.push(Proposal(
                { 
                    name: 'test',
                    voteCountFor: 0,
                    voteCountAgainst : 0
                }));
        // }

    }

    //have to keep track of how many times someone voted for something
    //keep a vote count array?
    //each proposal gets a mapping?
    function vote(uint proposalName, uint direction) public{
        Voter storage sender = voters[msg.sender];

        //init freq value as fix to #1A
        if (voterFreq1[msg.sender] ==0 ){
            voterFreq1[msg.sender]=1;
        }

        //direction == 0 means against 
        if (direction ==0){
            //cant do a balance for now
            // require(sender.balance >= voterFreq1[msg.sender], "Balance too low");
            //subtract balance
            //sender.balance -= voterFreq1[msg.sender]; //can u do this?
            //increase voteCount for proposal
            proposals[proposalName].voteCountAgainst++; //voterFreq1[msg.sender]; //idk if this works either
            //increase cost for next vote for user
            voterFreq1[msg.sender]**2;
        }
        else{
            proposals[proposalName].voteCountFor++; //voterFreq1[msg.sender]; //idk if this works either
            voterFreq1[msg.sender]**2;
        }
    }

    //im not sure a better way to set the user balance to 10
    function registerVoter() public{
        voters[msg.sender].balance = 10;
    }


    function getChairPerson() public view returns(address){
        return chairperson;
    }

    function getVoteCountFor(uint proposalName) public view returns(uint){
        return proposals[proposalName].voteCountFor;
    }

    function getVoteCountAgainst(uint proposalName) public view returns(uint){
        return proposals[proposalName].voteCountAgainst;
    }

}
