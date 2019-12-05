import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import POIAnalysis from './poi/poianalysis'
import POITweetsReplies from './poi/poitweetsreplies'
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
	faMapMarkerAlt,
	faSearch
} from '@fortawesome/free-solid-svg-icons'
import { Link, Switch, Route } from 'react-router-dom'
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
					verified: tweet.verified,
					profile_url_https: tweet.profile_url_https,
					user_description: tweet.user_description,
					user_location: tweet.user_location,
					user_name: tweet.user_name,
					user_screen_name: tweet.user_screen_name,
					tweets_count: analysis.poi[poiname.toLowerCase()]
				}
				// Will incur double renders. Avoid
				this.setState({
					info_card: info,
					tweets: tweets,
					analysis: analysis,
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
							<a href={`https://twitter.com/${info_card.user_screen_name}`}>
								<span className="text-bold">{info_card.user_name}</span>{'  '}
							</a>
							{ info_card.verified && 
							<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">@{info_card.user_screen_name}</span>
						</div>
						<div className="row">
							{ info_card.user_description }
						</div>
						<div className="row">
							<FontAwesomeIcon icon={faMapMarkerAlt} className="verified-circle"/>
							{'  '}
							{ info_card.user_location }
						</div>
						<div className="row">
							{ info_card.tweets_count } Tweets
						</div>
					</div>
				</div>
			</div>
	}
	header() {
		const { match, location } = this.props
		return <div>
			<ul className="bv-tab-list-style-2">
				<li>
					<Link
						to={`/poi/${match.params.poiname}/analysis`}
						className={match.params.type === 'analysis' ? 'active' : ''}
					>
						Analysis
					</Link>
				</li>
				<li>
					<Link
						to={`/poi/${match.params.poiname}/tweetsarticles`}
						className={match.params.type === 'tweetsarticles' ? 'active' : ''}
					>
						Tweets and Articles
					</Link>
				</li>
			</ul>
		</div>
	}
	content() {
		const { match } = this.props
		switch(match.param.type) {
			case 'analysis':
				return <POIAnalysis analysis={analysis} />
			case 'replies':
				return <POITweets tweets={tweets} />
			case 'articles':
				return <POIArticles articles={articles} />
		}
	}
	render() {
		// Tweet Card
		// Analysis
		// Replies and Articles
		const { loading, analysis, articles, tweets } = this.state
		const { match } = this.props
		if (loading) {
			return <div>
				LOADING
			</div>
		}
		return <div>
			<div className="user-info-card">
				{ this.userInfoCard() }
				{ this.header() }
			</div>
			{ this.content() }
			{ match.params.type === 'analysis' ? <POIAnalysis analysis={analysis}/> : <POITweetsReplies tweets={tweets} articles={articles}/> }
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
