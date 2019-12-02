import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDog, faSearch } from '@fortawesome/free-solid-svg-icons'

class Search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {search: ''}
		this.handleSearchChange = this.handleSearchChange.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
	}
	handleSearchSubmit(event) {
		event.preventDefault()
		const { history } = this.props
		const { search } = this.state
		if (!search || search.length === 0) {
			return
		}
		history.push({
			pathname: '/search',
			search: search
		})
	}
	handleSearchChange(event) {
		this.setState({search: event.target.value})
	}
	render() {
		const { search } = this.state
		return <div className="row">
			<div className="row text-center" style={{marginTop: "12rem"}}>
				<div className="row">
					<FontAwesomeIcon icon={faDog} className="ddg-icon"/>
				</div>
				<div className="row" style={{fontSize: '4rem'}}>
					DogDogGo
				</div>
			</div>
			<div className="row">
				<div className="col-md-offset-4 col-md-4">
					<form onSubmit={this.handleSearchSubmit}>
						<div className="form form-group">
							<input
								name="search"
								type="text"
								className="form-control search-box"
								value={search}
								onChange={this.handleSearchChange}
								autoComplete="off"
							/>
							<FontAwesomeIcon icon={faSearch} className="search-icon"/>
						</div>
					</form>
				</div>
			</div>
		</div>
	}
}

export default Search
