import React from 'react'
import Plot from 'react-plotly.js'

class POIAnalysis extends React.PureComponent {
	render() {
		const { analysis } = this.props
		return <div className="container-fluid">
			<div className="row">
				<div className="row">
					<div className="col-md-3 col-md-offset-3">
						<Plot
							key='source'
							data={[
							{
							y: Object.values(analysis.hashtags),
							x: Object.keys(analysis.hashtags),
							type: 'bar',
							},
							]}
							layout={{width: 480, height: 360, title: 'Distribution of Devices Used'}}
						/>
					</div>
					<div className="col-md-3">
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
				</div>
			</div>
		</div>
	}
}

export default POIAnalysis
