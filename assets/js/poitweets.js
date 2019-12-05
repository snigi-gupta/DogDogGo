import React from 'react'
import POITweetCard from './poitweetcard'
import qs from 'qs'
import { withRouter } from 'react-router-dom'

class POITweets extends React.Component {
	constructor(props) {
		super(props)
		this.mlt = this.mlt.bind(this)
	}
	genQueryString(params={}) {
		return qs.stringify(params, {addQueryPrefix:true})
	}
	mlt(tweet_id) {
		const { history } = this.props
		history.push({
			pathname: '/search',
			search: this.genQueryString({search: tweet_id, mlt_flag: true})
		})
	}
	populateTweets() {
		const { tweets } = this.props
		return tweets.slice(0, 10).map((tweet, i) => {
			return <POITweetCard key={tweet.id} tweet={tweet} mlt={this.mlt} />
		})
	}
	moreTweets() {
		const { total } = this.props
		if (total > 10) {
			return <div className="tweet-card text-center">
				and {total - 10} other tweets...
			</div>
		}
	}
	render() {
		const { total } = this.props
		return <div>
			{ this.populateTweets() }
			{ this.moreTweets() }
		</div>
	}
}

export default withRouter(POITweets)
