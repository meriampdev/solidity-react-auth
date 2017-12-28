import React, { Component } from 'react'
import { connect } from 'react-redux'
import { businesses } from '../util/businessmocklist'
import {
  Card,
  CardTitle,
  CardText,
  Media,
  MediaOverlay,
} from 'react-md'

class Claims extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bookmarks: []
    }

    this.GetClaims = this.GetClaims.bind(this)
  }

  componentDidMount() {
    this.GetClaims()
  }

  GetClaims() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetClaims().then((bookmarks)=>{
      return bookmarks.map((business)=>{
        let id = web3.toUtf8(business)
        return id
      })
    }).then((list)=>{
      self.setState({ bookmarks: list })
    }).catch((err)=>{
      console.log('GetClaims Err: ', err)
    })
  }

  render() {
    const { bookmarks } = this.state
    let biz = businesses.filter(f=>bookmarks.includes(f.business_id))
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Claims</h1>
          </div>
        </div>
        <div className='md-grid'>
          {
            biz.map((business)=>{
              return(<Card key={business.business_id} className="cards__example md-cell md-cell--3 md-cell--8-tablet">
                <Media>
                  <img src="http://lorempixel.com/400/200/" alt="Nature from lorempixel" />
                  <MediaOverlay>
                    <CardTitle title={business.business_name} subtitle={business.business_address}>

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
)(Claims)
