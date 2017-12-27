const initialState = {
  AuthContract: null,
  account: null
}

const globalReducer = (state = initialState, action) => {
  if (action.type === 'SetAuthContractInstance')
  {
    return Object.assign({}, state, {
      AuthContract: action.payload.contract,
      account: action.payload.account
    })
  }

  return state
}

export default globalReducer
