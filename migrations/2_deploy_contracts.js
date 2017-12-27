// var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
// var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var Authentication = artifacts.require("./Authentication.sol");
var Notification = artifacts.require("./Notification.sol");

module.exports = function(deployer) {
  // deployer.deploy(Ownable);
  // deployer.link(Ownable, Killable);
  // deployer.deploy(Killable);
  // deployer.link(Killable, Authentication);
  deployer.deploy(Authentication);
  deployer.deploy(Notification);
};
