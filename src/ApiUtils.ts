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

    // Users Urls
    userGroups: (uid) => `account/${accountId}/users/${uid}/groups`,
    users: `account/${accountId}/users`,

    // Groups Urls
    group: (uid) => `account/${accountId}/groups/${uid}`,
    groups: `account/${accountId}/groups`,
    groupUsers: (uid) => `account/${accountId}/groups/${uid}/users` ,
    usersNotInGroup: (uid) => `account/${accountId}/groups/${uid}/users-not-in-group`,

    // Policy Urls
    policies: `account/${accountId}/product/oprc735871d0/auth-policies`,
    policy: (uid) => `account/${accountId}/auth-policies/${uid}`, // For GET and UPDATE APIs
    addPolicy: `account/${accountId}/product/oprc735871d0/auth-policies`, // For CREATE API

    // Mechanism Urls
    mechanisms: `account/${accountId}/mechanism`,
    addMechanism: `account/${accountId}/mechanism`,
    mechanism: (uid) => `account/${accountId}/mechanism/${uid}`, // For GET and UPDATE APIs
    mechanismOptions: `account/${accountId}/mechanism/options`,
    mechanismChallengeFactors: `account/${accountId}/mechanism/challenge-factor-options?product_id=oprc735871d0`,
    mechanismPasswordGraceOptions: `account/${accountId}/mechanism/password-grace-options`,
    activateMechanism: (uid) => `account/${accountId}/product/oprc735871d0/mechanism/${uid}/activate`,
    inActivateMechanism: (uid) => `account/${accountId}/product/oprc735871d0/mechanism/${uid}/inactivate`,
    reOrderMechanisms: `account/${accountId}/product/oprc735871d0/mechanism/reorder`,

    // Activity Log Urls
    activityLog: `account/${accountId}/activitylog`,
    filterableFields: `/activitylog/filterable-fields`
}

export default Urls;