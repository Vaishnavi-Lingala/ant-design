export const accountId = localStorage.getItem('accountId');
// export const productId = "opr296b1a0dc"
export const productId = "oprc735871d0"

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

    // Users Urls
    userGroups: (uid) => `account/${accountId}/users/${uid}/groups`,
    users: `account/${accountId}/users`,

    // Groups Urls
    group: (uid) => `account/${accountId}/groups/${uid}`,
    groups: `account/${accountId}/groups`,
    groupUsers: (uid) => `account/${accountId}/groups/${uid}/users` ,

    // Policy Urls
    policies: `account/${accountId}/product/${productId}/auth-policies`,
    policy: (uid) => `account/${accountId}/auth-policies/${uid}`, // For GET and UPDATE APIs
    addPolicy: `account/${accountId}/product/${productId}/auth-policies`, // For CREATE API
    activatePolicy: (uid) => `/account/${accountId}/product/${productId}/auth-policy/${uid}/activate`,
    deActivatePolicy: (uid) => `/account/${accountId}/product/${productId}/auth-policy/${uid}/inactivate`,
    reOrderPolicies: `/account/${accountId}/product/${productId}/auth-policy/reorder`,

    // Mechanism Urls
    mechanisms: `account/${accountId}/mechanism`,
    addMechanism: `account/${accountId}/mechanism`,
    mechanism: (uid) => `account/${accountId}/mechanism/${uid}`, // For GET and UPDATE APIs
    mechanismOptions: `account/${accountId}/mechanism/options`,
    mechanismChallengeFactors: `account/${accountId}/mechanism/challenge-factor-options?product_id=${productId}`,
    mechanismPasswordGraceOptions: `account/${accountId}/mechanism/password-grace-options`,
    activateMechanism: (uid) => `account/${accountId}/product/${productId}/mechanism/${uid}/activate`,
    deActivateMechanism: (uid) => `account/${accountId}/product/${productId}/mechanism/${uid}/inactivate`,
    reOrderMechanisms: `account/${accountId}/product/${productId}/mechanism/reorder`,

    // Activity Log Urls
    activityLog: `account/${accountId}/activitylog`,
    filterableFields: `/activitylog/filterable-fields`
}

export default Urls;