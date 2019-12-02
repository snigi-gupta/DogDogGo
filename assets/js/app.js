import React from 'react'
import { Switch, Route } from 'react-router-dom' 
import Search from './search'
import SearchResults from './searchresults'
import Analytics from './analytics'
import Header from './header'

class App extends React.Component {
	render() {
		console.log(this.props.match)
		return <div>
			<Header />
			<Switch>
				<Route exact path='/' component={Search} />
				<Route exact path='/search' component={SearchResults} />
				<Route exact path='/search/p/:currentpage?' component={SearchResults} />
				<Route exact path='/analysis' component={Analytics} />
			</Switch>
		</div>
	}
}

export default App
