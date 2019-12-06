import React from 'react'
import Plot from 'react-plotly.js'

class POIAnalysis extends React.PureComponent {
	render() {
		const { analysis, tweets, fallbackMessage } = this.props
		if (tweets.length == 0) {
			return <div className="nothing-found">
				<img src='/static/img/no-articles.svg' />
				<br />
				<span style={{fontSize: '3rem'}}>{fallbackMessage}</span>
			</div>
		}
		return <div className="text-center">
			<div className="row">
				<div className="row">
					<Plot
						key='sentiment'
						data={[
						{
						values: Object.values(analysis.sentiment),
						labels: Object.keys(analysis.sentiment),
						type: 'pie',
						marker: {color: 'red'},
						},
						]}
						layout={{width: 480, height: 360, title: 'Sentiment Analysis'}}
					/>
				</div>
				<div className="row">
					<Plot
						key='hashtags'
						data={[
						{
						y: Object.values(analysis.hashtags),
						x: Object.keys(analysis.hashtags),
						type: 'bar',
						},
						]}
						layout={{width: 480, height: 360, title: 'Distribution of Hashtags'}}
					/>
				</div>
				<div className="row">
					<Plot
						key='source'
						data={[
						{
						y: Object.values(analysis.source),
						x: Object.keys(analysis.source),
						type: 'bar',
						},
						]}
						layout={{width: 480, height: 360, title: 'Distribution of Devices used by POI'}}
					/>
				</div>
			</div>
		</div>
	}
}

export default POIAnalysis
