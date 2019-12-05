import React from 'react'
import POIArticleCard from './poitweetcard'
import qs from 'qs'

class POIArticles extends React.PureComponent {
	populateArticles() {
		const { articles } = this.props
		return articles.map((article, i) => {
			return <POIArticleCard article={article} />
		})
	}
	render() {
		const { articles } = this.props
		if (articles.length == 0) {
			return <div className="nothing-found">
				<img src='/static/img/no-articles.svg' />
				<br />
				<span style={{fontSize: '3rem'}}>No Articles Found!</span>
			</div>
		}
		return <div className="container">
			{ this.populateArticles() }
		</div>
	}
}

export default POIArticles
