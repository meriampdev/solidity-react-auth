import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../css/profilecard.css'
import {
  Button
} from 'react-md'

class People extends Component {
  constructor(props) {
    super(props)

    this.state = {
      people: []
    }

    this.GetPeople = this.GetPeople.bind(this)
    this.GetFriendRequests = this.GetFriendRequests.bind(this)
  }

  componentDidMount() {
    this.GetPeople()
    this.GetFriendRequests()
  }

  GetPeople() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract, account } = global
    console.log('GetPeople')
    AuthContract.GetPeople.call().then((people)=>{
      console.log('people', people)
      let arr = [], count = 0;
      new Promise(function(resolve, reject){
        people.map((addr, i)=>{
          AuthContract.GetName(addr).then((name)=>{
            console.log('name', web3.toUtf8(name))
            ++count;
            console.log(addr, account)
            if(addr !== account) {
              console.log('if', count, people.length)
              arr.push({ name: web3.toUtf8(name), addr: addr })
            }
            if(count >= people.length) {
              resolve();
            }
          })
        })
      }).then(()=>{
        console.log('arr', arr)
        self.setState({ people: arr })
      })
    }).catch((err)=>{
      console.log('GetPeople Err', err)
    })
  }

  GetFriendRequests() {
    console.log('GetFriendRequests')
    const self = this
    const { global, web3 } = this.props
    const { AuthContract, account } = global
    AuthContract.GetFriendRequests.call().then((res)=>{
      console.log('res', res)
    }).catch((err)=>{
      console.log('GetFriendRequests Err:' ,err)
    })
  }

  AddFriend(addr) {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract, account } = global
    console.log('web3', web3  )
    AuthContract.SendFriendRequest(web3.toChecksumAddress(addr)).then((res)=>{

    }).catch((err)=>{
      console.log('AddFriend Err:', err)
    })
  }

  render() {
    const { people } = this.state
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>People</h1>
          </div>
        </div>
        <div className='md-grid'>
          {
            people.map((details)=>{
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
                    <Button onClick={this.AddFriend.bind(this, details.address)} className="md-cell--right" icon>person_add</Button>
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
