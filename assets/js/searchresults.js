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
	faNewspaper,
	faRetweet
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import ExternalImage from 'react-external-image'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import Plot from 'react-plotly.js'
import qs from 'qs'

const sentimentEmoticonHash = {
	'1': {icon: faSmileBeam, classname: 'sentiment-happy', label: 'Positive'},
	'-1': {icon: faAngry, classname: 'sentiment-angry', label: 'Negative'},
	'0': {icon: faMeh, classname: 'sentiment-neutral', label: 'Neutral'}
}

const LIMIT = 20
const DEFAULTQFILTERS = {pois: [], locations: [], hashtags: [], sentiments: []}

class SearchResults extends React.Component {
	constructor(props) {
		super(props)
		let _state = {
			tweets: [],
			loading: true,
			pageCount: 1,
			search: '',
			total: 0,
			timetaken: 0,
			qfilters: DEFAULTQFILTERS
		}
		let currentq = this.parseQuery()
		_state['search'] = currentq['search'] || ''
		_state['qfilters'] = Object.assign(_state['qfilters'], currentq['qfilters'])
		this.state = _state
		this.handlePageClick = this.handlePageClick.bind(this)
		this.handleSearchChange = this.handleSearchChange.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
		this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
		this.handleFilterChange = this.handleFilterChange.bind(this)
		this.clearFilters = this.clearFilters.bind(this)
		this.test = this.test.bind(this)
	}
	componentDidMount() {
		this.fetchTweets()
	}
	componentDidUpdate(prevProps) {
		const { history, match, location } = this.props
		const prevLocation = prevProps.location
		const prevMatch = prevProps.match

		let page = this.getCurrentPage()
		let oldPage = parseInt(prevMatch && prevMatch.params && prevMatch.params.currentpage - 1|| 0)
		if (location.search !== prevLocation.search) {
			this.fetchTweets(true)
		} else if (page !== oldPage) {
			this.fetchTweets(false)
		}
	}
	parseQuery() {
		const { history } = this.props
		const { location } = history
		return qs.parse(location.search, {ignoreQueryPrefix: true})
	}
	getCurrentPage() {
		const { match } = this.props
		let page = match && match.params && match.params.currentpage || 1
		return parseInt(page - 1)
	}
	calculateAnalytics(data) {
		let filters = {}
		Object.keys(data.analysis).forEach(key => {
			let val = data.analysis[key]
			filters[key] = []
			Object.keys(val).forEach(k => {
				filters[key].push({label: k, value: k})
			})
		})
		filters['sentiments'].forEach(x => {
			x['label'] = sentimentEmoticonHash[x['label']]['label']
		})
		return filters
	}
	fetchTweets(fetchAnalytics = true) {
		const { actions } = this.props
		const { filters, analysis } = this.state
		let query = this.parseQuery()
		let search = query.search || ""
		let currentPage = this.getCurrentPage()
		let start = currentPage * LIMIT
		let end = start + LIMIT
		let stime = performance.now()
		actions.fetchTweets({search: search, start: start, end: end, analyticsTrue: fetchAnalytics})
			.then((res) => {
				console.log(res)
				let data = res.data
				let _filters = filters
				if (fetchAnalytics) {
					_filters = this.calculateAnalytics(data)
				}
				let _analysis = data.analysis || analysis
				let etime = performance.now()
				let timetaken = etime - stime
				this.setState({
					tweets: data.tweets,
					filters: _filters,
					analysis: _analysis,
					total: data.total,
					loading: false,
					timetaken: timetaken,
					qfilters: query.qfilters || DEFAULTQFILTERS,
					search: search
				})
			})
			.catch((res) => {
				console.log(res)
			})
	}
	searchElements() {
		const { tweets } = this.state
		return tweets.map((tweet, i) => {
			let sentiment = String(tweet.sentiment)
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
							<span className="text-bold">{tweet.user_name}</span>{'  '}
							{ tweet.verified && 
								<FontAwesomeIcon icon={faCheckCircle} className="verified-circle"/>
							}{'  '}
							<span className="text-grey">@{tweet.poi_name}</span>
							<span className="text-grey">
								{' | '}
								{moment(tweet.created_at).fromNow()}
							</span>
						</div>
						<div className="row" dangerouslySetInnerHTML={{__html: tweet.hl_text}}>
						</div>
						<div className="row tweet-card-quicklinks">
							<div className="col-md-3">
								<FontAwesomeIcon
									icon={sentimentEmoticonHash[sentiment]['icon']}
									className={sentimentEmoticonHash[sentiment]['classname']}
								/>
								{' '}
								<span>{sentimentEmoticonHash[sentiment]['label']}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faRetweet}/>
								{' '}
								<span>{tweet.retweet_count}</span>
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faReply}/>
								{' '}
								{tweet['retweet_count']} Replies
							</div>
							<div className="col-md-3">
								<FontAwesomeIcon icon={faNewspaper}/>
								{' '}
								{tweet['retweet_count']} Articles
							</div>
						</div>
						<div className="row tweet-card-more-details">
							<div className="col-md-6">
								Detailed Analysis
								{'   '}
								<FontAwesomeIcon icon={faChevronRight}/>
							</div>
							<div className="col-md-6">
								<a onClick={this.mlt.bind(this, tweet.id)}>
									More Like This
									{'   '}
									<FontAwesomeIcon icon={faChevronRight}/>
								</a>
							</div>
						</div>
					</div>
					<div className="col-md-1">
					</div>
				</div>
			</div>
		})
	}
	mlt(tweet_id) {
		const { history } = this.props
		history.push({
			pathname: '/search',
			search: this.genQueryString({search: tweet_id, mlt: true})
		})
	}
	handlePageClick(data) {
		const { history } = this.props
		history.push({
			pathname: `/search/p/${data.selected + 1}`,
			search: history.location.search
		})
	}
	genQueryString(params={}) {
		return qs.stringify(params, {addQueryPrefix:true})
	}
	handleFilterSubmit(event, data) {
		event.preventDefault()
		const { history } = this.props
		const { qfilters } = this.state
		const { pois, locations, hashtags, sentiments } = qfilters
		let current_q = this.parseQuery()
		let q = {qfilters: {}}
		if (pois.length > 0) {
			q['qfilters']['pois'] = pois
		}
		if (locations.length > 0) {
			q['qfilters']['locations'] = locations
		}
		if (hashtags.length > 0) {
			q['qfilters']['hashtags'] = hashtags
		}
		if (sentiments.length > 0) {
			q['qfilters']['sentiments'] = sentiments
		}
		q['search'] = current_q['search']
		history.push({
			pathname: '/search',
			search: this.genQueryString(q)
		})
	}
	handleFilterChange(current, info) {
		const { qfilters } = this.state
		let key = info.name
		let newState = {}
		current = current || []
		newState[key] = current.map(x => (x.value))
		let newfilters = Object.assign(qfilters, newState)
		this.setState({qfilters: newfilters})
	}
	clearFilters(event) {
		event.preventDefault()
		const { history } = this.props
		let current_q = this.parseQuery()
		//this.setState()
		history.push({
			pathname: '/search',
			search: this.genQueryString({search: current_q['search']})
		})
	}
	filters() {
		const { filters, qfilters } = this.state
		console.log(filters)
		return <div className="filter-box">
			<h2 style={{textAlign: 'center'}}>
				FILTERS
			</h2>
			<div>
				<form onSubmit={this.handleFilterSubmit}>
					<div className="form form-group">
						<label htmlFor='poi'>Person of Interests</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="pois"
							options={filters.pois}
							onChange={this.handleFilterChange}
							value={qfilters.pois.map(x => ({label: x, value: x}))}
						/>
					</div>
					<div className="form form-group">
						<label htmlFor='locations'>Locations</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="locations"
							options={filters.locations}
							onChange={this.handleFilterChange}
							value={qfilters.locations.map(x => ({label: x, value: x}))}
						/>
					</div>
					<div className="form form-group">
						<label htmlFor='hashtags'>Hashtags</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="hashtags"
							options={filters.hashtags}
							onChange={this.handleFilterChange}
							value={qfilters.hashtags.map(x => ({label: x, value: x}))}
						/>
					</div>
					<div className="form form-group">
						<label htmlFor='hashtags'>Sentiments</label>
						<Select
							isMulti={true}
							className="basic-single"
							classNamePrefix="select"
							isClearable={true}
							name="sentiments"
							options={filters.sentiments}
							onChange={this.handleFilterChange}
							value={qfilters.sentiments.map(x => ({label: x, value: x}))}
						/>
					</div>
					<div className="row" style={{textAlign: 'center'}}>
						<button className="btn btn-info" style={{width: '10rem'}}>
							Apply
						</button>
						<button className="btn btn-default" style={{width: '10rem', marginLeft: '3rem'}} onClick={this.clearFilters}>
							Clear
						</button>
					</div>
				</form>
			</div>
		</div>
	}
	searchBox() {
		const { search } = this.state
		console.log(search)
		return <div className="row">
			<form onSubmit={this.handleSearchSubmit}>
				<div className="form form-group">
					<input
						name="search"
						type="text"
						className="form-control"
						value={search}
						onChange={this.handleSearchChange}
					/>
				</div>
			</form>
		</div>
	}
	genQueryString(params={}) {
		return qs.stringify(params, {addQueryPrefix:true})
	}
	handleSearchSubmit(event) {
		event.preventDefault()
		const { history } = this.props
		const { search } = this.state
		if (!search || search.length === 0) {
			return
		}
		history.push({
			pathname: '/search/p/1',
			search: this.genQueryString({search: search})
		})
	}
	handleSearchChange(event) {
		this.setState({search: event.target.value})
	}
	test(event) {
	}
	analytics() {
		const { analysis } = this.state
		let plots = []
		plots.push(<Plot
			key='location'
			data={[
			{
				y: Object.values(analysis.locations),
				x: Object.keys(analysis.locations),
				type: 'bar',
			},
			]}
			layout={{width: 480, height: 360, title: 'Location Distribution'}}
			onClick={this.test}
		/>)
		plots.push(<Plot
			key='sentiment'
			data={[
			{
				values: Object.values(analysis.sentiments),
				labels: Object.keys(analysis.sentiments),
				type: 'pie',
				marker: {color: 'red'},
			},
			]}
			layout={{width: 480, height: 360, title: 'Sentiment Analysis'}}
			onClick={this.test}
		/>)
		plots.push(<Plot
			key='pois'
			data={[
			{
				values: Object.values(analysis.pois),
				labels: Object.keys(analysis.pois),
				type: 'pie',
				marker: {color: 'red'},
			},
			]}
			layout={{width: 480, height: 360, title: 'Person Of Interests Distribution'}}
			onClick={this.test}
		/>)
		return plots
	}
	render() {
		const { loading, total, timetaken } = this.state
		const { match } = this.props
		let pageCount = parseInt(total / LIMIT) || 1
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
						<div className="row search-time">
							Fetched {total} results in {Math.round(timetaken, 1)} ms.
						</div>
						<div className="row">
							{ this.searchElements() }
						</div>
						<div className="paginate bv-pagination">
							<ReactPaginate
								previousLabel={<FontAwesomeIcon icon={faChevronLeft} className="picon chev-left"/>}
								nextLabel={<FontAwesomeIcon icon={faChevronRight} className="picon chev-right"/>}
								pageCount={pageCount}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={this.handlePageClick}
								activeClassName={"active"}
								previousClassName={"active-arrow"}
								nextClassName={'active-arrow'}
								disabledClassName={'disabled'}
								forcePage={this.getCurrentPage()}
							/>
						</div>
					</div>
					<div className="col-md-4">
						<div className="analysis-box">
							{ this.analytics() }
						</div>
					</div>
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
