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
        bool votingOpen;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    //temporarily restricting to max length of 1 proposals for simplicity issua#1A
    mapping(address => uint) public voterFreq1;
    Proposal[] public proposals;
    uint public startingBalance;
    uint public winningDirection;
    
    //currently am not sure how to pass an array of strings into here from the api side 
    constructor(uint32 balanceAmount) {

        startingBalance= balanceAmount;
        chairperson = msg.sender;

        // for(uint i =0; i < proposalNames.length ;i++){
            proposals.push(Proposal(
                { 
                    name: 'test',
                    voteCountFor: 1,
                    voteCountAgainst : 0,
                    votingOpen : true
                }));
        // }
    }

    function vote(uint proposalName, uint direction) public{
        //we dont allow vote canceling in terms of user balance
        //(i.e  balanceBefore voteFor & voteAgainst (proposal1) == balanceAfter)
        Voter storage sender = voters[msg.sender];
        //init freq value as fix to #1A
        //cant do a balance for now
        require(sender.balance >= voterFreq1[msg.sender], "Balance too low");
        require(proposals[proposalName].votingOpen==true);

        //direction == 0 means against 
        if (direction ==0){
            //subtract balance
            sender.balance -= voterFreq1[msg.sender];
            //increase voteCount for proposal
            proposals[proposalName].voteCountAgainst++; //voterFreq1[msg.sender]; //idk if this works either
            //increase cost for next vote for user
            voterFreq1[msg.sender]*=2;
        }
        else{
            //subtract balance
            sender.balance -= voterFreq1[msg.sender];
            //increase voteCount for proposal
            proposals[proposalName].voteCountFor++; //voterFreq1[msg.sender]; //idk if this works either
            voterFreq1[msg.sender]**2;
        }
    }


    function registerVoter() public{
        voters[msg.sender].balance = startingBalance;
        voterFreq1[msg.sender]=1;
    }

    //disable voting and finalize winner
    function closeVote(uint proposalName) public{
        require(msg.sender == chairperson);
        proposals[proposalName].votingOpen = false;
        if( proposals[proposalName].voteCountFor > proposals[proposalName].voteCountAgainst){
            winningDirection = 1;
        }
        else{
            //direction == 0 means against
            winningDirection = 0;
        }
    }

    //getters

    function getChairPerson() public view returns(address){
        return chairperson;
    }

    function getVoteCountFor(uint proposalName) public view returns(uint){
        return proposals[proposalName].voteCountFor;
    }

    function getVoteCountAgainst(uint proposalName) public view returns(uint){
        return proposals[proposalName].voteCountAgainst;
    }

    function getBalance() public view returns(uint){
        return voters[msg.sender].balance;
    }

    function getWinner() public view returns(uint){
        return winningDirection;
    }

}
