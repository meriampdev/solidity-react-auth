pragma solidity ^0.4.2;

contract BusinessStats {
  mapping(bytes32 => uint) LikesCount;
  mapping(bytes32 => uint) BookmarksCount;

  function IncrementLikeCount(bytes32 bizID) public payable returns(bool) {
    LikesCount[bizID]++;
    return true;
  }

  function DecrementLikeCount(bytes32 bizID) public payable returns(bool) {
    LikesCount[bizID]--;
    return true;
  }

  function GetLikeCount(bytes32 bizID) public constant returns(uint) {
    return LikesCount[bizID];
  }

  function IncrementBookmarkCount(bytes32 bizID) public payable returns(bool) {
    BookmarksCount[bizID]++;
    return true;
  }

  function DecrementBookmarkCount(bytes32 bizID) public payable returns(bool) {
    BookmarksCount[bizID]--;
    return true;
  }

  function GetBookmarkCount(bytes32 bizID) public constant returns(uint) {
    return BookmarksCount[bizID];
  }
}
