import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { PasswordPolicyType } from "../../models/Data.models";

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

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

    useEffect(() => {
        ApiService.get(ApiUrls.groups)
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
            })

        ApiService.get(ApiUrls.mechanismPasswordGraceOptions)
            .then(data => {
                console.log(data);
                setGraceOptions(data.password_grace_options);
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
        ApiService.put(ApiUrls.addPolicy, passwordEditData)
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
        ApiService.post(ApiUrls.policy(passwordDisplayData.uid), passwordEditData)
            .then(data => {
                setPasswordDisplayData({ ...passwordEditData });
            })
            .catch(error => {
                console.log(error);
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
                    {passwordDisplayData.uid === undefined ? <h3>Create Password Policy</h3> :
                        <h3>Edit Password Policy</h3>
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
