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
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import ExternalImage from 'react-external-image'

class POIArticleCard extends React.PureComponent {
	render() {
		const { article } = this.props
		return <div className="tweet-card">
				<span className='article-heading'>{article.title}</span>
				<br/>
				<span className="article-desc">{article.description}</span>
				<br/>
				{ article.source && <span><span className="text-bold">Source:</span> {article.source}</span> }
				{'   '}
				{ article.author && <span><span className="text-bold">Author:</span> {article.author}</span> }
				<br/>
				<br/>
				<a href={article.url} target="_blank">View Original Article</a>
				{/*<Link to={`/tweet/${article.tweet_id}/analysis`}>View Related Tweet</Link>*/}
		</div>
	}
}

export default POIArticleCard
