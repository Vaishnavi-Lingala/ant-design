export interface AuthenticationPolicy {
    authentication: number;
    dne: boolean;
    expire: boolean;
    expire_count: number;
    expire_quantity: number;
    expire_units: string;
    groups: string;
    history: boolean;
    history_count: number;
    l_case: boolean;
    last_date: number;
    last_user_id: number;
    max_len: number;
    min_len: number;
    pk_policy_id: string;
    policy_desc: string;
    question_enroll: number;
    question_mfa: number;
    question_number: number;
    sliding: boolean;
    special: boolean;
    sspr: boolean;
    u_case: boolean
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
