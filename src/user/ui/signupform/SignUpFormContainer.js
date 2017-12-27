import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { signUpUser } from './SignUpFormActions'
import { userLoggedIn } from '../loginbutton/LoginButtonActions'
import { browserHistory } from 'react-router'

const mapStateToProps = (state, ownProps) => {
  return {
    global: state.global,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUpFormSubmit: (name) => {
      dispatch(signUpUser(name))
    },
    LoginUser: (name) => {
      dispatch(userLoggedIn({"name": name}))
      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      let currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/dashboard')
    }
  }
}

const SignUpFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpFormContainer
