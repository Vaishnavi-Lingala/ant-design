export const accountId = localStorage.getItem('accountId');

export const base_url = process.env.REACT_APP_API_URL

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
    products: `account/${accountId}/product`,
    stats:`account/${accountId}/stats`,
    domains: `account/${accountId}/domains`,
    info: `account/${accountId}/info`,

    //Device Urls
    devices: `account/${accountId}/devices`,
    device: (uid) => `account/${accountId}/devices/${uid}`,
    addDevice: `account/${accountId}/devices`,
    deviceOptions: `account/${accountId}/devices/options`,
    deviceFilterableFields: `account/${accountId}/devices/filterable-fields`,
    deviceFilter: `account/${accountId}/devices/filter`,

    //Machine Urls
    machines: `account/${accountId}/machines`,
    machineDetails: (uid) =>  `account/${accountId}/machines/${uid}`,
    machineFilterableFields: `account/${accountId}/machines/filterable-fields`,
    machineFilter: `account/${accountId}/machines/filter`,

    // Users Urls
    userGroups: (uid) => `account/${accountId}/users/${uid}/groups`,
    users: `account/${accountId}/users`,
    userInfo: (uid) => `account/${accountId}/users/${uid}`,
    changeUserStatus: (uid) =>  `account/${accountId}/users/${uid}/lifecycle`,
    lifeCycleOptions: `account/${accountId}/users/lifecycle/options`,
    enrollments: (uid) => `account/${accountId}/users/${uid}/enrollments`,
    userFilterableFields: `account/${accountId}/users/filterable-fields`,
    userFilter: `account/${accountId}/users/filter`,
    changeEnrollmentStatus: (uid, enrollmentId) =>  `account/${accountId}/users/${uid}/enrollments/${enrollmentId}`,
    getEnrollmentStatusOptions: `account/${accountId}/users/card-status-options`,

    // Groups Urls
    group: (uid) => `account/${accountId}/groups/${uid}`,
    groups: `account/${accountId}/groups`,
    groupUsers: (uid) => `account/${accountId}/groups/${uid}/users` ,
    usersNotInGroup: (uid) => `account/${accountId}/groups/${uid}/users-not-in-group`,
    groupMachines: (uid) => `account/${accountId}/group/${uid}/machines` ,
    machinesNotInGroup: (uid) => `account/${accountId}/group/${uid}/machines-not-in-group`,
    groupFilterableFields: `account/${accountId}/groups/filterable-fields`,
    groupFilter: `account/${accountId}/groups/filter`,

    // Policy Urls
    policies: (productId) => `account/${accountId}/product/${productId}/auth-policies`,
    policy: (uid) => `account/${accountId}/auth-policies/${uid}`, // For GET and UPDATE APIs
    addPolicy: (productId) => `account/${accountId}/product/${productId}/auth-policies`, // For CREATE API
    activatePolicy: (uid, productId) => `account/${accountId}/product/${productId}/auth-policy/${uid}/activate`,
    deActivatePolicy: (uid, productId) => `account/${accountId}/product/${productId}/auth-policy/${uid}/inactivate`,
    reOrderPolicies: (productId) => `account/${accountId}/product/${productId}/auth-policy/reorder`,
    loginTypeOptions: `account/${accountId}/auth-policy/login-type`,

    // Mechanism Urls
    mechanisms: (productId) => `account/${accountId}/product/${productId}/mechanism`,
    addMechanism: (productId) => `account/${accountId}/product/${productId}/mechanism`,
    mechanism: (uid, productId) => `account/${accountId}/product/${productId}/mechanism/${uid}`, // For GET and UPDATE APIs
    mechanismOptions: `account/${accountId}/mechanism/options`,
    mechanismChallengeFactors: (productId) => `account/${accountId}/mechanism/challenge-factor-options?product_id=${productId}`,
    mechanismPasswordGraceOptions: `account/${accountId}/mechanism/password-grace-options`,
    activateMechanism: (uid, productId) => `account/${accountId}/product/${productId}/mechanism/${uid}/activate`,
    deActivateMechanism: (uid, productId) => `account/${accountId}/product/${productId}/mechanism/${uid}/inactivate`,
    reOrderMechanisms: (productId) => `account/${accountId}/product/${productId}/mechanism/reorder`,

    // Activity Log Urls
    activityLog: (productId) => `account/${accountId}/product/${productId}/activitylog`,
    filterableFields: `account/${accountId}/activitylog/filterable-fields`,

    // Licenses
    licences: `account/${accountId}/license`
}

export default Urls;
