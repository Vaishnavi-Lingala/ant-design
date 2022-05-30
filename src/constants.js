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

export const logFieldNames = {
    uid: "Uid",
    machine: {
        "os": "OS",
        "x_client": "X client",
        "reader_serial": "Reader serial",
        "account_id": "Account ID",
        "domain": "Domain",
        "group_type": "Group type",
        "public_ip": "Public Ip",
        "serial_number": "Serial number",
        "reader_type": "Reader type",
        "local_ip": "Last Known Ip",
        "machine_name": "Machine name",
        "mac_address": "MAC",
        "reader_name": "Reader name",
        "uid": "Machine ID",
        "machine_id": "Machine ID"
    },
    activity: {
        "account_id": "Account ID",
        "product_name": "Product name",
        "mechanism_id": "Mechanism ID",
        "mechanism_name": "Mechanism name",
        "display_name": "Display name",
        "product_id": "Product ID",
        "api_end_point": "API end point",
        "user_agent": "User agent",
        "event_context": "Event context",
        "event_display_message": "Event display Message",
        "event_outcome": "Event outcome",
        "session_id": "Session ID",
        "state_token": "State token",
        "auth_profile_id": "Auth profile ID",
        "machine_type": "Machine type",
        "created_ts": "Created timestamp",
        "updated_ts": "Updated timestamp"
    },
    user: {
        "account_id": "Account ID",
        "is_shipping_contact": "Is shipping contact",
        "user_name": "Username",
        "upn": "UPN",
        "last_invite_accepted": "Last invite accepted",
        "first_name": "Firstname",
        "email": "Email",
        "sourced_by": "Sourced by",
        "last_portal_login": "Last portal login",
        "status": "Status",
        "display_name": "Display name",
        "last_name": "Lastname",
        "login_domain": "Login domain",
        "login_user_name": "Login username",
        "is_technical_contact": "Is technical contact",
        "uid": "User ID",
        "user_id": "User ID",
        "is_billing_contact": "Is billing contact",
        "last_invite_sent": "Last invite sent",
        "eula_accepted_date": "Eula accepted date",
        "is_portal_admin": "Is portal admin",
        "sam": "samAccount Name",
        "idp_user_id": "Idp user ID"
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