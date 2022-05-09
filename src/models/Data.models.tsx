export interface ClientConfiguration {
    uid: string;
    portal_oidc_client_id: string;
    issuer_url: string;
}

export interface PinPolicyType {
    description: string;
    active: boolean;
    default: boolean;
    uid: string;
    name: string,
    order: number,
    policy_type: string,
    auth_policy_groups: string[],
    policy_req: {
        expires_in_x_days: number;
        is_special_char_req: boolean;
        pin_history_period: number;
        min_length: number;
        is_upper_case_req: boolean;
        is_lower_case_req: boolean;
        is_non_consecutive_char_req: boolean;
        max_length: number;
        is_pin_history_req: boolean;
        is_num_req: boolean
    }
}

export interface PasswordPolicyType {
    name: string,
    policy_req: {
        grace_period: string
    },
    default: boolean,
    order: number,
    auth_policy_groups: string[],
    active: boolean,
    description: string,
    uid: string,
    policy_type: string
}

// export interface AuthenticationPolicy {
//     authentication: number;
//     dne: boolean;
//     expire: boolean;
//     expire_count: number;
//     expire_quantity: number;
//     expire_units: string;
//     groups: string;
//     history: boolean;
//     history_count: number;
//     l_case: boolean;
//     last_date: number;
//     last_user_id: number;
//     max_len: number;
//     min_len: number;
//     pk_policy_id: string;
//     policy_desc: string;
//     question_enroll: number;
//     question_mfa: number;
//     question_number: number;
//     sliding: boolean;
//     special: boolean;
//     sspr: boolean;
//     u_case: boolean
// }

export interface MechanismType{
    uid: string,
    on_tap_out: string,
    reader_type: string,
    order: number,
    product_id: string,
    name: string,
    mechanism_groups: string[],
    challenge_factors: [
        {
            uid: string,
            factor: string,
            order: null,
            password_grace_period: string,
            name: string
        },
        {
            uid: string,
            factor: string,
            order: null,
            password_grace_period: string,
            name: string
        }
    ],
    default: boolean
}

export interface GroupList {
    CustomerID: number;
    GroupName: string;
    UserList: string;
    isCustom: boolean;
}

export interface UserList {
    UserID: number;
    CustomerID: number;
    OktaUserId: string;
    CognitoUserId: string;
    isLocalMachineAdmin: boolean;
    NetworkUserName: string;
    IDPUserName: string;
    isPortalAdmin: boolean;
    userDomain: string;
    QEnroll: string;
    QMFA: string;
    active: boolean;
}

export interface SecurityQuestionList {
    QuestionId: number;
    isCustom: boolean;
    Question: string;
}
