pragma solidity ^0.4.23;

contract Betting {
    address public owner;
    uint256 public lastWinnerNumber;
    uint256 public betValue = 1 ether;
    uint256 public totalBet;
    uint256 public numberOfBets;
    uint256 public totalSlots = 3;
    address[] public players;

    mapping(uint256 => address[]) public numberToPlayers;
    mapping(address => uint256) public playerToNumber;

    constructor(uint256 _betValue, uint256 _totalSlots) public {
        owner = msg.sender;
        if (_betValue > 0) betValue = _betValue;
        if (_totalSlots > 0) totalSlots = _totalSlots;
    }

    modifier validBet(uint256 betNumber) {
        require(playerToNumber[msg.sender] == 0);
        require(msg.value >= betValue);
        require(numberOfBets < 10);
        require(betNumber >= 1 && betNumber <= 10);
        _;
    }

    function bet(uint256 betNumber) public payable validBet(betNumber) {
        if (msg.value > betValue) {
            msg.sender.transfer(msg.value - betValue);
        }
        playerToNumber[msg.sender] = betNumber;
        players.push(msg.sender);
        numberToPlayers[betNumber].push(msg.sender);
        numberOfBets += 1;
        totalBet += msg.value;
        if (numberOfBets >= totalSlots) {
            distributePrizes();
        }
    }

    function distributePrizes() internal {
        uint256 winnerNumber = generateRandomNumber();
        address[] memory winners = numberToPlayers[winnerNumber];
        if (winners.length > 0) {
            uint256 winnerEtherAmount = totalBet / winners.length;
            for (uint256 i = 0; i < numberToPlayers[winnerNumber].length; i++) {
                numberToPlayers[winnerNumber][i].transfer(winnerEtherAmount);
            }
        }
        lastWinnerNumber = winnerNumber;
        reset();
    }

    function generateRandomNumber() internal view returns (uint256) {
        return ((block.number % 10) + 1);
    }

    function reset() internal {
        for (uint256 i = 1; i <= 10; i++) {
            numberToPlayers[i].length = 0;
        }

        for (uint256 j = 0; j < players.length; j++) {
            playerToNumber[players[j]] = 0;
        }

        players.length = 0;
        totalBet = 0;
        numberOfBets = 0;
    }

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }
}
