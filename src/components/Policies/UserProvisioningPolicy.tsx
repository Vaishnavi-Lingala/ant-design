import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import TextArea from "antd/lib/input/TextArea";
import { LOCAL_USER_PROVISIONING, policyDisplayNames } from "../../constants";

function UserProvisioningPolicy(props: any) {
    const [loading, setLoading] = useState(true);
    const [userProvisioningDisplayData, setUserProvisioningDisplayData] = useState({});
    const [userProvisioningEditData, setUserProvisioningEditedData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [userTypeOptions, setUserTypeOptions] = useState({});
    const [userFormatOptions, setUserFormatOptions] = useState({});
    const history = useHistory();
	const accountId = localStorage.getItem('accountId');

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
            ApiService.get(ApiUrls.profileUserFormatOptions(accountId)),
            ApiService.get(ApiUrls.profileUserTypesOptions(accountId)),
            ApiService.get(ApiUrls.policy(accountId, window.location.pathname.split('/')[5]))
        ]))
            .then(data => {
                console.log('GROUPS: ', data[0]);
                for (var i = 0; i < data[0].length; i++) {
                    groups.push({
                        label: data[0][i].name,
                        value: data[0][i].uid
                    })
                }
                setGroups(groups);
                var object = {};
                for (var i = 0; i < data[0].length; i++) {
                    object[data[0][i].name] = data[0][i].uid
                }
                groupsChange.push(object);
                setGroupsChange(groupsChange);

                console.log(data[1]);
                setUserFormatOptions(data[1]);

                console.log(data[2]);
                setUserTypeOptions(data[2])

                console.log(data[3]);
                if (!data[3].errorSummary) {
                    setUserProvisioningEditedData(data[3]);
                    setUserProvisioningDisplayData(data[3]);
                    if (data[3].uid !== undefined) {
                        Object.keys(data[3].auth_policy_groups).map(index => {
                            groupNames.push(data[3].auth_policy_groups[index].name);
                            groupUids.push(data[3].auth_policy_groups[index].uid)
                            setGroupUids(groupUids);
                            setGroupNames(groupNames)
                            console.log(groupUids);
                            console.log(groupNames);
                        });
                    }
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setUserProvisioningDisplayData(props.policyDetails);
                    setUserProvisioningEditedData(props.policyDetails);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[3]);
                    openNotification('error', data[3].errorCauses.length !== 0 ? data[3].errorCauses[3].errorSummary : data[3].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/local-user-provisioning`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoading(false);
            })
    }, [])

    function handleEditClick() {
        setIsEdit(!isEdit);
        setUserProvisioningEditedData({ ...userProvisioningDisplayData });
    }

    function handleCancelClick() {
        setUserProvisioningEditedData({ ...userProvisioningEditData });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateUserProvisioningPolicy();
    }

    function createUserProvisioningPolicy() {
        props.handleOk("LOCAL_USER_PROVISIONING", userProvisioningEditData);
    }

    function setCancelClick() {
        props.handleCancel("LOCAL_USER_PROVISIONING");
    }

    function updateUserProvisioningPolicy() {
        userProvisioningEditData.auth_policy_groups = groupUids;
        ApiService.put(ApiUrls.policy(accountId, userProvisioningDisplayData['uid']), userProvisioningEditData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    setUserProvisioningDisplayData({ ...userProvisioningEditData });
                    openNotification('success', 'Successfully updated Local User Provisioning Policy');
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
                openNotification('error', 'An Error has occured with updating Local User Provisioning Policy');
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
        userProvisioningEditData.auth_policy_groups = value;
        console.log(userProvisioningEditData.auth_policy_groups);
    }

    return <Skeleton loading={loading}>
        <div className={userProvisioningDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
            <div className="row-policy-container">
                <div>
                </div>
                <div>
                    {userProvisioningDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                        onChange={(e) => setUserProvisioningEditedData({
                            ...userProvisioningEditData,
                            name: e.target.value
                        })}
                        defaultValue={userProvisioningDisplayData['name']}
                        placeholder='Enter a new policy name'
                    /> : userProvisioningDisplayData['name']
                    }
                </div>

                <div className="content-policy-key-header">
                    Description:
                </div>
                <div>
                    {isEdit ? <TextArea className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setUserProvisioningEditedData({
                            ...userProvisioningEditData,
                            description: e.target.value
                        })}
                        defaultValue={userProvisioningDisplayData['description']}
                        placeholder='Enter policy description'
                    /> : userProvisioningDisplayData['description']
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
                            defaultValue={userProvisioningDisplayData['name'] !== "" ? groupNames : []}
                            onChange={handleGroups}
                            style={{ width: '275px' }}
                            options={groups}
                            filterOption={(input, option) =>
                                //@ts-ignore
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
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
                    {policyDisplayNames[userProvisioningDisplayData['policy_type']]}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-policy-container">
                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    Local Profile Format:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    {isEdit ?
                        <Select
                            size={"large"}
                            placeholder="Please select user profile format"
                            defaultValue={userFormatOptions[userProvisioningEditData?.policy_req?.local_profile_format]}
                            onChange={(value) => setUserProvisioningEditedData((state) => {
                                const { policy_req } = state;
                                return {
                                    ...userProvisioningEditData,
                                    policy_req: {
                                        ...policy_req,
                                        local_profile_format: value
                                    }
                                }
                            })}
                            style={{ width: '275px' }}
                        >
                            {
                                Object.keys(userFormatOptions).map(profileFormat => {
                                    return <Select.Option key={profileFormat} value={profileFormat}>
                                        {userFormatOptions[profileFormat]}
                                    </Select.Option>
                                })
                            }
                        </Select> : userFormatOptions[userProvisioningDisplayData['policy_req']?.local_profile_format]
                    }
                </div>

                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    Local Profile User Type:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    <Radio.Group value={userProvisioningEditData?.policy_req?.local_profile_user_type}
                        disabled={!isEdit}
                        onChange={(e) => setUserProvisioningEditedData((state) => {
                            const { policy_req } = state;
                            return {
                                ...userProvisioningEditData,
                                policy_req: { ...policy_req, local_profile_user_type: e.target.value }
                            }
                        })}
                    >
                        {
                            Object.keys(userTypeOptions).map(type => {
                                return <div key={type}>
                                    <Radio value={type}>
                                        {userTypeOptions[type]}
                                    </Radio>
                                    <br />
                                </div>
                            })
                        }
                    </Radio.Group>
                </div>
            </div>
        </div>

        {
            userProvisioningDisplayData['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createUserProvisioningPolicy}>Create</Button></div>
        }
    </Skeleton >
}

export default UserProvisioningPolicy;
