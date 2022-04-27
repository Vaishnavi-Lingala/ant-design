
const backend_url = 'https://credenti-portal-api.credenti.xyz';
// const accountId = "ooa46c499ccb";
const accountId = localStorage.getItem("accountId");

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

    getAllPolicies(accessToken: string) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': accessToken            
            }
        }

		return fetch(backend_url + "/account/"+ accountId + "/product/oprc735871d0/auth-policies", requestOptions)
			.then(response => response.json());
    },

    getPolicyDetails(uid: string, accessToken: string) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': accessToken            
            }
        }

		return fetch(backend_url + "/account/"+ accountId + "/auth-policies/" + uid, requestOptions)
			.then(response => response.json());
    },

    createPolicyDetails(object: object, accessToken: string) {
        let requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				//@ts-ignore
				'X-CREDENTI-ACCESS-TOKEN': accessToken
			},
			body: JSON.stringify({
				...object
			})
		}
        return fetch(backend_url + "/account/" + accountId + "/product/oprc735871d0/auth-policies", requestOptions)
            .then(response => response.json())
    },

    updatePolicyDetails(uid: string, object: object, accessToken: string) {
        var requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json', 
				//@ts-ignore
				'X-CREDENTI-ACCESS-TOKEN': accessToken
			},
			body: JSON.stringify({
				...object
			})
		}

		return fetch(backend_url + "/account/"+ accountId + "/auth-policies/" + uid, requestOptions)
			.then(res => res.json());
    },

    getAllMechanisms(accessToken: string) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': accessToken
            }
        }

		return fetch(backend_url + "/account/"+ accountId + "/mechanism", requestOptions)
			.then(response => response.json());
    },

    getMechanismDetails(uid: string, accessToken: string) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': accessToken
            }
        }

		return fetch(backend_url + "/account/"+ accountId + "/mechanism/" + uid, requestOptions)
			.then(response => response.json());
    },

    updateMechanismDetails(uid: string, object: object, accessToken: string) {
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': accessToken
            },
            body: JSON.stringify({
                ...object
            })
        }

		return fetch(backend_url + "/account/"+ accountId + "/mechanism/" + uid, requestOptions)
			.then(response => response.json());
    },

    getMechanismOptions(){
        return fetch(backend_url + "/mechanism/options")
        .then(response => response.json())
    },

    getAllUsersList(accessToken: string) {

        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CREDENTI-ACCESS-TOKEN': accessToken
            }
        }
        
        return fetch(backend_url + "/account/" + accountId + "/users", requestOptions)
        .then(response => response.json());
    },

    getUserDetails(uid: string, accessToken: string) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CREDENTI-ACCESS-TOKEN': accessToken
            }
        }
        
        return fetch(backend_url + "/account/" + accountId + "/users/" + uid, requestOptions)
        .then(response => response.json());
    }
}
