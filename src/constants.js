// constants
export const date_format = "YYYY-MM-DD";
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
        'reader_name'
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
        'active_session',
        'windows_login_hint'

    ]
};

// Field in activity logs are displayed in this order with the below names
export const logFieldNames = {
    uid: "Uid",
    machine: {
        "uid": "Machine ID",
        "machine_id": "Machine ID",
        "machine_name": "Machine name",
        "mac_address": "MAC",
        "serial_number": "Serial number",
        "domain": "Domain",
        "public_ip": "Public Ip",
        "local_ip": "Last Known Ip",
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
        "event_display_message": "Event display Message",
        "event_outcome": "Event outcome",
        "session_id": "Session ID",
        "state_token": "State token",
        "auth_profile_id": "Auth profile ID",
        "machine_type": "Machine type",
        "user_agent": "User agent",
        "created_ts": "Created timestamp",
        "updated_ts": "Updated timestamp"
    },
    user: {
        "uid": "User ID",
        "user_id": "User ID",
        "first_name": "Firstname",
        "last_name": "Lastname",
        "user_name": "Username",
        "email": "Email",
        "sam": "samAccount Name",
        "upn": "UPN",
        "idp_user_id": "Idp user ID",
        "account_id": "Account ID",
        "is_shipping_contact": "Is shipping contact",
        "last_invite_accepted": "Last invite accepted",
        "sourced_by": "Sourced by",
        "last_portal_login": "Last portal login",
        "status": "Status",
        "display_name": "Display name",
        "login_domain": "Login domain",
        "login_user_name": "Login username",
        "is_technical_contact": "Is technical contact",
        "is_billing_contact": "Is billing contact",
        "last_invite_sent": "Last invite sent",
        "eula_accepted_date": "Eula accepted date",
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
    "machine_name": logFieldNames.machine.machine_name,
    "serial_number": logFieldNames.machine.serial_number,
    "public_machine_ip": logFieldNames.machine.public_ip,
    "mechanism_name": logFieldNames.activity.mechanism_name,
    "display_name": logFieldNames.activity.display_name
};


export const machineFieldNames = {
    "account_id": "Account ID",
    "os": "OS",
    "local_ip": "Last known Ip",
    "mac_address": "Mac address",
    "uid": "Uid",
    "group_type": "Group type",
    "domain": "Domain",
    "reader_type": "Reader type",
    "serial_number": "Serial number",
    "x_client": "X Client",
    "public_ip": "Public Ip",
    "reader_name": "Reader name",
    "reader_serial": "Reader serial",
    "products": "Products",
    "machine_name": "Machine name"
}

export const settingsFieldNames = {
    uid: "Account ID",
    name: "Company Name",
    portal_oidc_client_id: "Client ID",
    issuer_url: "Issuer"
}

// Literal Constants
export const start_date = "start_date";
export const start_time = "start_time";
export const end_date = "end_date";
export const end_time = "end_time";

// Product names
export const TecTANGO = "TecTANGO";

// Policy types
export const PIN = "PIN";
export const PASSWORD = "PASSWORD";
export const KIOSK = "KIOSK";
export const CARD_ENROLL = "CARD_ENROLL";