import axios from 'axios'

export function fetchTweets() {
	return (dispatch) => {
		return axios.get('/api/search')
	}
}
