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

class POITweetCard extends React.PureComponent {
	render() {
		const { tweet, mlt } = this.props
		let sentiment = String(tweet.sentiment)
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
						<Link to={`/poi/${tweet.poi_name}/analysis`}>
							<span className="text-bold">{tweet.user_name}</span>{'  '}
						</Link>
						{ tweet.verified && 
						<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
						}{'  '}
						<a href={`http://twitter.com/${tweet.user_screen_name}`} target="_blank">
							<span className="text-grey">
								@{tweet.user_screen_name}
							</span>
						</a>
						<span className="text-grey">
							{' | '}
							{moment(tweet.created_at).fromNow()}
						</span>
					</div>
					<div className="row" dangerouslySetInnerHTML={{__html: tweet.hl_text}} />
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
							<Link to={`/tweet/${tweet.id}/replies`}>
								<FontAwesomeIcon icon={faReply}/>
								{' '}
								{tweet.reply_count}
							</Link>
						</div>
						<div className="col-md-3">
							<Link to={`/tweet/${tweet.id}/articles`}>
								<FontAwesomeIcon icon={faNewspaper}/>
								{' '}
								{tweet.article_count}
							</Link>
						</div>
					</div>
					<div className="row tweet-card-more-details">
						<div className="col-md-6">
							<Link to={`/tweet/${tweet.id}/analysis`}>
								Detailed Analysis
								{'   '}
								<FontAwesomeIcon icon={faChevronRight}/>
							</Link>
						</div>
						<div className="col-md-6">
							<a onClick={mlt.bind(this, tweet.id)}>
								More Like This
								{'   '}
								<FontAwesomeIcon icon={faChevronRight}/>
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-1">
				</div>
			</div>
		</div>
	}
}

export default POITweetCard
