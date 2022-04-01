
const backend_url = 'http://127.0.0.1:5000';
const headers = {
    'Content-Type': 'application/json'
};

export default {

    getClientConfig(domain: string) {
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "domain_name": domain
            })
        };

        return fetch(backend_url + '/api/v1/portal/client/info', requestOptions)
            .then(response => response.json());
    },

    updateClientConfig(tenantUrl: string, authServerId: string, domainName: string | null, clientId: string) {
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "cust_name": "Tecnics",
                "cust_issuer_url": tenantUrl + "/oauth2/" + authServerId,
                "last_user": 5,
                "domain_name": domainName,
                "auth_cleint_id": clientId,
                "idp_type": "okta",
                "cust_tenant_url": tenantUrl
            })
        };

        return fetch(backend_url + "/api/v1/portal/client/update", requestOptions)
            .then(response => response.json());
    },

    getPolicyDetails(customer_id: string, policy_name: string) {
        const requestOptions = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				"customer_id": customer_id,
				"policy_name": policy_name
			})
		};

		return fetch(backend_url + "/api/v1/portal/tectango/policy/info", requestOptions)
			.then(response => response.json());
    },

    updatPolicyDetails(requestBody: object) {
        const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-mock-match-request-body': 'true' },
			body: JSON.stringify({
				...requestBody
			})
		};

		return fetch("http://127.0.0.1:5000/api/v1/portal/tectango/policy/update", requestOptions)
			.then(res => res.json());
    }
}