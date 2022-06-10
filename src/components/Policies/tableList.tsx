import { Button, Modal, Table } from "antd";
import { useState } from "react";

import CardEnrollmentPolicy from "./CardEnrollmentPolicy";
import { KioskPolicy } from "./kioskPolicy";
import { PasswordPolicy } from "./passwordPolicy";
import { PinPolicy } from "./pinPolicy";
import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { CARD_ENROLL, KIOSK, PASSWORD, PIN, policyDisplayNames } from "../../constants";

function TableList({ handleGetPolicies, policy_type, activateColumns, activePolicies, draggableContainer, draggableBodyRow, deActivateColumns, inActivePolicies }) {
    const [isModal, setIsModal] = useState(false);
    const pinData = {
        description: '',
        name: '',
        order: 0,
        policy_type: PIN,
        auth_policy_groups: [],
        policy_req: {
            expires_in_x_days: 1,
            is_special_char_req: false,
            pin_history_period: 0,
            min_length: 4,
            is_upper_case_req: false,
            is_lower_case_req: false,
            is_non_consecutive_char_req: false,
            max_length: 4,
            is_pin_history_req: false,
            is_num_req: true
        }
    }

    const passwordData = {
        description: '',
        name: '',
        order: 0,
        auth_policy_groups: [],
        policy_type: PASSWORD,
        policy_req: {
            grace_period: ''
        }
    }

    const kioskData = {
        policy_req: {
            access_key_id: "",
            assay: "",
            confirm_assay: "",
            id_as_machine_name: false,
            login_type: ""
        },
        auth_policy_groups: [],
        policy_type: KIOSK,
        kiosk_machine_groups: [],
        name: "",
        description: "",
    }

    const cardEnrollData = {
        description: "",
        name: "",
        policy_req: {
            max_card_enrollment: 1
        },
        kiosk_machine_groups: [],
        policy_type: CARD_ENROLL,
        auth_policy_groups: [],
    }

    const handleOk = (policyType: string, object: object) => {
        ApiService.post(ApiUrls.addPolicy, object)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    openNotification('success', `Successfully added ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
                    setIsModal(false);
                    handleGetPolicies();
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', `An Error has occured with adding ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
            })
    }

    const handleCancel = () => {
        setIsModal(false);
    }

    return (
        <>
            <div style={{
                width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none',
                padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
            }}
            >
                <Button type='primary' size='large' onClick={() => {
                    setIsModal(true);
                }}
                >
                    Add {policyDisplayNames[policy_type]} Policy
                </Button>
            </div>

            <div style={{
                fontWeight: 600, fontSize: 'x-large',
                width: '100%', border: '1px solid #D7D7DC',
                borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
            }}
            >
                ACTIVE
            </div>

            <Table
                style={{ border: '1px solid #D7D7DC' }}
                showHeader={true}
                columns={activateColumns}
                dataSource={activePolicies}
                rowKey={"index"}
                components={{
                    body: {
                        wrapper: draggableContainer,
                        row: draggableBodyRow,
                    },
                }}
                pagination={false}
            />

            <br />

            <div style={{
                fontWeight: 600, fontSize: 'x-large',
                width: '100%', border: '1px solid #D7D7DC',
                borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
            }}
            >
                INACTIVE
            </div>

            <Table
                style={{ border: '1px solid #D7D7DC' }}
                showHeader={true}
                columns={deActivateColumns}
                dataSource={inActivePolicies}
                pagination={false}
            />

            <Modal visible={isModal} footer={false} centered width={900} maskClosable={true}
                title={<div style={{ fontSize: '30px' }}>Add {policyDisplayNames[policy_type]} Policy </div>}
            >
                {policy_type === PIN ?
                    <PinPolicy pinDetails={pinData} handleOk={handleOk} handleCancel={handleCancel} /> :
                    policy_type === PASSWORD ?
                        <PasswordPolicy passwordDetails={passwordData} handleOk={handleOk} handleCancel={handleCancel} /> :
                        policy_type === KIOSK ?
                            <KioskPolicy kioskDetails={kioskData} handleOk={handleOk} handleCancel={handleCancel} /> :
                            <CardEnrollmentPolicy policyDetails={cardEnrollData} handleOk={handleOk} handleCancel={handleCancel} />
                }
            </Modal>
        </>
    )
}

export default TableList;
