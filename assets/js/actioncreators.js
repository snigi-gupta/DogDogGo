import axios from 'axios'

export function fetchTweets(params) {
	return (dispatch) => {
		return axios.get('/api/search', {params: params})
	}
}
