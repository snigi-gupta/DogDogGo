import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import POIAnalysis from './poianalysis'
import ReplyTweets from './replytweets'
import POIArticles from './poiarticles'
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
	faMapMarkerAlt,
	faSearch
} from '@fortawesome/free-solid-svg-icons'
import { Link, Switch, Route, withRouter } from 'react-router-dom'
import moment from 'moment'
import ExternalImage from 'react-external-image'

class TweetComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {tweet: null, replies: [], analysis: {}, articles: [], loading: true}
	}
	componentDidMount() {
		this.fetchTweetAndReplies()
	}
	fetchTweetAndReplies() {
		const { actions, match } = this.props
		let tweetid = match && match.params && match.params.tweetid
		this.setState({loading: true})
		actions.fetchTweetAndReplies({id: tweetid})
			.then(res => {
				let data = res.data
				console.log(res)
				this.setState({
					tweet: data.original_tweet,
					replies: data.tweets,
					analysis: data.analysis,
					totalReplies: data.total,
				})
				this.fetchArticles()
			})
			.catch(res => {
				console.log(res)
				this.setState({loading: false})
			})
	}
	fetchArticles() {
		const { actions, match } = this.props
		let tweetid = match && match.params && match.params.tweetid
		actions.fetchArticles({id: tweetid})
			.then(res => {
				console.log('h', res)
				this.setState({loading: false, articles: res.data})
			})
			.catch(res => {
				console.log(res)
			})
	}
	content() {
		const { match } = this.props
		const { analysis, articles, replies, totalReplies } = this.state
		switch (match.params.type) {
			case 'analysis':
				return <POIAnalysis
					analysis={analysis}
					fallbackMessage='No Replies Found!'
					tweets={replies}
				/>
			case 'replies':
				return <ReplyTweets
					tweets={replies}
					total={totalReplies}
					fallbackMessage='No Replies Found!'
				/>
			case 'articles':
				return <POIArticles articles={articles} />
		}
	}
	tweetInfoCard() {
		const { tweet } = this.state
		return <div className="tweet-card">
			<div className="row">
				<div className="col-md-1">
					<ExternalImage
						src={tweet.profile_url_https}
						fallbackImages={['/static/img/twitter_placeholder.jpg']}
						className="img-46 img-rounded"
					/>
				</div>
				<div className="col-md-10 tweet-card-text">
					<div className="row">
						<a href={`https://twitter.com/${tweet.user_screen_name}`}>
							<span className="text-bold">{tweet.user_name}</span>{'  '}
						</a>
						{ tweet.verified && 
						<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
						}{'  '}
						<span className="text-grey">@{tweet.user_screen_name}</span>
					</div>
					<div className="row">
						{ tweet.hl_text }
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
						to={`/tweet/${match.params.tweetid}/analysis`}
						className={match.params.type === 'analysis' ? 'active' : ''}
					>
						Analysis
					</Link>
				</li>
				<li>
					<Link
						to={`/tweet/${match.params.tweetid}/replies`}
						className={match.params.type === 'replies' ? 'active' : ''}
					>
						Replies
					</Link>
				</li>
				<li>
					<Link
						to={`/tweet/${match.params.tweetid}/articles`}
						className={match.params.type === 'articles' ? 'active' : ''}
					>
						Articles
					</Link>
				</li>
			</ul>
		</div>
	}
	render() {
		const { loading } = this.state
		if (loading) {
			return <div>
				LOADING
			</div>
		}
		return <div>
			<div className="user-info-card">
				{ this.tweetInfoCard() }
				{ this.header() }
				{ this.content() }
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TweetComponent)
