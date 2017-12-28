import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../css/profilecard.css'
import {
  Button
} from 'react-md'

import Notifications from '../components/Notifications'

class People extends Component {
  constructor(props) {
    super(props)

    this.state = {
      people: [],
			friends: [],
			FriendRequestCount: 0,
			FriendRequestList: []
    }

    this.GetPeople = this.GetPeople.bind(this)
    this.GetFriendRequests = this.GetFriendRequests.bind(this)
		this.GetFriends = this.GetFriends.bind(this)
  }

  componentDidMount() {
    this.GetPeople()
    this.GetFriendRequests()
		this.GetFriends()
  }

	GetFriends() {
		const self = this
    const { global, web3 } = this.props
    const { AuthContract, account } = global
		AuthContract.GetFriends().then((friends)=>{
      console.log('frieds', friends)
			let arr = [], count = 1;
      new Promise(function(resolve, reject){
        friends.map((addr, i)=>{
          AuthContract.GetName(addr).then((name)=>{
            if(addr !== account) {
              arr.push({ name: web3.toUtf8(name), addr: addr })
            }
            if(count == friends.length) {
              resolve();
            }
            count++;
          })
          // return addr
        })
      }).then(()=>{
        self.setState({ friends: arr })
      })
		}).catch((err)=>{
			console.log('GetFriends Err', err)
		})
	}

  GetPeople() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract, account } = global
    AuthContract.GetPeople().then((people)=>{
      let arr = [], count = 0;
      new Promise(function(resolve, reject){
        people.map((addr, i)=>{
          AuthContract.GetName(addr).then((name)=>{
            ++count;
            if(addr !== account) {
              arr.push({ name: web3.toUtf8(name), addr: addr })
            }
            if(count >= people.length) {
              resolve();
            }
          })
          // return addr
        })
      }).then(()=>{
        self.setState({ people: arr })
      })
    }).catch((err)=>{
      console.log('GetPeople Err', err)
    })
  }

  GetFriendRequests() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
		AuthContract.GetFriendRequestCount().then((count)=>{
			self.setState({ FriendRequestCount: count.valueOf() })
		})
    AuthContract.GetFriendRequests().then((requests)=>{
			let arr = [], count = 0;
			new Promise(function(resolve, reject) {
				requests.map((from)=>{
					AuthContract.GetName(from).then((name)=>{
						++count
						arr.push({ name: web3.toUtf8(name), addr: from })
						if(count >= requests.length) {
              resolve();
            }
					})
          // return from
				})

			}).then(()=>{
				self.setState({ FriendRequestList: arr })
			})
    }).catch((err)=>{
      console.log('GetFriendRequests Err:' ,err)
    })
  }

  AddFriend(addr) {
    // const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.SendFriendRequest(web3.toChecksumAddress(addr)).then((res)=>{
    }).catch((err)=>{
      console.log('AddFriend Err:', err)
    })
  }

	handleAcceptRequest(useraddr) {
		const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
		AuthContract.AcceptFriendRequest(web3.toChecksumAddress(useraddr)).then(()=>{
			self.GetFriends()
			self.GetFriendRequests()
		}).catch((err)=>{
			console.log('AcceptFriendRequest Err:', err)
		})
	}

  render() {
    const { people, FriendRequestCount, FriendRequestList, friends } = this.state
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>People</h1>
						<Notifications
							FriendRequestCount={FriendRequestCount}
							FriendRequestList={FriendRequestList}
							GetFriendRequests={this.GetFriendRequests.bind(this)}
							GetFriends={this.GetFriends.bind(this)}
						/>
          </div>
        </div>
        <div className='md-grid'>
          {
            people.map((details)=>{
							let added_you = FriendRequestList.filter((fr)=>{ return fr.addr === details.addr })
							let a_friend = friends.filter(f=>f.addr === details.addr)
              return (<div key={details.addr} className='md-cell md-cell--3 md-cell--8-tablet'>
                <div className="card hovercard">
                  <div className="cardheader">

                  </div>
                  <div className="avatar">
                    <img alt="" src="http://lorempixel.com/100/100/people/9/" />
                  </div>
                  <div className="info">
                    <div className="title">
                      <a>{details.name}</a>
                    </div>
                    {
                      // <div className="desc">Passionate designer</div>
                    }
                  </div>
                  <div className="bottom">
										{
											a_friend.length >= 1 ?
												'Friend'
											:
												<Button
													onClick={
														added_you.length >= 1 ?
															this.handleAcceptRequest.bind(this, details.addr)
														:
															this.AddFriend.bind(this, details.addr)
													}
													className="md-cell--right"
													icon
													tooltipLabel={ added_you.length >= 1 ? 'Accept Request' : 'Add Friend'}
													tooltipPosition='top'
													>
														{
															added_you.length >= 1 ? 'accessibility' : 'person_add'
														}
													</Button>
										}
                  </div>
                </div>
              </div>)
            })
          }
        </div>
      </main>
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
)(People)
