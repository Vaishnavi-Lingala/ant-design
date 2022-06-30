export const base_url = process.env.REACT_APP_API_URL
export const unify_url = process.env.REACT_APP_UNIFY_API_URL

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
    account_info: `account/info`,
    products: (accountId) => `account/${accountId}/product`,
    stats: (accountId) => `account/${accountId}/stats`,
    domains: (accountId) => `account/${accountId}/domains`,
    info: (accountId) => `account/${accountId}/info`,

    //Device Urls
    devices: (accountId) => `account/${accountId}/devices`,
    device: (accountId, deviceId) => `account/${accountId}/devices/${deviceId}`,
    addDevice: (accountId) => `account/${accountId}/devices`,
    deviceOptions: (accountId) => `account/${accountId}/devices/options`,
    deviceFilterableFields: (accountId) => `account/${accountId}/devices/filterable-fields`,
    deviceFilter: (accountId) => `account/${accountId}/devices/filter`,

    //Machine Urls
    machines: (accountId) => `account/${accountId}/machines`,
    machineDetails: (accountId, machineId) =>  `account/${accountId}/machines/${machineId}`,
    machineFilterableFields: (accountId) => `account/${accountId}/machines/filterable-fields`,
    machineFilter: (accountId) => `account/${accountId}/machines/filter`,

    // Users Urls
    userGroups: (accountId, userId) => `account/${accountId}/users/${userId}/groups`,
    users: (accountId) => `account/${accountId}/users`,
    userInfo: (accountId, userId) => `account/${accountId}/users/${userId}`,
    changeUserStatus: (accountId, userId) =>  `account/${accountId}/users/${userId}/lifecycle`,
    lifeCycleOptions: (accountId) => `account/${accountId}/users/lifecycle/options`,
    enrollments: (accountId, userId) => `account/${accountId}/users/${userId}/enrollments`,
    userFilterableFields: (accountId) => `account/${accountId}/users/filterable-fields`,
    userFilter: (accountId) => `account/${accountId}/users/filter`,
    changeEnrollmentStatus: (accountId, userId, enrollmentId) =>  `account/${accountId}/users/${userId}/enrollments/${enrollmentId}`,
    getEnrollmentStatusOptions: (accountId) => `account/${accountId}/users/card-status-options`,

    // Groups Urls
    group: (accountId, groupId) => `account/${accountId}/groups/${groupId}`,
    groups: (accountId) => `account/${accountId}/groups`,
    groupUsers: (accountId, groupId) => `account/${accountId}/groups/${groupId}/users` ,
    usersNotInGroup: (accountId, groupId) => `account/${accountId}/groups/${groupId}/users-not-in-group`,
    groupMachines: (accountId, groupId) => `account/${accountId}/group/${groupId}/machines` ,
    machinesNotInGroup: (accountId, groupId) => `account/${accountId}/group/${groupId}/machines-not-in-group`,
    groupFilterableFields: (accountId) => `account/${accountId}/groups/filterable-fields`,
    groupFilter: (accountId) => `account/${accountId}/groups/filter`,

    // Policy Urls
    policies: (accountId, productId) => `account/${accountId}/product/${productId}/auth-policies`,
    policy: (accountId, policyId) => `account/${accountId}/auth-policies/${policyId}`, // For GET and UPDATE APIs
    addPolicy: (accountId, productId) => `account/${accountId}/product/${productId}/auth-policies`, // For CREATE API
    activatePolicy: (accountId, productId, policyId) => `account/${accountId}/product/${productId}/auth-policy/${policyId}/activate`,
    deActivatePolicy: (accountId, productId, policyId) => `account/${accountId}/product/${productId}/auth-policy/${policyId}/inactivate`,
    reOrderPolicies: (accountId, productId) => `account/${accountId}/product/${productId}/auth-policy/reorder`,
    loginTypeOptions: (accountId) => `account/${accountId}/auth-policy/login-type`,
    profileUserTypesOptions: (accountId) => `account/${accountId}/auth-policy/local-profile-user-types`,
    profileUserFormatOptions: (accountId) => `account/${accountId}/auth-policy/local-profile-format-types`,

    // Mechanism Urls
    mechanisms: (accountId, productId) => `account/${accountId}/product/${productId}/mechanism`,
    addMechanism: (accountId, productId) => `account/${accountId}/product/${productId}/mechanism`,
    mechanism: (accountId, productId, mechanismId) => `account/${accountId}/product/${productId}/mechanism/${mechanismId}`, // For GET and UPDATE APIs
    mechanismOptions: (accountId) => `account/${accountId}/mechanism/options`,
    mechanismChallengeFactors: (accountId, productId) => `account/${accountId}/mechanism/challenge-factor-options?product_id=${productId}`,
    mechanismPasswordGraceOptions: (accountId) => `account/${accountId}/mechanism/password-grace-options`,
    activateMechanism: (accountId, productId, mechanismId) => `account/${accountId}/product/${productId}/mechanism/${mechanismId}/activate`,
    deActivateMechanism: (accountId, productId, mechanismId) => `account/${accountId}/product/${productId}/mechanism/${mechanismId}/inactivate`,
    reOrderMechanisms: (accountId, productId) => `account/${accountId}/product/${productId}/mechanism/reorder`,

    // Activity Log Urls
    activityLog: (accountId, productId) => `account/${accountId}/product/${productId}/activitylog`,
    filterableFields: (accountId) => `account/${accountId}/activitylog/filterable-fields`,

    // Licenses
    licences: (accountId) => `account/${accountId}/license`,

    // app templates
    templateById: (id: number) => `app-template?id=${id}`,
    controlNameByTemplateId: (template_id: number) => `app-control-names?template_id=${template_id}`,
    appConfigById: (config_id: number) => `app-configuration?id=${config_id}`,
    xrefByAccount: (account_id: number) => `app-xref?account_id=${account_id}`,
    allAccountConfigs: (account_id: number) => `combo-account?id=${account_id}`,
    templatesByConfigId: (config_id: number) => `combo-config?id=${config_id}`
}

export default Urls;
