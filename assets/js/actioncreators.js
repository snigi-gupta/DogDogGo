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

export function fetchTweetAndReplies(params) {
	return (dispatch) => {
		return axios.get('/api/search/fetch_tweet_and_replies', {params: params})
	}
}

export function fetchArticles(params) {
	return (dispatch) => {
		return axios.get('/api/search/fetch_news', {params: params})
	}
}
