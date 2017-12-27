import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import { loginUser, userLoggedIn } from './LoginButtonActions'
import { browserHistory } from 'react-router'

const mapStateToProps = (state, ownProps) => {
  return {
    global: state.global,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUserClick: (event) => {
      event.preventDefault();

      dispatch(loginUser())
    },
    LoginUser: (user) => {
      dispatch(userLoggedIn({"name": user}))
      var currentLocation = browserHistory.getCurrentLocation()
      console.log('currentLocation', currentLocation)
      if ('redirect' in currentLocation.query)
      {
        browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      browserHistory.push('/dashboard')
    }
  }
}

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
