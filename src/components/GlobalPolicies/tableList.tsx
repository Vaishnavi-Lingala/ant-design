import { useState } from "react";
import { Button, Modal, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { CARD_ENROLL, globalPolicyReqFields, KIOSK, LOCAL_USER_PROVISIONING, PASSWORD, PIN, policyDisplayNames, policyInfoModel, requiredFieldsErrorMsg, vdiPolicyInfoModel, vdiPolicyReqFields, VIRTUAL_DESKTOP_INTERFACE } from "../../constants";
import UserProvisioningPolicy from "./UserProvisioningPolicy";
import VDIPolicy from "./VirtualDesktopInterface";

function TableList({ handleGetPolicies, policy_type, policy_description, activateColumns, activePolicies, draggableContainer, draggableBodyRow, deActivateColumns, inActivePolicies }) {
    const [isModal, setIsModal] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const vdiData = {
        name: "",
        description: "",
        groupType: "",
        auth_policy_groups: [],
        policy_type: VIRTUAL_DESKTOP_INTERFACE,
        kiosk_machine_groups: [],
        policy_req: {
            vdi_type: "",
            template: "",
            // machine_group_type: ""
        }
    }

    const userProvisioningData = {
        name: "",
        description: "",
        auth_policy_groups: [],
        kiosk_machine_groups: [],
        policy_type: LOCAL_USER_PROVISIONING,
        policy_req: {
            local_profile_format: "EMAIL_PREFIX",
            local_profile_user_type: "STANDARD",
            password_sync: true
        }
    }

    const handleOk = (policyType: string, object: object) => {
        setButtonLoading(true);
        ApiService.post(ApiUrls.addGlobalPolicy(localStorage.getItem('accountId')), object)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    openNotification('success', `Successfully created ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
                    setIsModal(false);
                    setButtonLoading(false);
                    handleGetPolicies();
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    setButtonLoading(false);
                }
            }, error => {
                console.error('Error: ', error);
                setButtonLoading(false);
                openNotification('error', `An Error has occured with creating ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
            })
    }

    const handleCancel = () => {
        setIsModal(false);
    }

    return (
        <>
            <div style={{
                width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none',
                padding: '10px 10px 10px 25px', backgroundColor: '#d9d9d9'
            }}
            >
                {policy_description}
            </div>
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

            <Modal visible={isModal} closeIcon={<Button icon={<CloseOutlined />}></Button>} footer={false} centered width={900} maskClosable={false} onCancel={handleCancel}
                title={<div style={{ fontSize: '30px' }}>Add {policyDisplayNames[policy_type]} Policy </div>}
            >
                {
                    policy_type === LOCAL_USER_PROVISIONING ?
                        <UserProvisioningPolicy policyDetails={userProvisioningData} buttonLoading={buttonLoading} handleOk={handleOk} handleCancel={handleCancel} /> :
                        <VDIPolicy policyDetails={vdiData} buttonLoading={buttonLoading} handleOk={handleOk} handleCancel={handleCancel} />
                }
            </Modal>
        </>
    )
}

export default TableList;
