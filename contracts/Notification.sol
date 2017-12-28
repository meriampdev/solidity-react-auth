pragma solidity ^0.4.2;

contract Notification {
	struct Notifications{
		address[] FriendRequests;
		address[] Friends;
		uint FriendRequestCount;
	}
	// User: array of requests
	/*mapping(address => address[]) FriendRequests;*/
	/*mapping(address => address[]) Friends;*/
	mapping(address => Notifications) notifs;


	function SendFriendRequest(address to) public payable returns(bool) {
		notifs[to].FriendRequests.push(msg.sender);
		notifs[to].FriendRequestCount++;
		return true;
	}

	function GetFriendRequests() public constant returns(address[]) {
	    return notifs[msg.sender].FriendRequests;
	}

	function GetFriendRequestCount() public constant returns(uint) {
		return notifs[msg.sender].FriendRequestCount;
	}

	function AcceptFriendRequest(address from) public payable returns(bool) {
		notifs[msg.sender].Friends.push(from);
		for(uint i=0; i<=notifs[msg.sender].FriendRequests.length-1; i++) {
			if(notifs[msg.sender].FriendRequests[i] == from) {
				notifs[msg.sender].Friends.push(from);
				notifs[from].Friends.push(msg.sender);
				delete notifs[msg.sender].FriendRequests[i];
				notifs[msg.sender].FriendRequestCount--;
				return true;
			}
		}

		return false;
	}

	function GetFriends() public constant returns(address[]) {
		return notifs[msg.sender].Friends;
	}
}
