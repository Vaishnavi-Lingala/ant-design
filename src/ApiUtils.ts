export const accountId = localStorage.getItem('accountId');

export const base_url = 'https://credenti-portal-api.credenti.xyz';

export function getAccessToken() {
    const okta_token_storage = localStorage.getItem("okta-token-storage");
    return JSON.parse(okta_token_storage ? okta_token_storage : '{}')?.accessToken?.accessToken;
}

export function getCredentiTokenHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-CREDENTI-ACCESS-TOKEN': getAccessToken()
    }
}

const Urls = {
    client_info: `client/info`,

    // Policy Urls
    policies: `account/${accountId}/product/oprc735871d0/auth-policies`,
    policy: (uid) => `account/${accountId}/auth-policies/${uid}`, // For GET and UPDATE APIs
    addPolicy: `account/${accountId}/product/oprc735871d0/auth-policies`, // For CREATE API

    // Mechanism Urls
    mechanisms: `account/${accountId}/mechanism`,
    mechanism: (uid) => `account/${accountId}/mechanism/${uid}`, // For GET and UPDATE APIs
    mechanismOptions: `mechanism/options`,

    // Activity Log Urls
    activityLog: `account/${accountId}/activitylog`
}

export default Urls;