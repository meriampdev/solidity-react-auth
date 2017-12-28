import React from 'react'
import '../css/notification.css'
import {
  Button
} from 'react-md'
import { connect } from 'react-redux'

class Notifications extends React.Component {
	// constructor(props) {
	// 	super(props)
	// }

	handleAcceptRequest(useraddr) {
		const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
		AuthContract.AcceptFriendRequest(web3.toChecksumAddress(useraddr)).then(()=>{
			self.props.GetFriendRequests()
		}).catch((err)=>{
			console.log('AcceptFriendRequest Err:', err)
		})
	}

	render() {
		const { FriendRequestCount, FriendRequestList } = this.props
    let filter = FriendRequestList.filter(f=> f.name !== '')
		return(
			<ul className="nav navbar-nav">
		    <li className="dropdown">
		      <a href="#" className="dropdown-toggle" data-toggle="dropdown">Friend Requests <span className="badge pull-right"> {FriendRequestCount} </span></a>
		      <ul className="dropdown-menu">
						{
							filter.map((person, i)=>{
								return (<li key={'fr'+i}>
									<a>{person.name} sent you a friend request.
										<Button className="md-cell--right" icon tooltipLabel='Accept'
											onClick={this.handleAcceptRequest.bind(this, person.addr)}
										>favorite</Button>
									</a>
								</li>)
							})
						}
		      </ul>
		    </li>
		  </ul>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
    global: state.global,
    user: state.user,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
