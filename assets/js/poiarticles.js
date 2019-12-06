import React from 'react'
import POIArticleCard from './poiarticlecard'
import qs from 'qs'

class POIArticles extends React.PureComponent {
	populateArticles() {
		const { articles } = this.props
		return articles.map((article, i) => {
			return <POIArticleCard key={i} article={article} />
		})
	}
	render() {
		const { articles } = this.props
		console.log(articles)
		if (articles.length == 0) {
			return <div className="nothing-found">
				<img src='/static/img/no-articles.svg' />
				<br />
				<span style={{fontSize: '3rem'}}>No Articles Found!</span>
			</div>
		}
		return <div>
			{ this.populateArticles() }
		</div>
	}
}

export default POIArticles
