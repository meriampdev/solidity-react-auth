pragma solidity ^0.4.2;

contract Business {
  struct Details {
    uint rating;
    uint likescount;
    uint bookmarkcount;
    bool claimed;
  }
  mapping(bytes32 => Details) BusinessDetails;
  bytes32[] claimedBusinesses;

  function AddtoClaimed(bytes32 bizID) public payable returns(bool) {
    claimedBusinesses.push(bizID);
    return true;
  }

  function GetClaimed() public constant returns(bytes32[]) {
    return claimedBusinesses;
  }

	function GetBusinessDetails(bytes32 bizID) public constant returns(uint, uint) {
		return (BusinessDetails[bizID].likescount, BusinessDetails[bizID].bookmarkcount);
	}

  function IncrementLikeCount(bytes32 bizID) public payable returns(bool) {
    BusinessDetails[bizID].likescount++;
    return true;
  }

  function DecrementLikeCount(bytes32 bizID) public payable returns(bool) {
    BusinessDetails[bizID].likescount--;
    return true;
  }

  function GetLikeCount(bytes32 bizID) public constant returns(uint) {
    return BusinessDetails[bizID].likescount;
  }

  function IncrementBookmarkCount(bytes32 bizID) public payable returns(bool) {
    BusinessDetails[bizID].bookmarkcount++;
    return true;
  }

  function DecrementBookmarkCount(bytes32 bizID) public payable returns(bool) {
    BusinessDetails[bizID].bookmarkcount--;
    return true;
  }

  function GetBookmarkCount(bytes32 bizID) public constant returns(uint) {
    return BusinessDetails[bizID].bookmarkcount;
  }
}
