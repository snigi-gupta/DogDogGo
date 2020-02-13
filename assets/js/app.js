import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom' 
import Search from './search'
import SearchResults from './searchresults'
import Analytics from './analytics'
import Header from './header'
import TweetComponent from './tweetcomponent'
import POIComponent from './poicomponent'

class App extends React.Component {
	render() {
		const { match } = this.props
		return <div>
			<Header />
			<div style={{marginTop: "8rem"}}>
				<Switch>
					<Route exact path='/' component={Search} />
					<Route exact path='/search' component={SearchResults} />
					<Route exact path='/search/p/:currentpage?' component={SearchResults} />
					<Route exact path='/analysis' component={Analytics} />
					<Route exact path='/tweet/:tweetid?/:type?' component={TweetComponent} />
					<Route exact path='/poi/:poiname?/:type?' component={POIComponent} />
				</Switch>
			</div>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withRouter(App))
