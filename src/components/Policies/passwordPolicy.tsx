import { Button, Divider, Input, Radio, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { PasswordPolicyType } from "../../models/Data.models";

import Apis from "../../Api.service";

export const PasswordPolicy = (props: any) => {
    const [isEdit, setIsEdit] = useState(false);
    const [passwordDisplayData, setPasswordDisplayData] = useState<PasswordPolicyType>(props.passwordDetails);
    const [passwordEditData, setPasswordEditedData] = useState(props.passwordDetails);
    const [loading, setLoading] = useState(true);
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [graceOptions, setGraceOptions]: any = useState({});

    useEffect(() => {
        Apis.getMechanismOptions(accessToken)
            .then(data => {
                console.log(data);
                setGraceOptions(data.password_grace_options);
                setLoading(false)
            })
        if (passwordDisplayData.uid === undefined) {
            setIsEdit(true);
        }
    }, [])

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

    function createPasswordPolicy() {
        Apis.createPolicyDetails(passwordEditData, accessToken)
            .then(data => {
                console.log(data);
            })
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    }

    function setCancelClick() {
        window.location.reload();
    }

    function updatePasswordPolicy() {
        Apis.updatePolicyDetails(passwordDisplayData.uid, passwordEditData, accessToken)
            .then(data => {
                console.log(data);
                setPasswordDisplayData({ ...passwordEditData });
            })
            .catch(error => {
                console.log(error);
            })
    }

    return <Skeleton loading={loading}>
        <div className="content-container-policy">
            <div className="row-container">
                <div>
                    {passwordDisplayData.uid === undefined ? <h5>Create Password Policy</h5> :
                        <h5>Edit Password Policy</h5>
                    }
                </div>
                <div>
                    {passwordDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                        {!isEdit ? 'Edit' : 'Cancel'}
                    </Button> : <></>
                    }
                </div>
                <div style={{ paddingTop: '20px' }}>
                    <h6>Policy Name</h6>
                </div>
                <div style={{ paddingTop: '20px' }}>
                    {isEdit ? <Input className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setPasswordEditedData({
                            ...passwordEditData,
                            name: e.target.value
                        })}
                        defaultValue={passwordDisplayData.name}
                        placeholder='Enter a new policy name'
                    /> : passwordDisplayData.name
                    }
                </div>

                <div>
                    <h6>Description</h6>
                </div>
                <div>
                    {isEdit ? <Input className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setPasswordEditedData({
                            ...passwordEditData,
                            description: e.target.value
                        })}
                        defaultValue={passwordDisplayData.description}
                        placeholder='Enter policy description'
                    /> : passwordDisplayData.description
                    }
                </div>

                <div>
                    <h6>Assigned to groups</h6>
                </div>
                <div>
                    {/* {displayData.groups} */}
                    Everyone
                </div>

                <div>
                    <h6>Policy Type</h6>
                </div>
                <div>
                    {passwordDisplayData.policy_type}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-container">
                <div style={{ padding: '10px 0 10px 0' }}>
                    <h6>Grace Period</h6>
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    <Radio.Group defaultValue={passwordDisplayData.policy_req.grace_period}
                        disabled={!isEdit}
                        onChange={(e) => passwordEditData.policy_req.grace_period = e.target.value}
                    >
                        {
                            Object.keys(graceOptions).map(factor => {
                                return <div key={factor}>
                                    <Radio value={factor}>
                                        {graceOptions[factor]}
                                    </Radio>
                                    <br />
                                </div>
                            })
                        }
                    </Radio.Group>
                </div>
            </div>
        </div>
        {passwordDisplayData.uid !== undefined ?
            (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                <Button style={{ float: 'right', marginLeft: '10px' }}
                    onClick={handleCancelClick}>Cancel</Button>
                <Button type='primary' style={{ float: 'right' }}
                    onClick={handleSaveClick}>Save</Button>
            </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                <Button style={{ float: 'right', marginLeft: '10px' }}
                    onClick={setCancelClick}>Cancel</Button>
                <Button type='primary' style={{ float: 'right' }}
                    onClick={createPasswordPolicy}>create</Button></div>
        }
    </Skeleton>
}
