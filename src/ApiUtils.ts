export const accountId = localStorage.getItem('accountId');
// export const productId = "opr296b1a0dc"
// export const productId = "oprc735871d0"
export const productId = localStorage.getItem("productId");
console.log(productId);

export const base_url = 'https://api.credenti.xyz/admin';

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
    getProducts: `account/${accountId}/product`,
    stats:`account/${accountId}/stats`,

    //Machine Urls
    machines: `account/${accountId}/product/${productId}/machines`,
    machineDetails: (uid) =>  `account/${accountId}/machines/${uid}`,

    // Users Urls
    userGroups: (uid) => `account/${accountId}/users/${uid}/groups`,
    users: `account/${accountId}/users`,
    changeUserStatus: (uid) =>  `account/${accountId}/users/${uid}/lifecycle`,
    lifeCycleOptions: `account/${accountId}/users/lifecycle/options`,

    // Groups Urls
    group: (uid) => `account/${accountId}/groups/${uid}`,
    groups: `account/${accountId}/groups`,
    groupUsers: (uid) => `account/${accountId}/groups/${uid}/users` ,
    usersNotInGroup: (uid) => `account/${accountId}/groups/${uid}/users-not-in-group`,
    groupMachines: (uid) => `account/${accountId}/group/${uid}/machines` ,
    machinesNotInGroup: (uid) => `account/${accountId}/group/${uid}/machines-not-in-group`,

    // Policy Urls
    policies: `account/${accountId}/product/${productId}/auth-policies`,
    policy: (uid) => `account/${accountId}/auth-policies/${uid}`, // For GET and UPDATE APIs
    addPolicy: `account/${accountId}/product/${productId}/auth-policies`, // For CREATE API
    activatePolicy: (uid) => `account/${accountId}/product/${productId}/auth-policy/${uid}/activate`,
    deActivatePolicy: (uid) => `account/${accountId}/product/${productId}/auth-policy/${uid}/inactivate`,
    reOrderPolicies: `account/${accountId}/product/${productId}/auth-policy/reorder`,

    // Mechanism Urls
    mechanisms: `account/${accountId}/product/${productId}/mechanism`,
    addMechanism: `account/${accountId}/product/${productId}/mechanism`,
    mechanism: (uid) => `account/${accountId}/product/${productId}/mechanism/${uid}`, // For GET and UPDATE APIs
    mechanismOptions: `account/${accountId}/mechanism/options`,
    mechanismChallengeFactors: `account/${accountId}/mechanism/challenge-factor-options?product_id=${productId}`,
    mechanismPasswordGraceOptions: `account/${accountId}/mechanism/password-grace-options`,
    activateMechanism: (uid) => `account/${accountId}/product/${productId}/mechanism/${uid}/activate`,
    deActivateMechanism: (uid) => `account/${accountId}/product/${productId}/mechanism/${uid}/inactivate`,
    reOrderMechanisms: `account/${accountId}/product/${productId}/mechanism/reorder`,

    // Activity Log Urls
    activityLog: `account/${accountId}/product/${productId}/activitylog`,
    filterableFields: `activitylog/filterable-fields`,

    // Licenses
    licences: `account/${accountId}/license`
}

export default Urls;