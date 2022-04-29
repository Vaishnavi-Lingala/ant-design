import { base_url, getCredentiTokenHeaders } from "./ApiUtils";

export default {

	get(path: string) : Promise<any> {
		var requestOptions = {
			method: 'GET',
			headers: getCredentiTokenHeaders()
		}

		return fetch(`${base_url}/${path}`, requestOptions)
			.then(res => res.json());
	},

	post(path: string, data: object) : Promise<any> {
		var requestOptions = {
			method: 'POST',
			headers: getCredentiTokenHeaders(),
			body: JSON.stringify(data)
		}

		return fetch(`${base_url}/${path}`, requestOptions)
			.then(res => res.json());
	},

	put(path: string, data: object) : Promise<any> {
		var requestOptions = {
			method: 'PUT',
			headers: getCredentiTokenHeaders(),
			body: JSON.stringify(data)
		}

		return fetch(`${base_url}/${path}`, requestOptions)
			.then(res => res.json());
	}
}
