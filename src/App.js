import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// import { GetAuthContractInstance } from './actions/global'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Businesses</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/people" className="pure-menu-link">People</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/bookmarks" className="pure-menu-link">Bookmarks</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/claims" className="pure-menu-link">Claims</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

		const { user } = this.props
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
          <Link to="/" className="pure-menu-heading pure-menu-link">{ user.data ? `Hi ${user.data.name}!` : 'Truffle Box'}</Link>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    global: state.global,
		user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
