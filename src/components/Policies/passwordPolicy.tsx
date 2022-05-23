import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css'

import { PasswordPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export const PasswordPolicy = (props: any) => {
    const [isEdit, setIsEdit] = useState(false);
    const [passwordDisplayData, setPasswordDisplayData] = useState<PasswordPolicyType>(props.passwordDetails);
    const [passwordEditData, setPasswordEditedData] = useState(props.passwordDetails);
    const [loading, setLoading] = useState(true);
    const [graceOptions, setGraceOptions]: any = useState({});
    const [groups, setGroups]: any = useState([]);
    const { Option } = Select;
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [toastList, setToastList] = useContext(StoreContext);

    useEffect(() => {
        ApiService.get(ApiUrls.groups, { type: "USER" })
            .then(data => {
                console.log('GROUPS: ', data);
                for (var i = 0; i < data.length; i++) {
                    groups.push({
                        label: data[i].name,
                        value: data[i].uid
                    })
                }
                var object = {};
                for (var i = 0; i < data.length; i++) {
                    object[data[i].name] = data[i].uid
                }
                groupsChange.push(object);
                console.log(groups);
                setLoading(false);
            }, error => {
                console.error('Error: ', error);
                const response = showToast('error', 'An Error has occured with getting Groups');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })

        ApiService.get(ApiUrls.mechanismPasswordGraceOptions)
            .then(data => {
                console.log(data);
                setGraceOptions(data.password_grace_options);
            }, error => {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with getting Password Grace Options');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })

        if (passwordDisplayData.uid === undefined) {
            setIsEdit(true);
        }

        if (passwordDisplayData.uid !== undefined) {
            Object.keys(passwordDisplayData.auth_policy_groups).map(data => {
                groupNames.push(passwordDisplayData.auth_policy_groups[data].name);
                groupUids.push(passwordDisplayData.auth_policy_groups[data].uid)
                console.log(groupNames);
                console.log(groupUids);
            });
        }
        passwordEditData.auth_policy_groups = groupUids;
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
        ApiService.post(ApiUrls.addPolicy, passwordEditData)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    const response = showToast('success', 'Successfully added Password Policy');
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
                else {
                    const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
            }, error => {
                console.error('Error: ', error);
                const response = showToast('error', 'An Error has occured with adding Password Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }

    function setCancelClick() {
        window.location.reload();
    }

    function updatePasswordPolicy() {
        ApiService.put(ApiUrls.policy(passwordDisplayData.uid), passwordEditData)
            .then(data => {
                if (!data.errorSummary) {
                    setPasswordDisplayData({ ...passwordEditData });
                    const response = showToast('success', 'Successfully updated Password Policy');
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
                else {
                    const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                const response = showToast('error', 'An Error has occured with updating Password Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }

    function handleGroups(value: any) {
        Object.keys(groupsChange[0]).map(key => {
            if (value.includes(key)) {
                console.log(key)
                var index = value.indexOf(key)
                console.log(index)
                value.splice(index, 1)
                value.push(groupsChange[0][key]);
            }
        })
        passwordEditData.auth_policy_groups = value;
        console.log(passwordEditData.auth_policy_groups);
    }

    return <Skeleton loading={loading}>
        <div className="content-container-policy">
            <div className="row-container">
                <div>
                    {passwordDisplayData.uid === undefined ? <div className="content-heading">Create Password Policy</div> :
                        <div className="content-heading">Edit Password Policy</div>
                    }
                </div>
                <div>
                    {passwordDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                        defaultValue={passwordDisplayData.name}
                        placeholder='Enter a new policy name'
                    /> : passwordDisplayData.name
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
                        defaultValue={passwordDisplayData.description}
                        placeholder='Enter policy description'
                    /> : passwordDisplayData.description
                    }
                </div>

                <div className="content-policy-key-header">
                    Assigned to groups:
                </div>
                <div>
                    <Select
                        mode="multiple"
                        size={"large"}
                        placeholder={<div>Please select groups</div>}
                        defaultValue={passwordDisplayData.name !== "" ? groupNames : []}
                        onChange={handleGroups}
                        disabled={!isEdit}
                        style={{ width: '275px' }}
                        options={groups}
                    />
                </div>

                <div className="content-policy-key-header">
                    Policy Type:
                </div>
                <div>
                    {passwordDisplayData.policy_type}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-container">
                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    Grace Period:
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
            <br />
            <div style={{ display: 'grid', gridTemplateColumns: '6% 85%' }}>
                <div className="content-policy-key-header" style={{ marginTop: '-5px' }}>
                    Help:
                </div>
                <div>
                    Grace Period is the amount of time the user can tap in and out until they are required to re-enter their password after tapping badge.
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
