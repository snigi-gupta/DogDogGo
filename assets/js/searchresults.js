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
	faChevronRight,
	faNewspaper
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import ExternalImage from 'react-external-image'

const sentimentEmoticonHash = {
	positive: {icon: faSmileBeam, classname: 'sentiment-happy'},
	negative: {icon: faAngry, classname: 'sentiment-angry'},
	neutral: {icon: faMeh, classname: 'sentiment-neutral'}
}

class SearchResults extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tweets: [],
			loading: false
		}
	}
	componentDidMount() {
		this.fetchTweets()
	}
	fetchTweets() {
		// send query results later
		const { actions } = this.props
		actions.fetchTweets()
			.then((res) => {
				console.log(res)
				let data = res.data
				let tweets = data.map((tweet) => {
					return {
						id: tweet.id,
						text: tweet.tweet_text,
						poi: tweet.poi_name,
						tweet_date: tweet.tweet_date,
						verified: tweet.verified,
						sentiment: tweet.sentiment,
						topic: tweet.topic,
						impact: tweet.impact,
						userProfileImage: 'https://pbs.twimg.com/profile_images/1097820307388334080/9ddg5F6v_normal.png'
					}
				})
				this.setState({tweets: tweets, loading: false})
			})
			.catch((res) => {
				console.log(res)
			})
	}
	searchElements() {
		const { tweets } = this.state
		return tweets.map((tweet, i) => {
			return <div key={`${tweet.id}-${i}`} className="tweet-card">
				<div className="row">
					<div className="col-md-1">
						<ExternalImage
							src={tweet.userProfileImage}
							fallbackImages={['/static/img/twitter_placeholder.jpg']}
							className="img-46 img-rounded"
						/>
					</div>
					<div className="col-md-10 tweet-card-text">
						<div className="row">
							<span className="text-bold">{tweet.poi}</span>{'  '}
							{ tweet.verified && 
							<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">
								{moment(tweet.tweet_date).fromNow()}
							</span>
						</div>
						<div className="row">
							{tweet.text}
						</div>
						<div className="row tweet-card-quicklinks">
							<div className="col-md-3">
								<FontAwesomeIcon
									icon={sentimentEmoticonHash[tweet.sentiment]['icon']}
									className={sentimentEmoticonHash[tweet.sentiment]['classname']}
								/>
								{' '}
								<span>{tweet.sentiment}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faBook}/>
								{' '}
								<span>{tweet.topic}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faReply}/>
								{' '}
								{tweet['impact']['replies']} Replies
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faNewspaper}/>
								{' '}
								{tweet['impact']['articles']} Articles
							</div>
						</div>
						<div className="row tweet-card-more-details">
							Detailed Analysis
							{'   '}
							<FontAwesomeIcon icon={faChevronRight}/>
						</div>
					</div>
					<div className="col-md-1">
					</div>
				</div>
			</div>
		})
	}
	render() {
		const { loading } = this.state
		if (loading) {
			return <div style={{textAlign: 'center'}}>
				LOADING
			</div>
		} else {
			return <div>
				<div className="row">
					<div className="col-md-2">
					</div>
					<div className="col-md-6">
						{ this.searchElements() }
					</div>
					<div className="col-md-4">
					</div>
				</div>
				<div>
					{/* pagination code later */}
				</div>
			</div>
		}
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchResults)
