import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

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
				let data = res.data
				let tweets = data.map((tweet) => {
					return {id: tweet.id, text: tweet.tweet_text, poi: tweet.poi_name, tweet_date: tweet.tweet_date, verified: tweet.verified}
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
						<FontAwesomeIcon className="align-right fa-2x" icon={faUser}/>
					</div>
					<div className="col-md-10 tweet-card-text">
						<div className="row">
							{tweet.poi}{'  '}
							{ tweet.verified && 
								<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							{moment(tweet.tweet_date).fromNow()}
						</div>
						<div className="row">
							{tweet.text}
						</div>
					</div>
					<div className="col-md-1">
					</div>
				</div>
				<div className="row">
					<div className="col-md-3">
						<i className=""></i>
					</div>
					<div className="col-md-3">
					</div>
					<div className="col-md-3">
					</div>
					<div className="col-md-3">
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
