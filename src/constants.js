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
        'account_id',
        'created_ts'
    ],
    machine: [
        ""
    ],
    user: [
        ""
    ]
};

export const logFieldNames = {
    uid: "Uid",
    machine: {
        "os": "OS",
        "x_client": "X client",
        "reader_serial": "Reader serial",
        "account_id": "Account Id",
        "domain": "Domain",
        "group_type": "Group type",
        "public_ip": "Public Ip",
        "serial_number": "Serial number",
        "reader_type": "Reader type",
        "local_ip": "Local Ip",
        "machine_name": "Machine name",
        "mac_address": "Mac adress",
        "reader_name": "Reader name",
        "uid": "Machine Id",
        "machine_id": "Machine Id"
    },
    activity: {
        "account_id": "Account Id",
        "mechanism_id": "Mechanism Id",
        "mechanism_name": "Mechanism name",
        "display_name": "Display name",
        "product_name": "Product name",
        "product_id": "Product Id",
        "api_end_point": "Api end point",
        "user_agent": "User agent",
        "event_context": "Event context",
        "event_display_message": "Event display Message",
        "event_outcome": "Event outcome",
        "session_id": "Session Id",
        "state_token": "State token",
        "auth_profile_id": "Auth profile Id",
        "machine_type": "Machine type",
        "created_ts": "Created timestamp",
        "updated_ts": "Updated timestamp"
    },
    user: {
        "account_id": "Account Id",
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
        "uid": "User Id",
        "user_id": "User Id",
        "is_billing_contact": "Is billing contact",
        "last_invite_sent": "Last invite sent",
        "eula_accepted_date": "Eula accepted date",
        "is_portal_admin": "Is portal admin",
        "sam": "Sam",
        "idp_user_id": "Idp user Id"
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
    "account_id": "Account Id",
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