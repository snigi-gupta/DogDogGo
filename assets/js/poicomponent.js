import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'

//profile page
//replies
//articles
//analysis

class POIComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			tweets: [],
			articles: [],
			info_card: []
		}
	}
	componentDidMount() {
		this.fetchUserTweetsAndArticles()
	}
	fetchUserTweetsAndArticles() {
		const { actions, match } = this.props
		console.log(match)
		actions.fetchUserTweets({poi_name: match.params.poiname})
			.then(res => {
				console.log(res)
				let tweet = res.data.tweets[0]
				let info = {
					poi_name: tweet.poi_name,
					profile_url_https: profile_url_https,
					user_description: user_description,
					user_location: user_location,
					user_name: user_name,
					user_screen_name: user_screen_name
				}
				// Will incur double renders. Avoid
				this.setState({info_card: info})
				this.fetchUserArticles()
			})
			.catch(res => {
				console.log(res)
			})
	}
	fetchUserArticles() {
		const { actions, match } = this.props
		actions.fetchUserArticles({poi_name: match.params.poiname})
			.then(res => {
				console.log(res)
				this.setState({loading: false})
			})
			.catch(res => {
				console.log(res)
			})
	}
	render() {
		return <div>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(POIComponent)
