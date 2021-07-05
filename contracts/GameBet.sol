// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <=0.8.0;

import "./openzeppelin/utils/math/SafeMath.sol";
import "./openzeppelin/access/Ownable.sol";
import "./openzeppelin/security/Pausable.sol";
import "./chainlink/dev/ChainlinkClient.sol";

contract GameBet is Ownable, Pausable, ChainlinkClient {
    using SafeMath for uint256;
    using Chainlink for Chainlink.Request;

    struct BetPool {
        uint256 totalAmount;
        uint256 team1Amount;
        uint256 team2Amount;
        uint256 rewardBaseCalAmount;
        uint256 rewardAmount;
    }
    
    struct SeriesBet {
        uint256 seriesId;
        // uint256 leagueId;
        uint256 totalMatches;
        uint256 team1Id;
        uint256 team2Id;
        uint256 winnerId;
        BetPool betPool;
        bool oracleCalled;
        bool seriesLocked;
        bool seriesEnded;
    }

    enum Position {
        Team1,
        Team2
    }

    struct BetInfo {
        Position position;
        uint256 amount;
        bool claimed; // default false
    }

    mapping(uint256 => SeriesBet) public seriesBets;
    mapping(uint256 => mapping(address => BetInfo)) public seriesLedger;
    mapping(address => uint256[]) public userBets;

    struct Oracle {
        address oracleAddress;
        bytes32 jobId;
        uint256 fee;
    }
    Oracle internal oracle;
    uint256 private oracleCurrentSeriesId = 0;

    address public adminAddress;
    address public operatorAddress;
    uint256 public treasuryAmount;

    uint256 public constant TOTAL_RATE = 100; // 100%
    uint256 public rewardRate = 97; // 90%
    uint256 public treasuryRate = 3; // 10%
    uint256 public minBetAmount;

    event BetTeam1(
        address indexed sender,
        uint256 indexed seriesId,
        uint256 amount
    );
    event BetTeam2(
        address indexed sender,
        uint256 indexed seriesId,
        uint256 amount
    );
    event UserClaim(
        address indexed sender,
        uint256 indexed seriesId,
        uint256 amount
    );
    event ClaimTreasury(uint256 amount);
    event RewardsCalculated(
        uint256 rewardBaseCalAmount,
        uint256 rewardAmount,
        uint256 treasuryAmount
    );
    event Pause();
    event Unpause();

    constructor(
        // address _oracle,
        // bytes32 _jobId,
        // uint256 _fee,
        // address _adminAddress,
        // address _operatorAddress,
        // uint256 _minBetAmount
    ) public {
        
        setPublicChainlinkToken();
        oracle.oracleAddress = 0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40; // @linkriverio 0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40
        oracle.jobId = "3b7ca0d48c7a4b2da9268456665d11ae"; // 3b7ca0d48c7a4b2da9268456665d11ae
        oracle.fee = 0.01 * 10**18;
        adminAddress = 0xf27EfDdFF33c62A71d785CF0dAa564198AdAc3E5;
        operatorAddress = 0xf27EfDdFF33c62A71d785CF0dAa564198AdAc3E5;
        // adminAddress = msg.sender;
        // operatorAddress = msg.sender;
        minBetAmount = 0.01 * 10**18;

        SeriesBet storage seriesBet = seriesBets[100];
        seriesBet.seriesId = 100;
        seriesBet.totalMatches = 3;
        seriesBet.team1Id = 123;
        seriesBet.team2Id = 321;
    }

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "admin: wut?");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operatorAddress, "operator: wut?");
        _;
    }

    modifier onlyAdminOrOperator() {
        require(
            msg.sender == adminAddress || msg.sender == operatorAddress,
            "admin | operator: wut?"
        );
        _;
    }

    modifier notContract() {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
        _;
    }
    
    function betTeam1(
        uint256 seriesId
    ) external payable whenNotPaused notContract {
        require(bettable(seriesId), "Series not bettable");
        require(
            msg.value >= minBetAmount,
            "Bet amount must be greater than minBetAmount"
        );
        // require(
        //     seriesLedger[seriesId][msg.sender].amount == 0,
        //     "Can only bet once per seriesBet"
        // );
        
        uint256 amount = msg.value;
        
        // Update seriesBet data
        SeriesBet storage seriesBet = seriesBets[seriesId];
        seriesBet.betPool.totalAmount = seriesBet.betPool.totalAmount.add(amount);
        seriesBet.betPool.team1Amount = seriesBet.betPool.team1Amount.add(amount);

        // Update user data
        BetInfo storage betInfo = seriesLedger[seriesId][msg.sender];
        betInfo.position = Position.Team1;
        betInfo.amount = amount;
        userBets[msg.sender].push(seriesId);

        emit BetTeam1(msg.sender, seriesId, amount);
    }

    function betTeam2(uint256 seriesId)
        external
        payable
        whenNotPaused
        notContract
    {
        require(bettable(seriesId), "SeriesBet not bettable");
        require(
            msg.value >= minBetAmount,
            "Bet amount must be greater than minBetAmount"
        );
        // require(
        //     seriesLedger[seriesId][msg.sender].amount == 0,
        //     "Can only bet once per seriesBet"
        // );
        
        uint256 amount = msg.value;

        // Update seriesBet data
        SeriesBet storage seriesBet = seriesBets[seriesId];
        seriesBet.betPool.totalAmount = seriesBet.betPool.totalAmount.add(amount);
        seriesBet.betPool.team2Amount = seriesBet.betPool.team2Amount.add(amount);

        // Update user data
        BetInfo storage betInfo = seriesLedger[seriesId][msg.sender];
        betInfo.position = Position.Team2;
        betInfo.amount = amount;
        userBets[msg.sender].push(seriesId);

        emit BetTeam2(msg.sender, seriesId, amount);
    }

    function userClaim(uint256 seriesId) external notContract {
        require(
            seriesLedger[seriesId][msg.sender].amount > 0,
            "Not bet on this series"
        );
        require(!seriesLedger[seriesId][msg.sender].claimed, "Rewards claimed");
        require(seriesBets[seriesId].seriesEnded, "Series has not ended");

        uint256 reward;
        // SeriesBet valid, claim rewards
        if (seriesBets[seriesId].oracleCalled) {
            require(claimable(seriesId, msg.sender), "Not eligible for claim");
            SeriesBet memory seriesBet = seriesBets[seriesId];
            reward = seriesLedger[seriesId][msg.sender]
            .amount
            .mul(seriesBet.betPool.rewardAmount)
            .div(seriesBet.betPool.rewardBaseCalAmount);
        }
        // SeriesBet invalid, refund bet amount
        else {
            require(
                refundable(seriesId, msg.sender),
                "Not eligible for refund"
            );
            reward = seriesLedger[seriesId][msg.sender].amount;
        }

        BetInfo storage betInfo = seriesLedger[seriesId][msg.sender];
        betInfo.claimed = true;
        _safeTransfer(address(msg.sender), reward);

        emit UserClaim(msg.sender, seriesId, reward);
    }

    function claimTreasury() external onlyAdmin {
        uint256 currentTreasuryAmount = treasuryAmount;
        treasuryAmount = 0;
        _safeTransfer(adminAddress, currentTreasuryAmount);

        emit ClaimTreasury(currentTreasuryAmount);
    }

    function getUserBets(
        address user,
        uint256 cursor,
        uint256 size
    ) external view returns (uint256[] memory, uint256) {
        uint256 length = size;
        if (length > userBets[user].length - cursor) {
            length = userBets[user].length - cursor;
        }

        uint256[] memory values = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            values[i] = userBets[user][cursor + i];
        }

        return (values, cursor + length);
    }

    /**
     * @dev called by the admin to pause, triggers stopped state
     */
    function pause() public onlyAdminOrOperator whenNotPaused {
        _pause();

        emit Pause();
    }

    function unpause() public onlyAdmin whenPaused {
        _unpause();

        emit Unpause();
    }

    function claimable(uint256 seriesId, address user)
        public
        view
        returns (bool)
    {
        BetInfo memory betInfo = seriesLedger[seriesId][user];
        SeriesBet memory seriesBet = seriesBets[seriesId];
        return
            seriesBet.oracleCalled &&
            ((seriesBet.winnerId == seriesBet.team1Id &&
                betInfo.position == Position.Team1) ||
                (seriesBet.winnerId == seriesBet.team2Id &&
                    betInfo.position == Position.Team2));
    }

    function refundable(uint256 seriesId, address user)
        public
        view
        returns (bool)
    {
        BetInfo memory betInfo = seriesLedger[seriesId][user];
        SeriesBet memory seriesBet = seriesBets[seriesId];
        return !seriesBet.oracleCalled && betInfo.amount != 0;
    }

    function executeSeriesBet(
        uint256 seriesId,
        // uint256 leagueId,
        uint256 totalMatches,
        uint256 team1Id,
        uint256 team2Id
    ) external whenNotPaused {
        require(seriesId > 0, "Invalid Series ID");
        // require(leagueId > 0, "Invalid League ID");
        require(totalMatches > 0, "Matches less than 0");
        require(team1Id > 0, "Invalid Team ID");
        require(team1Id != team2Id, "Same team ID");
        // int256 currentPrice = _getPriceFromOracle();
        // CurrentEpoch refers to previous seriesBet (n-1)
        // _safeLockSeriesBet(seriesId);
        // _safeEndSeriesBet(seriesId);
        // _calculateRewards(seriesId);
        _safeStartSeriesBet(
            seriesId,
            /*leagueId,*/
            totalMatches,
            team1Id,
            team2Id
        );
    }

    function _safeStartSeriesBet(
        uint256 seriesId,
        // uint256 leagueId,
        uint256 totalMatches,
        uint256 team1Id,
        uint256 team2Id
    ) internal {
        SeriesBet storage seriesBet = seriesBets[seriesId];
        seriesBet.seriesId = seriesId;
        // seriesBet.leagueId = leagueId;
        seriesBet.totalMatches = totalMatches;
        seriesBet.team1Id = team1Id;
        seriesBet.team2Id = team2Id;
        seriesBet.betPool.totalAmount = 0;
        seriesBet.betPool.team1Amount = 0;
        seriesBet.betPool.team2Amount = 0;
    }

    function lockSeriesBet(uint256 seriesId)
        external
        onlyOperator
        whenNotPaused
    {
        require(
            !seriesBets[seriesId].seriesLocked,
            "Can only lock if series not lock yet"
        );
        require(
            !seriesBets[seriesId].seriesEnded,
            "Can only lock if series not end yet"
        );
        _safeLockSeriesBet(seriesId);
    }

    function _safeLockSeriesBet(uint256 seriesId) internal {
        SeriesBet storage seriesBet = seriesBets[seriesId];
        seriesBet.seriesLocked = true;
    }

    function endSeriesBet(uint256 seriesId)
        external
        onlyOperator
        whenNotPaused
    {
        require(
            seriesBets[seriesId].seriesLocked,
            "Can only end after series locked"
        );
        require(
            seriesBets[seriesId].oracleCalled,
            "Can only end after oracle called"
        );
        _calculateRewards(seriesId);
        _safeEndSeriesBet(seriesId);
    }

    function _safeEndSeriesBet(uint256 seriesId) internal {
        SeriesBet storage seriesBet = seriesBets[seriesId];
        seriesBet.seriesEnded = true;
    }

    function _calculateRewards(uint256 seriesId) internal {
        require(
            rewardRate.add(treasuryRate) == TOTAL_RATE,
            "rewardRate and treasuryRate must add up to TOTAL_RATE"
        );

        SeriesBet storage seriesBet = seriesBets[seriesId];
        uint256 rewardBaseCalAmount;
        uint256 rewardAmount;
        uint256 treasuryAmt;
        // Team 1 wins
        if (seriesBet.winnerId == seriesBet.team1Id) {
            rewardBaseCalAmount = seriesBet.betPool.team1Amount;
            rewardAmount = seriesBet.betPool.totalAmount.mul(rewardRate).div(
                TOTAL_RATE
            );
            treasuryAmt = seriesBet.betPool.totalAmount.mul(treasuryRate).div(
                TOTAL_RATE
            );
        }
        // Team 2 wins
        else {
            rewardBaseCalAmount = seriesBet.betPool.team2Amount;
            rewardAmount = seriesBet.betPool.totalAmount.mul(rewardRate).div(
                TOTAL_RATE
            );
            treasuryAmt = seriesBet.betPool.totalAmount.mul(treasuryRate).div(
                TOTAL_RATE
            );
        }
        seriesBet.betPool.rewardBaseCalAmount = rewardBaseCalAmount;
        seriesBet.betPool.rewardAmount = rewardAmount;

        // Add to treasury
        treasuryAmount = treasuryAmount.add(treasuryAmt);

        emit RewardsCalculated(rewardBaseCalAmount, rewardAmount, treasuryAmt);
    }

    function getSeriesWinner(uint256 seriesId, string memory requestUrl)
        external
        onlyOperator
        whenNotPaused
        returns (bytes32 requestId)
    {
        require(oracleCurrentSeriesId == 0, "Oracle in use. Please try again");
        // require(requestUrl.length > 20, "Invalid API provider");
        require(seriesId > 0, "Invalid Series ID");
        Chainlink.Request memory request = buildChainlinkRequest(
            oracle.jobId,
            address(this),
            this.seriesWinnerCallback.selector
        );

        oracleCurrentSeriesId = seriesId;
        // string requestUrl = "https://api.pandascore.co/dota2/matches/past?token=Ozo4Hxz_Mn6P3xVa01Pdqn4nYx7Ky41NS6e--_2cYpmlvHO8NPA&filter[id]=598687";
        request.add("get", requestUrl);
        request.add("path", "0.winner_id");

        return
            sendChainlinkRequestTo(oracle.oracleAddress, request, oracle.fee);
    }

    function seriesWinnerCallback(bytes32 _requestId, uint256 _winnerId)
        public
        recordChainlinkFulfillment(_requestId)
    {
        SeriesBet storage seriesBet = seriesBets[oracleCurrentSeriesId];
        seriesBet.winnerId = _winnerId;
        seriesBet.oracleCalled = true;
        oracleCurrentSeriesId = 0;
    }

    function _safeTransfer(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}("");
        // (bool success, ) = to.call{gas: 23000, value: value}("");
        require(success, "Transfer failed");
    }

    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function bettable(uint256 seriesId) public view returns (bool) {
        require(seriesBets[seriesId].seriesId != 0, "Series not exist!");
        return !seriesBets[seriesId].seriesLocked;
    }

}
