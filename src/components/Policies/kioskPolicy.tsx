import { Divider, Checkbox, Button, InputNumber, Input, Select, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";

import './Policies.css';

// import { AuthenticationPolicy } from "../../models/Data.models";
import { kioskPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import TextArea from "antd/lib/input/TextArea";

import { openNotification } from "../Layout/Notification";

export const KioskPolicy = (props: any) => {

    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [kioskDisplayData, setKioskDisplayData] = useState<kioskPolicyType>(props.kioskDetails);
    const [kioskEditData, setKioskEditedData] = useState(props.kioskDetails);
    const [groups, setGroups]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [kioskGroups, setKioskGroups]: any = useState([]);
    const [kioskGroupsChange, setkioskGroupsChange]: any = useState([]);
    const [kioskGroupNames, setKioskGroupNames]: any = useState([]);
    const [kioskGroupUids, setKioskGroupUids]: any = useState([]);

    useEffect(() => {
        if (kioskDisplayData.uid === undefined) {
            setIsEdit(true);
        }

        ApiService.get(ApiUrls.groups, { type: "USER" })
            .then(data => {
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
                setGroups(groups);
                groupsChange.push(object);
                console.log(groups);
                setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoadingDetails(false);
            })

        ApiService.get(ApiUrls.groups, { type: "KIOSK" })
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    kioskGroups.push({
                        label: data[i].name,
                        value: data[i].uid
                    })
                }
                var object = {};
                for (var i = 0; i < data.length; i++) {
                    object[data[i].name] = data[i].uid
                }
                kioskGroupsChange.push(object);
                console.log(kioskGroups);
                setLoading(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
            })

        if (kioskDisplayData.uid !== undefined) {
            Object.keys(kioskDisplayData.auth_policy_groups).map(data => {
                groupNames.push(kioskDisplayData.auth_policy_groups[data].name);
                groupUids.push(kioskDisplayData.auth_policy_groups[data].uid)
                console.log(groupNames);
                console.log(groupUids);
            });

            Object.keys(kioskDisplayData.kiosk_machine_groups).map(data => {
                kioskGroupNames.push(kioskDisplayData.kiosk_machine_groups[data].name);
                kioskGroupUids.push(kioskDisplayData.kiosk_machine_groups[data].uid)
                console.log(kioskGroupNames);
                console.log(kioskGroupUids);
            });
        }
        kioskEditData.auth_policy_groups = groupUids;
        kioskEditData.kiosk_machine_groups = kioskGroupUids;
    }, [])

    function updateKioskPolicy() {
        ApiService.put(ApiUrls.policy(kioskDisplayData.uid), kioskEditData)
            .then(data => {
                console.log(data);
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    kioskGroupNames.length = 0;
                    setKioskDisplayData({ ...kioskEditData });
                    openNotification('success', 'Successfully updated Kiosk Policy');
                    Object.keys(data.auth_policy_groups).map(index => {
                        groupNames.push(data.auth_policy_groups[index].name);
                    });
                    Object.keys(data.kiosk_machine_groups).map(index => {
                        kioskGroupNames.push(data.kiosk_machine_groups[index].name);
                    });
                    console.log(kioskGroupNames);
                    setGroupNames(groupNames);
                    setKioskGroupNames(kioskGroupNames);
                    setIsEdit(false);
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with updating Kiosk Policy');
            })
    }

    function handleEditClick() {
        setIsEdit(!isEdit);
        setKioskEditedData({ ...kioskDisplayData });
    }

    function handleCancelClick() {
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateKioskPolicy();
        // setIsEdit(false);
    }

    function createkioskPolicy() {
        props.handleOk("KIOSK", kioskEditData);
    }

    function setCancelClick() {
        props.handleCancel("KIOSK");
    }

    function handleMachineGroups(value: any) {
        Object.keys(kioskGroupsChange[0]).map(key => {
            if (value.includes(key)) {
                console.log(key)
                var index = value.indexOf(key)
                console.log(index)
                value.splice(index, 1)
                value.push(kioskGroupsChange[0][key]);
            }
        })
        kioskEditData.kiosk_machine_groups = value;
        console.log(kioskEditData.kiosk_machine_groups);
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
        kioskEditData.auth_policy_groups = value;
        console.log(kioskEditData.auth_policy_groups);
    }

    return (
        <Skeleton loading={loading || loadingDetails}>
            <div className={kioskDisplayData.uid === undefined ? "content-container" : "content-container-policy"}>
                <div className="row-policy-container">
                    <div>
						{kioskDisplayData.uid === undefined ? <></> :
                            <div className="content-heading">Edit kiosk Policy</div>
                        }
                    </div>
                    <div>
                        {kioskDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                            onChange={(e) => setKioskEditedData({
                                ...kioskEditData,
                                name: e.target.value
                            })}
                            defaultValue={kioskDisplayData.name}
                            placeholder='Enter a new policy name'
                        /> : kioskDisplayData.name
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Description:
                    </div>
                    <div>
                        {isEdit ? <TextArea className="form-control"
                            style={{ width: "275px" }}
                            onChange={(e) => setKioskEditedData({
                                ...kioskEditData,
                                description: e.target.value
                            })}
                            defaultValue={kioskDisplayData.description}
                            placeholder='Enter policy description'
                        /> : kioskDisplayData.description
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Assigned to user groups:
                    </div>
                    <div>
                        {isEdit ? <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="Please select groups"
                            defaultValue={kioskDisplayData.name !== "" ? groupNames : []}
                            onChange={handleGroups}
                            // disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={groups}
                        /> : Object.keys(groupNames).map(name =>
                            <div style={{ display: 'inline-block', marginRight: '3px', paddingBottom: '3px' }}>
                                <Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>
                            </div>
                        )}
                    </div>

                    <div className="content-policy-key-header">
                        Assigned to kiosk machine:
                    </div>
                    <div>
                        {isEdit ? <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="Please select groups"
                            defaultValue={kioskDisplayData.name !== "" ? kioskGroupNames : []}
                            onChange={handleMachineGroups}
                            // disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={kioskGroups}
                            listHeight={120}
                        /> : Object.keys(kioskGroupNames).map(name =>
                            <><Button style={{ cursor: 'text' }}>{kioskGroupNames[name]}</Button>&nbsp;</>)
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Policy Type:
                    </div>
                    <div>
                        {kioskDisplayData.policy_type}
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <p className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>Kiosk Settings:</p>

                <div className="row-policy-container">
                    <div>
                        Username
                    </div>
                    <div>
                        {
                            isEdit ? <Input className="form-control"
                                style={{ width: "275px" }}
                                onChange={(e) => kioskEditData.policy_req.access_key_id = e.target.value}
                                defaultValue={kioskDisplayData.policy_req.access_key_id}
                                placeholder='Enter username'
                            /> : kioskDisplayData.policy_req.access_key_id
                        }
                    </div>
                    <div>
                        Password
                    </div>
                    <div>
                        {
                            isEdit ? <Input.Password className="form-control"
                                style={{ width: "275px" }}
                                onChange={(e) => kioskEditData.policy_req.assay = e.target.value}
                                defaultValue={kioskDisplayData.policy_req.assay}
                                placeholder='Enter password'
                            /> : kioskDisplayData.policy_req.assay
                        }
                    </div>
                    {
                        isEdit ?
                            <>
                                <div>
                                    Confirm password
                                </div>
                                <div>
                                    {
                                        isEdit ? <Input.Password className="form-control"
                                            style={{ width: "275px" }}
                                            onChange={(e) => kioskEditData.policy_req.confirm_assay = e.target.value}
                                            defaultValue={kioskDisplayData.policy_req.confirm_assay}
                                            placeholder='Enter confirm password'
                                        /> : kioskDisplayData.policy_req.confirm_assay
                                    }
                                </div>
                            </> : <></>
                    }
                </div>
            </div>
            {kioskDisplayData.uid !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={createkioskPolicy}>Create</Button></div>
            }
        </Skeleton>
    );
}
