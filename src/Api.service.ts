import { base_url, getCredentiTokenHeaders } from "./ApiUtils";

export default {

	get(path: string, params?: object) : Promise<any> {
		var requestOptions = {
			method: 'GET',
			headers: getCredentiTokenHeaders()
		}

		var url = new URL(`${base_url}/${path}`);
		if (params) {
			Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		}

		return fetch(url.href, requestOptions)
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
	},

	delete(path: string, data: object) : Promise<any> {
		var requestOptions = {
			method: 'DELETE',
			headers: getCredentiTokenHeaders(),
			body: JSON.stringify(data)
		}

		return fetch(`${base_url}/${path}`, requestOptions)
			.then(res => res.json());
	}
}
