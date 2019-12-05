import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUser,
	faCheckCircle,
	faMeh,
	faSmileBeam,
	faAngry,
	faBook,
	faReply,
	faChartArea,
	faChevronLeft,
	faChevronRight,
	faNewspaper,
	faRetweet,
	faSearch
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ExternalImage from 'react-external-image'

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
			info_card: [],
			analysis: {}
		}
	}
	componentDidMount() {
		this.fetchUserTweetsAndArticles()
	}
	fetchUserTweetsAndArticles() {
		const { actions, match } = this.props
		let poiname = match.params.poiname
		actions.fetchUserTweets({poi_name: poiname})
			.then(res => {
				console.log(res)
				let tweets = res.data.tweets
				let analysis = res.data.analysis
				let tweet = tweets[0]
				let info = {
					poi_name: tweet.poi_name,
					profile_url_https: tweet.profile_url_https,
					user_description: tweet.user_description,
					user_location: tweet.user_location,
					user_name: tweet.user_name,
					user_screen_name: tweet.user_screen_name,
					tweets_count: analysis.poi[poiname]
				}
				// Will incur double renders. Avoid
				this.setState({
					info_card: info,
					tweets: tweets,
					analysis: analysis
				})
				this.fetchUserArticles()
			})
			.catch(res => {
				console.log(res)
			})
	}
	fetchUserArticles() {
		const { actions, match } = this.props
		let poiname = match.params.poiname
		actions.fetchUserArticles({poi_name: poiname})
			.then(res => {
				console.log(res)
				this.setState({loading: false, articles: []})
			})
			.catch(res => {
				console.log(res)
			})
	}
	userInfoCard() {
		const { info_card } = this.state
		return <div className="tweet-card">
				<div className="row">
					<div className="col-md-1">
						<ExternalImage
							src={info_card.profile_url_https}
							fallbackImages={['/static/img/twitter_placeholder.jpg']}
							className="img-46 img-rounded"
						/>
					</div>
					<div className="col-md-10 tweet-card-text">
						<div className="row">
							<Link to={`/poi/${info_card.poi_name}`}>
								<span className="text-bold">{info_card.user_name}</span>{'  '}
							</Link>
							{ info_card.verified && 
							<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">@{info_card.user_screen_name}</span>
						</div>
					</div>
				</div>
			</div>
	}
	render() {
		// Tweet Card
		// Analysis
		// Replies and Articles
		const { loading } = this.state
		if (loading) {
			return <div>
				LOADING
			</div>
		}
		return <div>
			<div className>
				{ this.userInfoCard() }
			</div>
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
