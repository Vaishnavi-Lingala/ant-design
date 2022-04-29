import { Button, Divider, Radio, Space } from "antd";
import { useState } from "react";
import { PasswordPolicyType } from "../../models/Data.models";

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

export const PasswordPolicy = (props: any) => {
    const [isEdit, setIsEdit] = useState(false);
    const [passwordDisplayData, setPasswordDisplayData] = useState<PasswordPolicyType>(props.passwordDetails);
    const [passwordEditData, setPasswordEditedData] = useState(props.passwordDetails);
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;

    function handleEditClick() {
        setIsEdit(!isEdit);
        setPasswordDisplayData({ ...passwordDisplayData });
    }

    function handleCancelClick() {
        setIsEdit(false);
    }

    function handleSaveClick() {
        updatePasswordPolicy();
        setIsEdit(false);
    }

    const showPolicyHeader = <>
        <div className="policy-header">
            {passwordDisplayData.name} policy
            <Button style={{ float: 'right' }} onClick={handleEditClick}>
                {!isEdit ? 'Edit' : 'Cancel'}
            </Button>
        </div>

        <div className="row-container">
            <div>Description</div>
            <div>{passwordDisplayData.description}</div>
            <div>Assigned to groups</div>
            <div>
                {/* {displayData.groups} */}
                Everyone
            </div>
        </div>
    </>

    function updatePasswordPolicy() {
		ApiService.post(ApiUrls.policy(passwordDisplayData.uid), passwordEditData)
			.then(data => {
				console.log(data);
				setPasswordDisplayData({ ...passwordEditData });
			})
			.catch(error => {
				console.log(error);
			})
    }

    return <>
        <div className="content-container-policy">
            {showPolicyHeader}

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-container">
                <div>
                    <h6 style={{ padding: '10px 0 10px 0' }}>
                        Grace Period:
                    </h6>
                </div>
                <div style={{ padding: '10px 0 10px 0' }}>
                    <Radio.Group defaultValue={passwordDisplayData.policy_req.grace_period}
                        disabled={!isEdit}
                        onChange={(e) => passwordEditData.policy_req.grace_period = e.target.value}
                    >
                        <Space direction="vertical">
                            <Radio value={"TWO_HOURS"}>2 hours</Radio>
                            <Radio value={"FOUR_HOURS"}>4 hours</Radio>
                            <Radio value={"SIX_HOURS"}>6 hours</Radio>
                            <Radio value={"EIGHT_HOURS"}>8 hours</Radio>
                            <Radio value={"TWELVE_HOURS"}>12 hours</Radio>
                            <Radio value={"ALWAYS_PROMPT"}>Always prompt</Radio>
                            <Radio value={"DO_NOT_PROMPT"}>Do not prompt</Radio>
                        </Space>
                    </Radio.Group>
                </div>
            </div>
        </div>
        {
            isEdit ? <div style={{ paddingTop: '10px' }}>
                <Button style={{ float: 'right', marginLeft: '10px' }}
                    onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button type='primary' style={{ float: 'right' }}
                    onClick={handleSaveClick}>
                    Save
                </Button>
            </div> : <></>
        }
    </>
}
