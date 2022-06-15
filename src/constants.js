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
        'reader_type',
        'reader_name',
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
        'uid'

    ]
};

// Field in activity logs are displayed in this order with the below names
export const logFieldNames = {
    uid: "Uid",
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
        "os": "OS",
        "x_client": "X client",
        "reader_serial": "Reader serial",
        "account_id": "Account ID",
        "reader_type": "Reader type",
        "reader_name": "Reader name"
    },
    activity: {
        "account_id": "Account ID",
        "product_id": "Product ID",
        "product_name": "Product name",
        "api_end_point": "API end point",
        "mechanism_id": "Mechanism ID",
        "mechanism_name": "Mechanism name",
        "display_name": "Display name",
        "event_context": "Event context",
        "event_display_message": "Event display message",
        "event_outcome": "Event outcome",
        "auth_profile_id": "Auth profile ID",
        "machine_type": "Machine type",
        "user_agent": "User agent",
        "created_ts": "Created timestamp",
        "updated_ts": "Updated timestamp"
    },
    user: {
        "uid": "User ID",
        "user_id": "User ID",
        "first_name": "First name",
        "last_name": "Last name",
        "display_name": "Display name",
        "user_name": "User name",
        "email": "Email",
        "sam": "samAccount Name",
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
    mac_address: "Mac address",
    uid: "Uid",
    group_type: "Group type",
    domain: "Domain",
    reader_type: "Reader type",
    serial_number: "Serial number",
    x_client: "X Client",
    public_ip: "Public IP",
    reader_name: "Reader name",
    reader_serial: "Reader serial",
    products: "Products",
    product_version: 'Product version',
    machine_name: "Machine name",
    cert_details: {
        thumbprint: "Thumbprint",
        serial_number: "Serial Number",
        san: "SAN",
        valid_from: "Valid from",
        valid_to: "Valid to",
    },
}

export const settingsFieldNames = {
    uid: "Account ID",
    name: "Company Name",
    idp_portal_oidc_client_id: "Client ID",
    issuer_url: "Issuer"
}

// Literal Constants
export const start_date = "start_date";
export const start_time = "start_time";
export const end_date = "end_date";
export const end_time = "end_time";

// Product names
export const TecTango = "TecTango";
export const TecBio = "TecBio";

// Product keys
export const TecTANGO = "TecTANGO";
export const TecBIO = "TecBIO";

export const productNames = {
    [TecTANGO]: TecTango,
    [TecBIO]: TecBio
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

// Sidebar item keys
export const dashboard = "dashboard";
export const users = "users";
export const groups = "groups";
export const machines = "machines";
export const devices = "devices";
export const mechanisms = "mechanism";
export const policies = "policies";
export const activityLogs = "activitylogs";
export const settings = "settings";

// Policy types
export const PIN = "PIN";
export const PASSWORD = "PASSWORD";
export const KIOSK = "KIOSK";
export const CARD_ENROLL = "CARD_ENROLL";

// Header Options
export const Directory = "Directory";
export const Products = "Products";
export const Settings = "Settings";

export const MenuItemPaths = {
    [Directory]: "/dashboard",
    [Settings]: "/settings",
    [TecTANGO]: "/mechanism",
    [TecBIO]: "/mechanism"
}

export const policyDisplayNames = {
    [PIN]: "Pin",
    [PASSWORD]: "Password",
    [KIOSK]: "Kiosk",
    [CARD_ENROLL]: "Card Enrollment"
}

// LocalStorage constants
export const SELECTED_HEADER = 'SELECTED_HEADER';
