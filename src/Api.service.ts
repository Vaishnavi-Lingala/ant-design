
const backend_url = 'https://credenti-portal-api.credenti.xyz';

export default {

    getClientConfig(domain: string) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "domain": domain
            })
        };

        return fetch(backend_url + '/client/info', requestOptions)
            .then(response => response.json());
    },

    getAllPolicies(requestOptions: object) {
		return fetch(backend_url + "/account/"+ localStorage.getItem("accountId") + "/product/oprc735871d0/auth-policies", requestOptions)
			.then(response => response.json());
    },

    getPolicyDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/account/"+ localStorage.getItem("accountId") + "/auth-policies/" + uid, requestOptions)
			.then(response => response.json());
    },

    updatePolicyDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/account/"+ localStorage.getItem("accountId") + "/auth-policies/" + uid, requestOptions)
			.then(res => res.json());
    },

    getAllMechanisms(requestOptions: object) {
		return fetch(backend_url + "/account/"+ localStorage.getItem("accountId") + "/mechanism", requestOptions)
			.then(response => response.json());
    },

    getMechanismDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/account/o"+ localStorage.getItem("accountId") + "/mechanism/" + uid, requestOptions)
			.then(response => response.json());
    },

    updateMechanismDetails(uid: string, requestOptions: object) {
		return fetch(backend_url + "/account/"+ localStorage.getItem("accountId") + "/mechanism/" + uid, requestOptions)
			.then(response => response.json());
    }
}