import React from 'react'
import { Link, NavLink } from 'react-router-dom'

class Header extends React.Component {
	render() {
		return <nav className="navbar navbar-default navbar-fixed-top">
			<div className="container-fluid">
				<div className="navbar-header">
					<Link className="navbar-brand" to='/'>DogDogGo</Link>
				</div>
				<ul className="nav navbar-nav navbar-right">
					<li><a href='/usageanalytics' target="_blank" activeClassName='active'>Usage Analytics</a></li>
					<li><a href='/timeanalytics' target="_blank" activeClassName='active'>Time Series Analytics</a></li>
					<li><a href='/locanalytics' target="_blank" activeClassName='active'>Location Analytics</a></li>
					<li><NavLink to='/about' activeClassName='active'>About</NavLink></li>
				</ul>
			</div>
		</nav>
	}
}

export default Header
