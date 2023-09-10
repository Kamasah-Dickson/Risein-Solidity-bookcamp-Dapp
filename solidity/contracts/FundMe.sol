//SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;
import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title  a contract for crowd funding
 * @author Kamasah Dickson
 * @notice This contract act as a secure vault for users to lock their tokens for a specified period.
 */

contract FundMe {
   //Type Declarations
   using PriceConverter for uint256;
   //State Variables
   mapping(address => uint256) private s_addressToAmountFunded;
   address[] private s_funders;

   address private immutable i_owner;

   uint256 public constant MIN_USD = 50 * 10 ** 18;

   AggregatorV3Interface private s_priceFeed;

   //Modifiers

   modifier onlyOwner() {
      if (msg.sender != i_owner) revert FundMe__NotOwner();
      _;
   }

   constructor(address priceFeedAddress) {
      i_owner = msg.sender;
      s_priceFeed = AggregatorV3Interface(priceFeedAddress);
   }

   receive() external payable {}

   fallback() external payable {}

   function fund() public payable {
      require(
         msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
         "Your funds do not meet a minimum requirement"
      );
      s_addressToAmountFunded[msg.sender] += msg.value;
      s_funders.push(msg.sender);
   }

   function withdraw() public payable onlyOwner {
      /*starting index , ending index,step amount*/
      for (
         uint256 funderIndex = 0;
         funderIndex < s_funders.length;
         funderIndex++
      ) {
         address funder = s_funders[funderIndex];
         s_addressToAmountFunded[funder] = 0;
      }

      //reset the array
      s_funders = new address[](0);

      (bool callSuccess, ) = payable(msg.sender).call{
         value: address(this).balance
      }("");
      require(callSuccess, "callFailed");
   }

   // read s_funders into memory once and then read from memory instead of reading from storage

   function cheaperWithdraw() public payable onlyOwner {
      address[] memory funders = s_funders;

      for (
         uint256 funderIndex = 0;
         funderIndex < funders.length;
         funderIndex++
      ) {
         address funder = funders[funderIndex];
         s_addressToAmountFunded[funder] = 0;
      }
      s_funders = new address[](0);
      (bool success, ) = i_owner.call{value: address(this).balance}("");
      require(success);
   }

   function getOwner() public view returns (address) {
      return i_owner;
   }

   function getFunder(uint256 index) public view returns (address) {
      return s_funders[index];
   }

   function getAddressToAmountFunded(
      address funder
   ) public view returns (uint256) {
      return s_addressToAmountFunded[funder];
   }

   function getPriceFeed() public view returns (AggregatorV3Interface) {
      return s_priceFeed;
   }
}
