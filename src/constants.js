// constants
export const date_format = "YYYY-MM-DD";
export const date_display_format = " Do MMM YYYY";
export const time_format = "HH:mm:ss";
export const ts_format = `${date_format} ${time_format}`;

export const hiddenFields = {
    activity: [
        'user_agent',
        'auth_profile_id',
        'updated_ts',
        'product_id',
        'machine_id',
        'created_ts',
        'machine_type',
        'display_name'
    ],
    machine: [
        'account_id',
        'x_client',
        'reader_serial',
        'uid',
        'machine_type'
    ],
    user: [
        'account_id',
        'is_shipping_contact',
        'last_invite_accepted',
        'sourced_by',
        'last_portal_login',
        'status',
        'login_domain',
        'login_user_name',
        'is_technical_contact',
        'is_billing_contact',
        'last_invite_sent',
        'eula_accepted_date',
        'is_portal_admin',
        'idp_login_hint',
        'windows_login_hint',
        'uid',
        'display_name'

    ]
};

export const userFieldNames = {
    "status": "Status",
    "uid": "User ID",
    "first_name": "First name",
    "last_name": "Last name",
    "display_name": "Display name",
    "idp_user_name": "User name",
    "email": "Email",
    "sam": "SAM Account Name",
    "upn": "UPN",
    "idp_user_id": "IDP user ID",
    "account_id": "Account ID",
    "sourced_by": "Sourced by",
    "login_domain": "Login domain"
}

export const editableFields = ['first_name', 'last_name', 'display_name', 'sam', 'upn', 'login_domain']

export const readerDisplayNames = {
    "PCSCREADER": "PC/SC",
    "PCPROXREADER": "rf IDEAS"
}

// Field in activity logs are displayed in this order with the below names
export const logFieldNames = {
    uid: "UID",
    machine: {
        "uid": "Machine ID",
        "machine_id": "Machine ID",
        "machine_name": "Machine name",
        "machine_type": "Machine type",
        "mac_address": "MAC",
        "serial_number": "Serial number",
        "domain": "Domain",
        "public_ip": "Public IP",
        "local_ip": "Last Known IP",
        "group_type": "Group type",
        "reader_type": "Reader type",
        "os": "OS",
        "x_client": "X client",
        "reader_serial": "Reader serial",
        "account_id": "Account ID",
        "reader_name": "Reader name"
    },
    activity: {
        "account_id": "Account ID",
        "product_id": "Product ID",
        "product_name": "Product name",
        "api_end_point": "API end point",
        "mechanism_id": "Mechanism ID",
        "mechanism_name": "Mechanism name",
        "display_name": "Actor",
        "event_context": "Event context",
        "event_display_message": "Event display message",
        "event_outcome": "Event outcome",
        "auth_profile_id": "Auth profile ID",
        "machine_type": "Machine type",
        "user_agent": "User agent",
        "created_ts": "Created timestamp",
        "updated_ts": "Updated timestamp",
        "failure_reason": "Failure reason",
        "instrument_id": "Instrument ID",
        "instrument_type": "Instrument type"
    },
    user: {
        "uid": "User ID",
        "user_id": "User ID",
        "first_name": "First name",
        "last_name": "Last name",
        "display_name": "Display name",
        "idp_user_name": "User name",
        "email": "Email",
        "sam": "sAMAccount Name",
        "upn": "UPN",
        "idp_user_id": "IDP user ID",
        "account_id": "Account ID",
        "is_shipping_contact": "Is shipping contact",
        "last_invite_accepted": "Last invite accepted",
        "sourced_by": "Sourced by",
        "last_portal_login": "Last portal login",
        "status": "Status",
        "login_domain": "Login domain",
        "login_user_name": "Login username",
        "is_technical_contact": "Is technical contact",
        "is_billing_contact": "Is billing contact",
        "last_invite_sent": "Last invite sent",
        "eula_accepted_date": "Eula accepted date",
        "state_token": "State token",
        "active_session": "Session ID",
        "is_portal_admin": "Is portal admin"
    }
}

export const filterableFieldNames = {
    "user_id": logFieldNames.user.uid,
    "mechanism_id": logFieldNames.activity.mechanism_id,
    "idp_user_id": logFieldNames.user.idp_user_id,
    "product_name": logFieldNames.activity.product_name,
    "api_end_point": logFieldNames.activity.api_end_point,
    "auth_profile_id": logFieldNames.activity.auth_profile_id,
    "serial_number": logFieldNames.machine.serial_number,
    "public_machine_ip": logFieldNames.machine.public_ip,
    "public_ip": logFieldNames.machine.public_ip,
    "email": logFieldNames.user.email,
    "display_name": logFieldNames.activity.display_name,
    "machine_name": logFieldNames.machine.machine_name,
    "machine_type": logFieldNames.machine.machine_type,
    "local_ip": logFieldNames.machine.local_ip,
    "mechanism_name": logFieldNames.activity.mechanism_name,
};


export const machineFieldNames = {
    account_id: "Account ID",
    os: "OS",
    local_ip: "Last known IP",
    mac_address: "MAC",
    uid: "UID",
    group_type: "Group type",
    domain: "Domain",
    reader_type: "Reader type",
    // serial_number: "Serial number",
    x_client: "X Client",
    public_ip: "Public IP",
    reader_name: "Reader name",
    // reader_serial: "Reader serial",
    products: "Products",
    product_version: 'Product version',
    machine_name: "Machine name",
    cert_details: {
        thumbprint: "Thumbprint",
        serial_number: "Serial Number",
        san: "SAN",
        valid_from: "Valid from",
        valid_to: "Valid to",
        expiry: "Expiry days"
    },
}

export const settingsFieldNames = {
    uid: "Account ID",
    name: "Company Name",
    address_1: "Address 1",
    address_2: "Address 2",
    city: "City",
    state: "State",
    zip: "Zip code",
    country: "Country"
}

export const settingsIdpFields = {
    idp_type: "IDP",
    tenant_type: "Tenant type",
    issuer_url: "Tenant URL",
    idp_portal_oidc_client_id: "Portal OIDC Client ID",
    idp_app_oidc_client_id: "App OIDC Client ID"
}

export const settingsLDAPFields = {
    ldap_host: "LDAP Host",
    ldap_port: "LDAP Port",
    base_dn: "Base DN",
    user_base_dn: "User Base DN",
    username_format: "Username Format"
}

export const tapOutFields = {
    LOCK: "Lock",
    SIGN_OUT: "Sign-out",
    SIGN_OUT_ALL: "Sign-out all users",
}


export const accountBillingContact = {
    billing_contact_name: 'Name',
    billing_contact_email: 'Email'
}

export const accountTechnicalContact = {
    technical_contact_name: 'Name',
    technical_contact_email: 'Email'
}

export const userFilterFieldNames = {
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    user_name: "User Name",
    idp_user_name: "Username",
    status: "Status",
    is_enrolled: "Enrolled",
    inactivity_in_days: "Inactivity in Days"
}

export const machineFilterFieldNames = {
    machine_name: "Machine name",
    last_known_ip: "Last known IP",
    type: "Machine type"
}

export const DeviceFilterFieldNames = {
    vendor: "Vendor",
    device_name: "Device Name",
    device_type: "Device Type",
    serial_number: "Serial Number",
    blocked: "Blocked"
}

export const vendorOptions = {
    "HID": "Hid",
    "RFIDEAS": "Rfideas",
    "RFIDINC": "Rfidinc"
}

export const deviceTypeOptions = {
    "BIOMETRIC": "Biometric",
    "RFIDEAS": "Rfideas",
    "RFIDPCSC": "RFID Reader (pc/sc)",
    "YUBIKEY": "Yubikey"
}

export const groupFilterFieldNames = {
    name: "Name"
}

export const settingsTokenNames = {
    admin_token: "Admin Token",
    install_token: "Install Token",
    uninstall_token: "Uninstall Token"
}

// Literal Constants
export const start_date = "start_date";
export const start_time = "start_time";
export const end_date = "end_date";
export const end_time = "end_time";

// Product names
export const TecTango = "TecTango";
export const TecBio = "TecBio";
export const TecUnify = "TecUnify";

// Product keys
export const TecTANGO = "TecTANGO";
export const TecBIO = "TecBIO";
export const TecUNIFY = "TecUNIFY";

export const productNames = {
    [TecTANGO]: TecTango,
    [TecBIO]: TecBio,
    [TecUNIFY]: TecUnify
}

// Sidebar item names
export const Dashboard = "Dashboard";
export const Users = "Users";
export const Groups = "Groups";
export const Machines = "Machines";
export const Mechanisms = "Mechanisms";
export const Policies = "Policies";
export const ActivityLogs = "Activity Logs";
export const Devices = "Devices";
export const Account = "Account";
export const Domain = "Domains";
export const GlobalPolicies = "Global Policies";
export const Applications = "Applications";

// Sidebar item keys
export const dashboard = "dashboard";
export const users = "users";
export const groups = "groups";
export const machines = "machines";
export const devices = "devices";
export const mechanisms = "mechanism";
export const policies = "policies";
export const activityLogs = "activitylogs";
export const account = "account";
export const domain = "domains";
export const globalPolicies = "global-policies";
export const applications = "apps";

// Policy types
export const PIN = "PIN";
export const PASSWORD = "PASSWORD";
export const KIOSK = "KIOSK";
export const CARD_ENROLL = "CARD_ENROLL";
export const LOCAL_USER_PROVISIONING = "LOCAL_USER_PROVISIONING";
export const VIRTUAL_DESKTOP_INTERFACE = "VDI";
export const BIO = "BIO";
export const PRIVACY = "PRIVACY";

//Local User Provisioning Policy
export const userProfileDisplayNames = {
    "STANDARD": "Provision Standard User",
    "ADMINISTRATOR": "Provision Local Administrator"
}

// Header Options
export const Directory = "Directory";
export const Products = "Products";
export const Settings = "Settings";

export const MenuItemPaths = {
    [Directory]: "/dashboard",
    [Settings]: "/account",
    [TecTANGO]: "/mechanism",
    [TecBIO]: "/mechanism",
    [TecUNIFY]: "/mechanism"
}

export const policyDisplayNames = {
    [PIN]: "Pin",
    [PASSWORD]: "Password",
    [KIOSK]: "Kiosk",
    [CARD_ENROLL]: "Card Enrollment",
    [LOCAL_USER_PROVISIONING]: "Local User Provisioning",
    [VIRTUAL_DESKTOP_INTERFACE]: "VDI",
    [BIO]: "Bio",
    [PRIVACY]: "Privacy Shield"
}

// LocalStorage constants
export const SELECTED_HEADER = 'SELECTED_HEADER';

//Policies Descriptions
export const PinPolicyDescription = 'PIN policies enable admins to enforce pin complexities at the user group level and is enforced during enrollment or PIN recovery';
export const PasswordPolicyDescription = 'Password policies enable admins to control grace period which is the amount of time the user can tap in and out until they are required to re-enter their password';
export const KioskPolicyDescription = 'KIOSK policies applies to machines where TecTANGO will auto-login with the generic machine user to enable fast user swicthing on a shared or kiosk machines used by multiple users. This policy is applied only when Option 3 is selected in the TecTANGO Installer';
export const CardEnrollmentPolicyDescription = 'Card enrollment policies enable admins to configure max number of cards allowed per user group during enrollment';
export const LocalUserProvisioningPolicyDescription = 'Local user provisioning policies enable admins to automatically create local user profile on the machines. This is applicable only for Standard and Kiosk machines.';
export const VDI_Description = 'VDI policies enable admins to configure the VDI Template for Citrix, VMware, or Microsoft which TecTANGO will use to connect to remote desktops hosted on a virtual machine server.';
export const BioDescription = 'Biometric policies enable admins to configure min and max fingers enrollmnent allowed per user group';

//Mechanism Descriptions
export const TECTANGO_LOCK_DESCRIPTION = 'Lock the machine or sign-out from the apps launched by TecTANGO.';
export const TECTANGO_SIGN_OUT_DESCRIPTION = 'Sign-out the current user from the machine.';
export const TECTANGO_SIGN_OUT_ALL_DESCRIPTION = 'Sign-out all the users on the machine. Select this option to allow only 1 active session on the machine. This helps to  avoid issues arising due to limited  resource availability such as RAM & CPU by logging off the other sessions before initiating a new session.';
export const TECBIO_LOCK_DESCRIPTION = 'Lock the machine or sign-out from the apps launched by TecBIO.';
export const TECBIO_SIGN_OUT_DESCRIPTION = 'Sign-out the current user from the machine.';
export const TECBIO_SIGN_OUT_ALL_DESCRIPTION = 'Sign-out all the users on the machine. Select this option to allow only 1 active session on the machine. This helps to  avoid issues arising due to limited  resource availability such as RAM & CPU by logging off the other sessions before initiating a new session.';

export const userRequiredFields = ['login_domain', 'first_name', 'last_name', 'idp_user_name', 'email', 'sam', 'upn'];
export const userDataModel = {
    login_domain: 'Login Domain',
    first_name: 'First Name',
    last_name: 'Last Name',
    idp_user_name: 'Username',
    email: 'Email',
    sam: 'SAM',
    upn: 'UPN'
}
export const requiredFieldsErrorMsg = `Please fill required attributes`;

export const deactivateConfirmMsg = 'Deactivating a user will remove all enrollments associated with the user. This action cannot be reversed. Do you want to proceed?'

//Defaults colors

export const DEFAULT_TEXT_COLOR = '#000000';
export const DEFAULT_BACKGROUND_COLOR = 'FFFFFF';
export const globalPolicyReqFields = [{field: 'name', dataType: 'string'}, {field: 'auth_policy_groups', dataType: 'array'}];

export const policyInfoModel = {
    name: 'Policy Name',
    auth_policy_groups: 'Group Name'
}

export const vdiPolicyReqFields = [{field: 'name', dataType: 'string'}, {field: 'groupType', dataType: 'string'}, {field: 'kiosk_machine_groups', dataType: 'array'}, {field: 'vdi_type', dataType: 'string', objectName: 'policy_req'}, {field: 'template', dataType: 'string', objectName: 'policy_req'}];

export const vdiPolicyInfoModel = {
    name: 'Policy Name',
    groupType: 'Group Type',
    kiosk_machine_groups: 'Group Name',
    vdi_type: 'VDI Type',
    template: 'Template'
}
