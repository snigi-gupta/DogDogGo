import React from 'react'
import { Switch, Route } from 'react-router-dom' 
import Search from './search'
import SearchResults from './searchresults'
import Analytics from './analytics'
import Header from './header'
import TweetComponent from './tweetcomponent'
import POIComponent from './poicomponent'

class App extends React.Component {
	render() {
		return <div>
			<Header />
			<div style={{marginTop: "8rem"}}>
				<Switch>
					<Route exact path='/' component={Search} />
					<Route exact path='/search' component={SearchResults} />
					<Route exact path='/search/p/:currentpage?' component={SearchResults} />
					<Route exact path='/analysis' component={Analytics} />
					<Route exact path='/tweet/:tweetid' component={TweetComponent} />
					<Route exact path='/poi/:poiname' component={POIComponent} />
				</Switch>
			</div>
		</div>
	}
}

export default App
