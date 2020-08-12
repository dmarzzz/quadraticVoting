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

    //temporarily restricting to max length of 1 proposals for simplicity
    mapping(address => uint) public voterFreq1;

    Proposal[] public proposals;

    
    constructor(bytes32[] memory proposalNames) {

        chairperson = msg.sender;

        for(uint i =0; i < proposalNames.length ;i++){
            proposals.push(Proposal(
                { 
                    name: proposalNames[i],
                    voteCountFor: 0,
                    voteCountAgainst : 0
                }));
        }

    }

    //have to keep track of how many times someone voted for something
    //keep a vote count array?
    //each proposal gets a mapping?
    function vote(uint proposalName, uint direction) public view{
        Voter storage sender = voters[msg.sender];

        if (voterFreq1[msg.sender] ==0 ){
            voterFreq1[msg.sender]=1;
        }

        //direction == 0 means against 
        if (direction ==0){

            if(sender.balance<voterFreq1[msg.sender]){
                //quit
            }
            else{
            sender.balance -= voterFreq1[msg.sender]; //can u do this?
            proposals[proposalName].voteCountFor ++; //idk if this works either
            voterFreq1[msg.sender]++;
            voterFreq1[msg.sender]**2;
            }
        }
        //direction ==1 means for
        else{

        }
        
    }

    // function vote(uint proposal) public {
    //     Voter storage sender = voters[msg.sender];
    //     require(sender.weight != 0, "Has no right to vote");
    //     require(!sender.voted, "Already voted.");
    //     sender.voted = true;
    //     sender.vote = proposal;

    //     // If `proposal` is out of the range of the array,
    //     // this will throw automatically and revert all
    //     // changes.
    //     proposals[proposal].voteCount += sender.weight;
    // }







    function getChairPerson() public view returns(address){
        return chairperson;
    }

}
