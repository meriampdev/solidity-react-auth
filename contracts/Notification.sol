pragma solidity ^0.4.2;

contract Notification {
	// User: array of requests
	mapping(address => address[]) FriendRequests;
	mapping(address => address[]) Friends;

	function SendFriendRequest(address to) public payable returns(bool) {
		FriendRequests[to].push(msg.sender);
		return true;
	}

	function GetFriendRequests() public constant returns(address[]) {
	    return FriendRequests[msg.sender];
	}

	function GetFriendRequestCount() public constant returns(uint) {
		return FriendRequests[msg.sender].length;
	}

	function AcceptFriendRequest(address from) public payable returns(bool) {
		Friends[msg.sender].push(from);
		for(uint i=0; i<=FriendRequests[msg.sender].length-1; i++) {
			if(FriendRequests[msg.sender][i] == from) {
				Friends[msg.sender].push(from);
				Friends[from].push(msg.sender);
				delete FriendRequests[msg.sender][i];
				return true;
			}
		}

		return false;
	}

	function GetFriends() public constant returns(address[]) {
		return Friends[msg.sender];
	}

	/*struct Request {
    address from;
    bool accepted;
  }
  mapping(address => Request[]) FriendRequests;
  struct Friends {
    address[] friends;
  }
  mapping(address => Friends) friends;
  address[] public requestsFrom;

  function SendFriendRequest(address to) public payable returns(bool) {
    FriendRequests[to].push(Request(msg.sender, false));
		requestsFrom.push(msg.sender);
    return true;
  }

  function GetFriendRequests() public returns(address[]) {
    for(uint i=0; i<=requests.length;i++) {
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
  }*/
}
