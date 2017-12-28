import React, { Component } from 'react'
import { connect } from 'react-redux'
import { businesses } from '../util/businessmocklist'
import {
  Card,
  CardTitle,
  CardText,
  Media,
  MediaOverlay,
	Paper
} from 'react-md'
import { Bar } from 'react-chartjs-2';

class Claims extends Component {
  constructor(props) {
    super(props)

    this.state = {
      claims: {},
    }
		this.userscount = 0;

    this.GetClaims = this.GetClaims.bind(this)
  }

  componentDidMount() {
    this.GetClaims()
  }

  GetClaims() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetClaims().then((claims)=>{
			return new Promise(function(resolve, reject) {
				let list = {}, index = 0
				claims.map((business)=>{
					let id = web3.toUtf8(business)
					AuthContract.GetBusinessDetails(id).then((details)=>{
						const [ likescount, bookmarkcount ] = details
						list[id] = { likescount: likescount.valueOf(), bookmarkcount: bookmarkcount.valueOf() }
						if(index === claims.length-1) {
							resolve(list)
						}
						index++;
					})
				})
			}).then((list)=>{
	      self.setState({ claims: list })
	    })
    }).catch((err)=>{
      console.log('GetClaims Err: ', err)
    })
  }

	GetPeople() {
    const self = this
    const { global, web3 } = this.props
    const { AuthContract } = global
    AuthContract.GetPeople().then((people)=>{
      // length = no of users
			self.userscount = people.length
    }).catch((err)=>{
      console.log('GetPeople Err', err)
    })
  }

  render() {
    const { claims } = this.state
		const self = this
    let biz = [], labels = [], likesData = [], interestedData = [], datasets = []
		if(Object.keys(claims).length > 0) {
			// biz = businesses.filter((f)=>{
			// 	return claims[f.business_id] !== undefined
			// })
			businesses.map((business)=>{
				if(claims[business.business_id]) {
					labels.push(business.business_name)
					let data = Object.assign({}, business, claims[business.business_id])
					likesData.push(data.likescount)
					interestedData.push(data.bookmarkcount)
					biz.push(data)
				}
			})
		}

		const chartData = {
			labels: labels,
			datasets: [
				{
					label: 'Likes',
					backgroundColor: 'blue',
					data: likesData
				},
				{
					label: 'Interested',
					backgroundColor: 'green',
					data: interestedData
				}
			]
		}

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
				<Paper className="cards__example md-cell md-cell--3">
					<Bar data={chartData} width={100}
						height={200}
						options={{
							maintainAspectRatio: false,
							scales: {
								yAxes: [{
									ticks: {
										min: 0, // it is for ignoring negative step.
										beginAtZero: true,
										callback: function(value, index, values) {
											if (Math.floor(value) === value) {
												return value;
											}
										}

									}
								}]
							}
						}}
					/>
				</Paper>
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
