// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error LockToken__NotOwner(); // i can do custom errors as of solidity 0.4.8 which is so cool

/**@title A contract that allows users to lock their tokens for a durations and even earn extra tokens at the end of the duration
 * @author Kamasah Dickson
 * @notice Contract is a submition of the risein solidity and bnbchain bootcamp
 * @dev In this contract, i followed the solidity syle guid(order of layout)
 */

contract LockToken {
    //structs
    struct Deposit {
        uint256 amount;
        uint256 unlockTime;
        uint256 rate; // percent (e.g., 5%)
    }

    //state variables
    mapping(address => Deposit) public s_deposits;
    mapping(address => uint256) public withdrawalBalances;
    uint256 constant MINIMUM_BNB = 1e18;
    address private immutable i_owner;

    //events
    event DepositReceived(address indexed user, uint256 amount);
    event UnlockDurationSet(address indexed user, uint256 unlockTime);
    event Withdrawal(
        address indexed user,
        uint256 amount,
        uint256 interest,
        uint256 when
    );

    //modifiers
    modifier onlyi_owner() {
        if (msg.sender != i_owner) {
            revert LockToken__NotOwner();
            //either of the obove and below works but for the sake of gas optimization am going for the above;
            // revert("Only the i_owner can perform this action");
        }
        _;
    }

    //functions(constructor)
    constructor() {
        i_owner = msg.sender;
    }

    // Functions(external functions)

    /**
     * @notice this function allow user to deposit funds
     * @param _unlockDuration  is how long the funds will be locked
     * @param _rate is the rate which helps determine how much profit will be earned atthe end of the locked duration, so say 5
     */

    function deposit(uint256 _unlockDuration, uint256 _rate) external payable {
        if (_unlockDuration <= 0) {
            revert("Unlock duration must be greater than zero");
        }
        if (msg.value < MINIMUM_BNB) {
            revert("Deposit amount must be at least 1ETH");
        }
        if (_rate > 70) {
            revert("Interest rate cannot exceed 70%");
        }

        Deposit storage depositInfo = s_deposits[msg.sender];

        depositInfo.amount = msg.value;
        depositInfo.unlockTime = block.timestamp + _unlockDuration;
        depositInfo.rate = _rate;

        emit DepositReceived(msg.sender, msg.value);
        emit UnlockDurationSet(msg.sender, depositInfo.unlockTime);
    }

    /**
     * @notice Function to withdraw funds along with earned interest
     */

    function withdraw() external {
        Deposit storage depositInfo = s_deposits[msg.sender];
        if (depositInfo.amount == 0) {
            revert("No active deposit");
        }
        if (block.timestamp < depositInfo.unlockTime) {
            revert("Funds are still locked");
        }

        uint256 interest = calculateDailyReward(msg.sender);
        uint256 totalAmount = depositInfo.amount + interest;

        withdrawalBalances[msg.sender] += totalAmount;

        emit Withdrawal(msg.sender, totalAmount, interest, block.timestamp); // Include interest in the event

        // Transfer the totalAmount to the user
        payable(msg.sender).transfer(totalAmount);

        // Update depositInfo.amount to zero to indicate withdrawal
        depositInfo.amount = 0;
    }

    // Function(view functions)

    /**
     * @notice this function  calculates daily rewards
     * @param user  is the user address, it is used to access the deposite info of the user
     */

    function calculateDailyReward(
        address user
    ) internal view returns (uint256) {
        Deposit storage depositInfo = s_deposits[user];
        uint256 principal = depositInfo.amount;
        uint256 unlockTime = depositInfo.unlockTime;

        if (block.timestamp >= unlockTime) {
            // Tokens are unlocked, calculate daily reward based on the locked amount
            uint256 timeElapsed = block.timestamp - unlockTime;
            uint256 daysElapsed = timeElapsed / 1 days;

            return (principal * daysElapsed);
        } else {
            revert("Tokens are still locked, no rewards earned");
        }
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    /**
     * @notice this function allow users to get the amount funded
     * @param userAddress  is the address of the user who funded the contract
     */

    function getDepositAmount(
        address userAddress
    ) public view returns (uint256) {
        return s_deposits[userAddress].amount;
    }
}
