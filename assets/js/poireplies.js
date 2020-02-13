import React from 'react'
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

const sentimentEmoticonHash = {
	'positive': {icon: faSmileBeam, classname: 'sentiment-happy', label: 'Positive'},
	'negative': {icon: faAngry, classname: 'sentiment-angry', label: 'Negative'},
	'neutral': {icon: faMeh, classname: 'sentiment-neutral', label: 'Neutral'}
}

class POITweetsReplies extends React.Component {
	constructor(props) {
		super(props)
	}
	populateTweets() {
		const { tweets } = this.props
		return tweets.map((tweet, i) => {
			let sentiment = String(tweet.sentiment)
			return <div key={`${tweet.id}-${i}`} className="tweet-card">
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
							<Link to={`/poi/${tweet.poi_name}/analysis`}>
								<span className="text-bold">{tweet.user_name}</span>{'  '}
							</Link>
							{ tweet.verified && 
								<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">@{tweet.user_screen_name}</span>
							<span className="text-grey">
								{' | '}
								{moment(tweet.created_at).fromNow()}
							</span>
						</div>
						<div className="row" dangerouslySetInnerHTML={{__html: tweet.hl_text}}>
						</div>
						<div className="row tweet-card-quicklinks">
							<div className="col-md-3">
								<FontAwesomeIcon
									icon={sentimentEmoticonHash[sentiment]['icon']}
									className={sentimentEmoticonHash[sentiment]['classname']}
								/>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faRetweet}/>
								{' '}
								<span>{tweet.retweet_count}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faReply}/>
								{' '}
								{tweet['retweet_count']}
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faNewspaper}/>
								{' '}
								{tweet.article_count}
							</div>
						</div>
					</div>
					<div className="col-md-1">
					</div>
				</div>
			</div>
		})
	}
	render() {
		return <div className="container">
			<div className="row">
				<div className="col-md-6">
					{ this.populateTweets() }
				</div>
				<div className="col-md-6">
				</div>
			</div>
		</div>
	}
}

export default POITweetsReplies
