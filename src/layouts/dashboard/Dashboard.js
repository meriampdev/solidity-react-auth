import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardTitle,
  CardText,
  Media,
  MediaOverlay,
} from 'react-md'
import { businesses } from '../../util/businessmocklist'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.state = {
      likes: [], bookmarks: []
    }

    this.GetLikes = this.GetLikes.bind(this)
    this.GetBookmarks = this.GetBookmarks.bind(this)
  }

  componentWillMount() {
    this.GetLikes()
    this.GetBookmarks()
  }

  GetLikes() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetLikes().then((likes)=>{
      let arr = []
      new Promise(function(resolve, reject) {
        likes.map((bizID)=>{
          let id =  web3.toUtf8(bizID)
          arr.push(id)
        })
        resolve()
      }).then(()=>{
        self.setState({ likes: arr })
      })
    })
  }

  GetBookmarks() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetBookmarks().then((bookmarks)=>{
      let arr = []
      new Promise(function(resolve, reject) {
        bookmarks.map((bizID)=>{
          let id =  web3.toUtf8(bizID)
          arr.push(id)
        })
        resolve()
      }).then(()=>{
        self.setState({ bookmarks: arr })
      })
    })
  }

  handleAddBookmark(business_id, un) {
    console.log('handleAddBookmark')
    const self = this
    const { global } = this.props
    const { AuthContract } = global
    AuthContract.AddBookmark(business_id, un).then(()=>{
      self.GetBookmarks()
    })
  }

  handleAddLike(business_id, un) {
    console.log('handleAddLike')
    const self = this
    const { global } = this.props
    const { AuthContract, account } = global
    console.log('account', account)
    AuthContract.AddLikes(business_id, un).then((res)=>{
      self.GetLikes()
    }).catch((err)=>{
      console.log('Error":', err)
    })
  }

  handleClaimBusiness(business_id) {
    console.log('handleClaimBusiness')
    const { global } = this.props
    const { AuthContract } = global
    AuthContract.ClaimBusiness(business_id)
  }

  render() {
    const { likes, bookmarks } = this.state
    console.log('Dashboard', likes, bookmarks)
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with your own smart contract successfully.</p>
          </div>
        </div>
        <div className="md-grid">
        {
          businesses.map((business)=>{
            return(<Card key={business.business_id} className="cards__example md-cell md-cell--3 md-cell--8-tablet">
              <Media>
                <img src="http://lorempixel.com/400/200/" alt="Nature from lorempixel" />
                <MediaOverlay>
                  <CardTitle title={business.business_name} subtitle={business.business_address}>
                    <Button onClick={this.handleAddBookmark.bind(this, business.business_id, bookmarks.includes(business.business_id))} className="md-cell--right" icon>{
                      bookmarks.includes(business.business_id) ? 'star' : 'star_border'
                    }</Button>
                    <Button onClick={this.handleAddLike.bind(this, business.business_id, likes.includes(business.business_id))} className="md-cell--right" icon>{
                      likes.includes(business.business_id) ? 'thumbs_up_down': 'thumb_up'
                    }</Button>
                    <Button onClick={this.handleClaimBusiness.bind(this, business.business_id)} className="md-cell--right" icon>business</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
              <CardText>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </CardText>
            </Card>)
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
)(Dashboard)
