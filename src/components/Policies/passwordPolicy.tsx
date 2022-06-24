import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css'

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { openNotification } from "../Layout/Notification";

export const PasswordPolicy = (props: any) => {
    const [isEdit, setIsEdit] = useState(false);
    const [passwordDisplayData, setPasswordDisplayData] = useState({});
    const [passwordEditData, setPasswordEditedData]: any = useState();
    const [policyRequirements, setPolicyRequirements] = useState({});
    const [loading, setLoading] = useState(true);
    const [graceOptions, setGraceOptions]: any = useState({});
    const [groups, setGroups]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const history = useHistory();

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.policy(window.location.pathname.split('/')[5])),
            ApiService.get(ApiUrls.groups, { type: "USER" }),
            ApiService.get(ApiUrls.mechanismPasswordGraceOptions)
        ]))
            .then((data) => {
                //@ts-ignore
                if (!data[0].errorSummary) {
                    setPasswordDisplayData(data[0]);
                    setPasswordEditedData(data[0]);
                    setPolicyRequirements(data[0]['policy_req']);

                    Object.keys(data[0]['auth_policy_groups']).map(index => {
                        groupNames.push(data[0]['auth_policy_groups'][index].name);
                        groupUids.push(data[0]['auth_policy_groups'][index].uid)
                        console.log(groupNames);
                        console.log(groupUids);
                    });
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setPasswordDisplayData(props.passwordDetails);
                    setPasswordEditedData(props.passwordDetails);
                    setPolicyRequirements(props.passwordDetails.policy_req);
                    setIsEdit(true);
                }
                else {
                    console.log('else: ', data[0]);
                    openNotification('error', data[0].errorCauses.length !== 0 ? data[0].errorCauses[0].errorSummary : data[0].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/password`);
                }

                console.log('GROUPS: ', data[1]);
                for (var i = 0; i < data[1].length; i++) {
                    groups.push({
                        label: data[1][i].name,
                        value: data[1][i].uid
                    })
                }
                setGroups(groups)
                var object = {};
                for (var i = 0; i < data[1].length; i++) {
                    object[data[1][i].name] = data[1][i].uid
                }
                groupsChange.push(object);
                setGroupsChange(groupsChange);
                console.log(groups);
                console.log(data[2]);
                setGraceOptions(data[2].password_grace_options);
                setLoading(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting details');
            })
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
    }

    function createPasswordPolicy() {
        props.handleOk("PASSWORD", passwordEditData);
    }

    function setCancelClick() {
        props.handleCancel("PASSWORD");
    }

    function updatePasswordPolicy() {
        passwordEditData.auth_policy_groups = groupUids;
        ApiService.put(ApiUrls.policy(passwordDisplayData['uid']), passwordEditData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    setPasswordDisplayData({ ...passwordEditData });
                    openNotification('success', 'Successfully updated Password Policy');
                    Object.keys(data.auth_policy_groups).map(index => {
                        groupNames.push(data.auth_policy_groups[index].name);
                    });
                    setGroupNames(groupNames);
                    setIsEdit(false);
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with updating Password Policy');
            })
    }

    function handleGroups(value: any) {
        Object.keys(groupsChange[0]).map(key => {
            if (value.includes(key)) {
                var index = value.indexOf(key)
                value.splice(index, 1)
                value.push(groupsChange[0][key]);
            }
        })
        groupUids.length = 0;
        setGroupUids(value);
        passwordEditData.auth_policy_groups = value;
        console.log(passwordEditData.auth_policy_groups);
    }

    return <Skeleton loading={loading}>
        <div className={passwordDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
            <div className="row-policy-container">
                <div>
                    {passwordDisplayData['uid'] === undefined ? <></> :
                        <div className="content-heading">Edit Password Policy</div>
                    }
                </div>
                <div>
                    {passwordDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                        {!isEdit ? 'Edit' : 'Cancel'}
                    </Button> : <></>
                    }
                </div>

                <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                    Policy Name:
                </div>
                <div style={{ paddingTop: '20px' }}>
                    {isEdit ? <Input className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setPasswordEditedData({
                            ...passwordEditData,
                            name: e.target.value
                        })}
                        defaultValue={passwordDisplayData['name']}
                        placeholder='Enter a new policy name'
                    /> : passwordDisplayData['name']
                    }
                </div>

                <div className="content-policy-key-header">
                    Description:
                </div>
                <div>
                    {isEdit ? <TextArea className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setPasswordEditedData({
                            ...passwordEditData,
                            description: e.target.value
                        })}
                        defaultValue={passwordDisplayData['description']}
                        placeholder='Enter policy description'
                    /> : passwordDisplayData['description']
                    }
                </div>

                <div className="content-policy-key-header">
                    Assigned to groups:
                </div>
                <div>
                    {isEdit ?
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder={<div>Please select groups</div>}
                            defaultValue={passwordDisplayData['name'] !== "" ? groupNames : []}
                            onChange={handleGroups}
                            style={{ width: '275px' }}
                            options={groups}
                        /> : Object.keys(groupNames).map(name =>
                            <div style={{ display: 'inline-block', marginRight: '3px', paddingBottom: '3px' }}>
                                <Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>
                            </div>
                        )
                    }
                </div>

                <div className="content-policy-key-header">
                    Policy Type:
                </div>
                <div>
                    {passwordDisplayData['policy_type']}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-policy-container">
                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    Grace Period:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    <Radio.Group defaultValue={policyRequirements['grace_period']}
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

            <br />

            <div style={{ display: 'grid', gridTemplateColumns: '6% 85%' }}>
                <div className="content-policy-key-header" style={{ marginTop: '-3px' }}>
                    Help:
                </div>
                <div>
                    Grace Period is the amount of time the user can tap in and out until they are required to re-enter their password after tapping badge.
                </div>
            </div>
        </div>

        {passwordDisplayData['uid'] !== undefined ?
            (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                <Button style={{ float: 'right', marginLeft: '10px' }}
                    onClick={handleCancelClick}>Cancel</Button>
                <Button type='primary' style={{ float: 'right' }}
                    onClick={handleSaveClick}>Save</Button>
            </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                <Button style={{ float: 'right', marginLeft: '10px' }}
                    onClick={setCancelClick}>Cancel</Button>
                <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                    onClick={createPasswordPolicy}>Create</Button></div>
        }
    </Skeleton>
}
