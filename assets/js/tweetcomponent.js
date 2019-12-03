import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TweetAnalysis from './tweet/tweetanalysis'
import TweetReplies from './tweet/tweetreplies'
import TweetArticles from './tweet/tweetarticles'
import TweetMLT from './tweet/tweetmlt'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'

class TweetComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {tweet: null, loading: true}
	}
	componentDidMount() {
		this.fetchTweetInfo()
	}
	fetchTweetInfo() {
		const { actions, match } = this.props
		let tweetid = match && match.params && match.params.tweetid
		actions.fetchTweetInfo({tweetid: tweetid})
			.then(res => {
				this.setState({loading: false})
			})
			.catch(res => {
				console.log(res)
				this.setState({loading: false})
			})
	}
	tweetCard() {
		const { tweet } = this.state
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
				</div>
				<div className="col-md-1">
				</div>
			</div>
		</div>
	}
	render() {
		const { loading } = this.state
		if (loading) {
			return <div>
				Loading
			</div>
		} else {
			return <div>
				<div>
					{ this.tweetCard() }
				</div>
				<div>
				</div>
				<Switch>
					<Route exact path='/analysis' component={TweetAnalysis} />
					<Route exact path='/replies' component={TweetReplies} />
					<Route exact path='/replies/p/:currentpage?' component={TweetReplies} />
					<Route exact path='/articles' component={TweetArticles} />
					<Route exact path='/articles/p/:currentpage?' component={TweetArticles} />
					<Route exact path='/mlt' component={TweetMLT} />
					<Route exact path='/mlt/p/:currentpage?' component={TweetMLT} />
				</Switch>
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TweetComponent)
