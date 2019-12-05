import axios from 'axios'

export function fetchTweets(params) {
	return (dispatch) => {
		return axios.get('/api/search', {params: params})
	}
}

export function fetchUserTweets(params) {
	return (dispatch) => {
		return axios.get('/api/search/fetch_user_tweets', {params: params})
	}
}

export function fetchUserArticles(params) {
	return (dispatch) => {
		return axios.get('/api/search/fetch_user_news', {params: params})
	}
}
