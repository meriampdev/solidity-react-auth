import AuthenticationContract from '../../build/contracts/Authentication.json'
import { browserHistory } from 'react-router'
import store from '../store'

const contract = require('truffle-contract')

export const SetAuthContractInstance = 'SetAuthContractInstance'
function Set_AuthContractInstance(instance) {
  return {
    type: SetAuthContractInstance,
    payload: instance
  }
}

export function GetAuthContractInstance() {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (web3 && typeof web3 !== 'undefined') {
    console.log('web3', web3)
    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          dispatch(Set_AuthContractInstance(instance))
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
