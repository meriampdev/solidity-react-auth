import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button, Badge,
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
      likes: [], bookmarks: [], claimed: [],
      businesslikes: {}
    }

    this.GetLikes = this.GetLikes.bind(this)
    this.GetBookmarks = this.GetBookmarks.bind(this)
    this.GetLikeCount = this.GetLikeCount.bind(this)
		this.GetClaimed = this.GetClaimed.bind(this)
  }

  componentDidMount() {
    this.GetLikes()
    this.GetBookmarks()
    this.GetLikeCount()
		this.GetClaimed()
  }

  GetLikes() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetLikes().then((likes)=>{
      let arr = likes.map((bizID)=>{
        let id =  web3.toUtf8(bizID)
        return id
      })
      self.setState({ likes: arr })
    })
  }

  GetLikeCount() {
    const self = this
    const { global } = this.props
    const { AuthContract } = global
    let businesslikes = {}
    let index = 0
    new Promise(function(resolve, reject) {
      businesses.map((business, i)=>{
        AuthContract.GetLikeCount(business.business_id).then((count)=>{
          index++;
          businesslikes[business.business_id] = count.valueOf()
          if(index >= businesses.length) {
            resolve()
          }
        })
        // return business;
      })
    }).then(()=>{
      self.setState({ businesslikes })
    })
  }

  GetBookmarks() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetBookmarks().then((bookmarks)=>{
      let arr = bookmarks.map((bizID)=>{
        let id =  web3.toUtf8(bizID)
        return id
      })
      self.setState({ bookmarks: arr })
    })
  }

  GetClaimed() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetClaimed().then((claimed)=>{
      let arr = claimed.map((bizID)=>{
        let id =  web3.toUtf8(bizID)
        return id
      })
      self.setState({ claimed: arr })
    })
  }

  handleAddBookmark(business_id, un) {
    const self = this
    const { global } = this.props
    const { AuthContract } = global
    AuthContract.AddBookmark(business_id, un).then(()=>{
      self.GetBookmarks()
    })
  }

  handleAddLike(business_id, un) {
    const self = this
    const { global } = this.props
    const { AuthContract } = global
    let { businesslikes } = this.state
    AuthContract.AddLikes(business_id, un).then((res)=>{
      if(un) {
        businesslikes[business_id]--
      } else {
        businesslikes[business_id]++
      }

      self.setState({ businesslikes })
      self.GetLikes()
    }).catch((err)=>{
      console.log('Error":', err)
    })
  }

  handleClaimBusiness(business_id) {
    const { global } = this.props
    const { AuthContract } = global
    AuthContract.ClaimBusiness(business_id)
  }

  render() {
    const { likes, bookmarks, businesslikes, claimed } = this.state
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Businesses</h1>
          </div>
        </div>
        <div className="md-grid">
        {
          businesses.map((business)=>{
						let liked = likes.includes(business.business_id)
						let bookmarked = bookmarks.includes(business.business_id)
            return(<Card key={business.business_id} className="cards__example md-cell md-cell--3 md-cell--8-tablet">
              <Media>
                <img src="http://lorempixel.com/400/200/" alt="Nature from lorempixel" />
                <MediaOverlay>
                  <CardTitle title={business.business_name} subtitle={business.business_address}>
                    <Button
											onClick={this.handleAddBookmark.bind(this, business.business_id, bookmarked)}
											className="md-cell--right"
											icon
											tooltipLabel="Bookmark" tooltipPosition="top"
										>
											{
                      	bookmarked ? 'star' : 'star_border'
                    	}
									</Button>
                    <Badge
                      badgeContent={Object.keys(businesslikes).length > 0 ? businesslikes[business.business_id] : '0'}
                      primary badgeId="notifications-like"
                    >
                      <Button
												onClick={this.handleAddLike.bind(this, business.business_id, liked)}
												className="md-cell--right" icon
												tooltipLabel={liked ? 'Unlike' : 'Like'} tooltipPosition="top"
											>
                        {
                          liked ? 'thumbs_up_down': 'thumb_up'
                        }
                      </Button>
                    </Badge>
										{
											!claimed.includes(business.business_id) ?
												<Button
													onClick={this.handleClaimBusiness.bind(this, business.business_id)}
													className="md-cell--right" icon
													tooltipLabel={'Claim'} tooltipPosition="top"
												>business</Button>
											: null
										}
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
