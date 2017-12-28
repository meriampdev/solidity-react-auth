pragma solidity ^0.4.2;

/* import './zeppelin/lifecycle/Killable.sol'; */
import './Notification.sol';
import './Business.sol';
/* contract Authentication is Killable { */
contract Authentication is Notification, Business {
  struct User {
    bytes32 name;
    bytes32[] bookmarks;
    bytes32[] likes;
    bytes32[] claims;
    address[] friends;
  }

  mapping (address => User) private users;
  address[] public people;
  uint private id; // Stores user id temporarily

  modifier onlyExistingUser {
    // Check if user exists or terminate

    require(!(users[msg.sender].name == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function login() constant public onlyExistingUser returns (bytes32) {
    return (users[msg.sender].name);
  }

  function signup(bytes32 name) public payable onlyValidName(name) returns (bytes32) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.

    if (users[msg.sender].name == 0x0)
    {
        users[msg.sender].name = name;
        people.push(msg.sender);
        return (users[msg.sender].name);
    }

    return (users[msg.sender].name);
  }

  function GetPeople() public constant returns(address[]) {
    return people;
  }

  function GetName(address usraddr) public constant returns(bytes32) {
    return users[usraddr].name;
  }

  function update(bytes32 name) public payable onlyValidName(name) onlyExistingUser returns (bytes32) {
    // Update user name.

    if (users[msg.sender].name != 0x0)
    {
        users[msg.sender].name = name;

        return (users[msg.sender].name);
    }
  }

  function AddBookmark(bytes32 business_id, bool un) public payable returns(bool) {
    // remove from bookmarks
    if (un == true) {
      for(uint i=0; i<users[msg.sender].bookmarks.length-1; i++) {
        if(users[msg.sender].bookmarks[i] == business_id) {
          DecrementBookmarkCount(business_id);
          delete users[msg.sender].bookmarks[i];
          return true;
        }
      }
    }

    IncrementBookmarkCount(business_id);
    users[msg.sender].bookmarks.push(business_id);
    return true;
  }

  function GetBookmarks() public constant returns(bytes32[]) {
    return users[msg.sender].bookmarks;
  }

  function AddLikes(bytes32 business_id, bool un) public payable returns(bool) {
    // remove from likes
    if (un == true) {
      for(uint i=0; i<users[msg.sender].likes.length-1; i++) {
        if(users[msg.sender].likes[i] == business_id) {
          DecrementLikeCount(business_id);
          delete users[msg.sender].likes[i];
          return true;
        }
      }
    }

    IncrementLikeCount(business_id);
    users[msg.sender].likes.push(business_id);
    return true;
  }

  function GetLikes() public constant returns(bytes32[]) {
    return users[msg.sender].likes;
  }

  function ClaimBusiness(bytes32 business_id) public payable returns(bool) {
    users[msg.sender].claims.push(business_id);
    return true;
  }

  function GetClaims() public constant returns(bytes32[]) {
    return users[msg.sender].claims;
  }
}
