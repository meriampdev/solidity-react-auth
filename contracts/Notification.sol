pragma solidity ^0.4.2;

contract Notification {
  struct Request {
    address from;
    bool accepted;
  }
  mapping(address => Request[]) FriendRequests;
  struct Friends {
    address[] friends;
  }
  mapping(address => Friends) friends;
  address[] public requests;

  function SendFriendRequest(address to) public payable returns(bool) {
    FriendRequests[to].push(Request(msg.sender, false));
    return true;
  }

  function GetFriendRequests() public returns(address[]) {
    for(uint i=0; i<=FriendRequests[msg.sender].length;i++) {
      if(!(FriendRequests[msg.sender][i].accepted)) {
        requests.push(FriendRequests[msg.sender][i].from);
      }
    }
    return requests;
  }

  function AcceptFriendRequest(address sender) public payable returns(bool) {
    for(uint i=0; i<=FriendRequests[msg.sender].length;i++) {
      if(FriendRequests[msg.sender][i].from == sender) {
        FriendRequests[msg.sender][i].accepted = true;
        return true;
      }
    }

    return false;
  }
}
