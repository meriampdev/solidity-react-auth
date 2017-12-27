import store from '../../store'
import Web3 from 'web3'
import AuthenticationContract from '../../../build/contracts/Authentication.json'
const contract = require('truffle-contract')

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

export const SetAuthContractInstance = 'SetAuthContractInstance'
function Set_AuthContractInstance(instance, account) {
  return {
    type: SetAuthContractInstance,
    payload: { contract: instance, account: account }
  }
}

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        web3.eth.defaultAccount = coinbase
        authentication.deployed().then(function(instance) {
          store.dispatch(Set_AuthContractInstance(instance, coinbase))
        })
      })

      results = {
        web3Instance: web3
      }

      console.log('Injected web3 detected.');

      resolve(store.dispatch(web3Initialized(results)))
    } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

      web3 = new Web3(provider)

      results = {
        web3Instance: web3
      }

      console.log('No web3 instance injected, using Local web3.');

      resolve(store.dispatch(web3Initialized(results)))
    }
  })
})

export default getWeb3
