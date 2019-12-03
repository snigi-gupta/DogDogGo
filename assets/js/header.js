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
					<li><NavLink to='/analytics' activeClassName='active'>Analytics</NavLink></li>
					<li><NavLink to='/about' activeClassName='active'>About</NavLink></li>
				</ul>
			</div>
		</nav>
	}
}

export default Header
