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

class ReplyTweetCard extends React.PureComponent {
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
						<span className="text-bold">{tweet.user_name}</span>{'  '}
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
						<div className="col-md-4">
							<FontAwesomeIcon
								icon={sentimentEmoticonHash[sentiment]['icon']}
								className={sentimentEmoticonHash[sentiment]['classname']}
							/>
						</div>
						<div className="col-md-4">
							<Link to={`/tweet/${tweet.in_reply_to_status_id}/analysis`}>
								View Tweet from POI
							</Link>
						</div>
						<div className="col-md-4">
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

export default ReplyTweetCard
