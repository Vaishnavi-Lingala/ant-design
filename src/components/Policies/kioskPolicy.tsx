import { Divider, Checkbox, Button, InputNumber, Input, Select, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";

import './Policies.css';

// import { AuthenticationPolicy } from "../../models/Data.models";
import { kioskPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import TextArea from "antd/lib/input/TextArea";

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export const KioskPolicy = (props: any) => {

    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
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
    const [toastList, setToastList] = useContext(StoreContext);

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
            }, error => {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with getting Groups');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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

                const response = showToast('error', 'An Error has occured with getting Groups');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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
                setKioskDisplayData({ ...kioskEditData });

                const response = showToast('success', 'Successfully updated Kiosk Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
            .catch(error => {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with updating Kiosk Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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
        setIsEdit(false);
    }

    function createkioskPolicy() {
        console.log(kioskEditData)
        ApiService.post(ApiUrls.addPolicy, kioskEditData)
            .then(data => {
                console.log(data);

                const response = showToast('success', 'Successfully added Kiosk Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            }, error => {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with adding Kiosk Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    }

    function setCancelClick() {
        window.location.reload();
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
        <Skeleton loading={loading}>
            <div className="content-container-policy">
                <div className="row-container">
                    <div>
                        {kioskDisplayData.uid === undefined ? <h3>Create kiosk Policy</h3> :
                            <h3>Edit kiosk Policy</h3>
                        }
                    </div>
                    <div>
                        {kioskDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                            onChange={(e) => setKioskEditedData({
                                ...kioskEditData,
                                name: e.target.value
                            })}
                            defaultValue={kioskDisplayData.name}
                            placeholder='Enter a new policy name'
                        /> : kioskDisplayData.name
                        }
                    </div>

                    <div>
                        <h6>Description</h6>
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

                    <div>
                        <h6>Assigned to user groups</h6>
                    </div>
                    <div>
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="Please select groups"
                            defaultValue={kioskDisplayData.name !== "" ? groupNames : []}
                            onChange={handleGroups}
                            disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={groups}
                            listHeight={120}
                        />
                    </div>

                    <div>
                        <h6>Assigned to kiosk machine</h6>
                    </div>
                    <div>
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="Please select groups"
                            defaultValue={kioskDisplayData.name !== "" ? kioskGroupNames : []}
                            onChange={handleMachineGroups}
                            disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={kioskGroups}
                            listHeight={120}
                        />
                    </div>

                    <div>
                        <h6>Policy Type</h6>
                    </div>
                    <div>
                        {kioskDisplayData.policy_type}
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <h6 style={{ padding: '10px 0 10px 0' }}>Kiosk Settings:</h6>

                <div className="row-container">
                    <div>
                        Kiosk username
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
                        Kiosk password
                    </div>
                    <div>
                        {
                            isEdit ? <Input className="form-control"
                                style={{ width: "275px" }}
                                onChange={(e) => kioskEditData.policy_req.assay = e.target.value}
                                defaultValue={kioskDisplayData.policy_req.assay}
                                placeholder='Enter password'
                            /> : kioskDisplayData.policy_req.assay
                        }
                    </div>
                </div>
            </div>
            {kioskDisplayData.uid !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={createkioskPolicy}>Create</Button></div>
            }
        </Skeleton>
    );
}
