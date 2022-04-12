
const backend_url = 'https://credenti-portal-api.credenti.xyz';
const headers = {
    'Content-Type': 'application/json'
};

export default {

    getClientConfig(domain: string) {
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "domain": domain
            })
        };

        return fetch(backend_url + '/client/info', requestOptions)
            .then(response => response.json());
    },

    getAllPolicies() {
		return fetch(backend_url + "/account/ooaab3ab3443/product/oprc735871d0/auth-policies")
			.then(response => response.json());
    },

    getPolicyDetails(uid: string) {
		return fetch(backend_url + "/auth-policies/" + uid)
			.then(response => response.json());
    },

    updatePolicyDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/auth-policies/" + uid, requestOptions)
			.then(res => res.json());
    },

    getAllMechanisms() {
		return fetch(backend_url + "/account/ooa9a5e20722/mechanism")
			.then(response => response.json());
    },

    getMechanismDetails(uid: string) {
		return fetch(backend_url + "/account/ooa9a5e20722/mechanism/" + uid)
			.then(response => response.json());
    },

    updateMechanismDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/account/ooa9a5e20722/mechanism/" + uid, requestOptions)
			.then(response => response.json());
    }
}