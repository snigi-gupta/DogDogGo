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
					<li className="dropdown">
						<a className="dropdown-toggle" data-toggle="dropdown" href="#">Analytics
							<span className="caret"></span></a>
						<ul className="dropdown-menu">
							<li><a href='/usageanalytics' target="_blank" activeclassname='active'>Usage Analytics</a></li>
							<li><a href='/timeanalytics' target="_blank" activeclassname='active'>Country Time Series Analytics</a></li>
							<li><a href='/timeanalytics' target="_blank" activeclassname='active'>Sentiment Time Series Analytics</a></li>
							<li><a href='/locanalytics' target="_blank" activeclassname='active'>Location Analytics</a></li>
						</ul>
					</li>
					<li><NavLink to='/about' activeClassName='active'>About</NavLink></li>
				</ul>
			</div>
		</nav>
	}
}

export default Header
