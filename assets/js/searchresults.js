import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './actioncreators'
import { bindActionCreators } from 'redux'
import { actions } from './actioncreators'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUser,
	faCheckCircle,
	faMeh,
	faSmileBeam,
	faAngry,
	faBook,
	faReply,
	faChartArea,
	faChevronLeft,
	faChevronRight,
	faNewspaper
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import ExternalImage from 'react-external-image'
import ReactPaginate from 'react-paginate'
import Select from 'react-select';
import Plot from 'react-plotly.js';

const sentimentEmoticonHash = {
	positive: {icon: faSmileBeam, classname: 'sentiment-happy'},
	negative: {icon: faAngry, classname: 'sentiment-angry'},
	neutral: {icon: faMeh, classname: 'sentiment-neutral'}
}

class SearchResults extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tweets: [],
			loading: false,
			pageCount: 1,
			search: ''
		}
		this.handlePageClick = this.handlePageClick.bind(this)
		this.handleSearchChange = this.handleSearchChange.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
	}
	componentDidMount() {
		this.fetchTweets()
	}
	fetchTweets() {
		// send query results later
		const { actions } = this.props
		actions.fetchTweets({limit: 25, offset: 0})
			.then((res) => {
				console.log(res)
				let data = res.data
				let tweets = data.map((tweet) => {
					return {
						id: tweet.id,
						text: tweet.tweet_text,
						poi: tweet.poi_name,
						tweet_date: tweet.tweet_date,
						verified: tweet.verified,
						sentiment: tweet.sentiment,
						topic: tweet.topic,
						impact: tweet.impact,
						userProfileImage: 'https://pbs.twimg.com/profile_images/1097820307388334080/9ddg5F6v_normal.png'
					}
				})
				this.setState({tweets: tweets, loading: false})
			})
			.catch((res) => {
				console.log(res)
			})
	}
	searchElements() {
		const { tweets } = this.state
		return tweets.map((tweet, i) => {
			return <div key={`${tweet.id}-${i}`} className="tweet-card">
				<div className="row">
					<div className="col-md-1">
						<ExternalImage
							src={tweet.userProfileImage}
							fallbackImages={['/static/img/twitter_placeholder.jpg']}
							className="img-46 img-rounded"
						/>
					</div>
					<div className="col-md-10 tweet-card-text">
						<div className="row">
							<span className="text-bold">{tweet.poi}</span>{'  '}
							{ tweet.verified && 
							<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">
								{moment(tweet.tweet_date).fromNow()}
							</span>
						</div>
						<div className="row">
							{tweet.text}
						</div>
						<div className="row tweet-card-quicklinks">
							<div className="col-md-3">
								<FontAwesomeIcon
									icon={sentimentEmoticonHash[tweet.sentiment]['icon']}
									className={sentimentEmoticonHash[tweet.sentiment]['classname']}
								/>
								{' '}
								<span>{tweet.sentiment}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faBook}/>
								{' '}
								<span>{tweet.topic}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faReply}/>
								{' '}
								{tweet['impact']['replies']} Replies
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faNewspaper}/>
								{' '}
								{tweet['impact']['articles']} Articles
							</div>
						</div>
						<div className="row tweet-card-more-details">
							Detailed Analysis
							{'   '}
							<FontAwesomeIcon icon={faChevronRight}/>
						</div>
					</div>
					<div className="col-md-1">
					</div>
				</div>
			</div>
		})
	}
	handlePageClick(data) {
		console.log(data)
	}
	filters() {
		let pois = [
			{ value: 'BarackObama', label: 'Barack Obama'},
			{ value: 'BernieSanders', label: 'Bernie Sanders'},
		]
		let locations = [
			{ value: 'New York', label: 'New York'},
			{ value: 'New Delhi', label: 'New Delhi'},
			{ value: 'Vermont', label: 'Vermont'},
		]
		let hashtags = [
			{value: 'metoo', label: '#metoo'},
			{value: 'trump', label: '#Trump'},
			{value: 'impeachtrump', label: '#ImpeachTrump'},
		]
		return <div className="filter-box">
			<h2 style={{textAlign: 'center'}}>
				FILTERS
			</h2>
			<div>
				<form>
					<div className="form form-group">
						<label htmlFor='poi'>Person of Interests</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="poi"
							options={pois}
						/>
					</div>
					<div className="form form-group">
						<label htmlFor='poi'>Locations</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="poi"
							options={locations}
						/>
					</div>
					<div className="form form-group">
						<label htmlFor='poi'>Hashtags</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="poi"
							options={hashtags}
						/>
					</div>
					<div className="row" style={{textAlign: 'center'}}>
						<button className="btn btn-info" style={{width: '10rem'}}>
							Filter
						</button>
						<button className="btn btn-default" style={{width: '10rem', marginLeft: '3rem'}}>
							Clear
						</button>
					</div>
				</form>
			</div>
		</div>
	}
	searchBox() {
		const { search } = this.state
		return <div className="row">
			<form onSubmit={this.handleSearchSubmit}>
				<div className="form form-group">
					<input name="search" type="text" className="form-control" value={search} onChange={this.handleSearchChange}/>
				</div>
			</form>
		</div>
	}
	handleSearchSubmit(event) {
		event.preventDefault()
		const { search } = this.state
		const { actions } = this.props
		actions.fetchTweets({limit: 25, offset: 0, search: search})
			.then(res => {
				console.log(res)
			})
			.catch(res => {
				console.log(res)
			})
	}
	handleSearchChange(event) {
		this.setState({search: event.target.value})
	}
	analytics() {
		return <Plot
			data={[
			{
				x: [1, 2, 3],
				y: [2, 6, 3],
				type: 'scatter',
				mode: 'lines+markers',
				marker: {color: 'red'},
			},
			{type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
			]}
			layout={{width: 480, height: 360, title: 'Locations'}}
		/>
	}
	render() {
		const { loading, pageCount } = this.state
		const { match } = this.props
		let currentpage = parseInt(match && match.params.currentpage) || 0
		if (loading) {
			return <div style={{textAlign: 'center'}}>
				LOADING
			</div>
		} else {
			return <div>
				<div className="row">
					<div className="col-md-offset-1 col-md-2">
						{ this.filters() }
					</div>
					<div className="col-md-5">
						{ this.searchBox() }
						<div className="row">
							{ this.searchElements() }
						</div>
					</div>
					<div className="col-md-4">
						{ this.analytics() }
						{ this.analytics() }
					</div>
				</div>
				<div className="paginate bv-pagination">
					<ReactPaginate
						previousLabel={<FontAwesomeIcon icon={faChevronLeft} className="picon chev-left"/>}
						nextLabel={<FontAwesomeIcon icon={faChevronRight} className="picon chev-right"/>}
						breakLabel={<a>...</a>}
						pageCount={2}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={this.handlePageClick}
						activeClassName={"active"}
						previousClassName={"active-arrow"}
						nextClassName={'active-arrow'}
						disabledClassName={'disabled'}
						forcePage={currentpage}
					/>
				</div>
			</div>
		}
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchResults)
