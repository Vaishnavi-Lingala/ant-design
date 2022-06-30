import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Checkbox, Button, Input, Select, Skeleton, Radio } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { openNotification } from "../Layout/Notification";
import { policyDisplayNames } from "../../constants";

export const KioskPolicy = (props: any) => {

    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [kioskDisplayData, setKioskDisplayData] = useState({});
    const [kioskEditData, setKioskEditedData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [render, setRender] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginTypeOptions, setLoginTypeOptions] = useState({});
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [kioskGroups, setKioskGroups]: any = useState([]);
    const [kioskGroupsChange, setkioskGroupsChange]: any = useState([]);
    const [kioskGroupNames, setKioskGroupNames]: any = useState([]);
    const [kioskGroupUids, setKioskGroupUids]: any = useState([]);
    const [password, setPassword] = useState("");
    const history = useHistory();
    const [policyRequirements, setPolicyRequirements] = useState({});
    const accountId = localStorage.getItem('accountId');

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
            ApiService.get(ApiUrls.groups(accountId), { type: "KIOSK" }),
            ApiService.get(ApiUrls.loginTypeOptions(accountId)),
            ApiService.get(ApiUrls.policy(accountId, window.location.pathname.split('/')[5]))
        ]))
            .then(data => {
                console.log(data[0]);
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
                for (var i = 0; i < data[1].length; i++) {
                    kioskGroups.push({
                        label: data[1][i].name,
                        value: data[1][i].uid
                    })
                }
                setKioskGroups(kioskGroups);
                var object = {};
                for (var i = 0; i < data[1].length; i++) {
                    object[data[1][i].name] = data[1][i].uid
                }
                kioskGroupsChange.push(object);
                console.log(kioskGroups);
                setkioskGroupsChange(kioskGroupsChange);

                setLoginTypeOptions(data[2]);

                if (!data[3].errorSummary) {
                    console.log(data[3]);
                    setKioskDisplayData(data[3]);
                    setKioskEditedData(data[3]);
                    setPolicyRequirements(data[3].policy_req);
                    setConfirmPassword(data[3].policy_req.assay);
                    var password = ""
                    for (let i = 0; i < data[3].policy_req.assay.length; i++) {
                        password += "*";
                    }
                    setPassword(password);

                    Object.keys(data[3].auth_policy_groups).map(index => {
                        groupNames.push(data[3].auth_policy_groups[index].name);
                        groupUids.push(data[3].auth_policy_groups[index].uid)
                        console.log(groupNames);
                        setGroupNames(groupNames);
                        console.log(groupUids);
                    });

                    Object.keys(data[3].kiosk_machine_groups).map(index => {
                        kioskGroupNames.push(data[3].kiosk_machine_groups[index].name);
                        kioskGroupUids.push(data[3].kiosk_machine_groups[index].uid)
                        console.log(kioskGroupNames);
                        setKioskGroupNames(kioskGroupNames);
                        console.log(kioskGroupUids);
                    });
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setKioskDisplayData(props.kioskDetails);
                    setKioskEditedData(props.kioskDetails);
                    setPolicyRequirements(props.kioskDetails.policy_req);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[3]);
                    openNotification('error', data[3].errorCauses.length !== 0 ? data[3].errorCauses[3].errorSummary : data[3].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/kiosk`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting details');
            })
    }, [])

    function updateKioskPolicy() {
        kioskEditData.auth_policy_groups = groupUids;
        kioskEditData.kiosk_machine_groups = kioskGroupUids;
        kioskEditData.policy_req.confirm_assay = confirmPassword;
        ApiService.put(ApiUrls.policy(accountId, kioskDisplayData['uid']), kioskEditData)
            .then(data => {
                console.log(data);
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    kioskGroupNames.length = 0;
                    var password = ""
                    for (let i = 0; i < policyRequirements['assay'].length; i++) {
                        password += "*";
                    }
                    setPassword(password);
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
        setKioskEditedData({ ...kioskDisplayData });
        setConfirmPassword(kioskEditData?.policy_req?.assay)
        setIsEdit(!isEdit);
    }

    function handleCancelClick() {
        setKioskEditedData({ ...kioskDisplayData });
        setConfirmPassword(kioskEditData?.policy_req?.assay)
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateKioskPolicy();
    }

    function createkioskPolicy() {
        kioskEditData.policy_req.confirm_assay = confirmPassword;
        props.handleOk("KIOSK", kioskEditData);
    }

    function setCancelClick() {
        props.handleCancel("KIOSK");
    }

    function handleMachineGroups(value: any) {
        Object.keys(kioskGroupsChange[0]).map(key => {
            if (value.includes(key)) {
                var index = value.indexOf(key)
                value.splice(index, 1)
                value.push(kioskGroupsChange[0][key]);
            }
        })
        kioskGroupUids.length = 0;
        setKioskGroupUids(value);
        kioskEditData.kiosk_machine_groups = value;
        console.log(kioskEditData.kiosk_machine_groups);
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
        kioskEditData.auth_policy_groups = value;
        console.log(kioskEditData.auth_policy_groups);
    }

    return (
        <Skeleton loading={loading}>
            <div className={kioskDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
                <div className="row-policy-container">
                    <div>
                        {/* {kioskDisplayData['uid'] === undefined ? <></> :
                            <div className="content-heading">Edit kiosk Policy</div>
                        } */}
                    </div>
                    <div>
                        {kioskDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                            defaultValue={kioskDisplayData['name']}
                            placeholder='Enter a new policy name'
                        /> : kioskDisplayData['name']
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
                            defaultValue={kioskDisplayData['description']}
                            placeholder='Enter policy description'
                        /> : kioskDisplayData['description']
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
                            defaultValue={kioskDisplayData['name'] !== "" ? groupNames : []}
                            onChange={handleGroups}
                            // disabled={!isEdit}
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
                            defaultValue={kioskDisplayData['name'] !== "" ? kioskGroupNames : []}
                            onChange={handleMachineGroups}
                            // disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={kioskGroups}
                            filterOption={(input, option) =>
                                //@ts-ignore
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            listHeight={120}
                        /> : Object.keys(kioskGroupNames).map(name =>
                            <><Button style={{ cursor: 'text' }}>
                                {kioskGroupNames[name]}
                            </Button>&nbsp;</>)
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Policy Type:
                    </div>
                    <div>
                        {policyDisplayNames[kioskDisplayData['policy_type']]}
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <p className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>Kiosk Settings:</p>

                <div className="row-policy-container">
                    <div>
                        User Type
                    </div>
                    <div>
                        <Radio.Group value={kioskEditData?.policy_req?.login_type}
                            disabled={!isEdit}
                            onChange={(e) => setKioskEditedData((state) => {
                                const { policy_req } = state;
                                return {
                                    ...kioskEditData,
                                    policy_req: { ...policy_req, login_type: e.target.value }
                                }
                            })}
                        >
                            {
                                Object.keys(loginTypeOptions).map(option => {
                                    return <div key={option}>
                                        <Radio value={option}>
                                            {loginTypeOptions[option]}
                                        </Radio>
                                        <br />
                                    </div>
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div>
                        Username
                        &nbsp;<Checkbox
                            onChange={(e) => {
                                setKioskEditedData((state) => {
                                    const { policy_req } = state;
                                    return {
                                        ...kioskEditData,
                                        policy_req: {
                                            ...policy_req,
                                            id_as_machine_name: e.target.checked
                                        }
                                    }
                                })
                                if (e.target.checked === true) {
                                    policyRequirements['access_key_id'] = "%machineName%"
                                    setRender(!render);
                                }
                                else {
                                    kioskEditData.policy_req.access_key_id = ""
                                    setRender(!render);
                                }
                            }}
                            checked={kioskEditData?.policy_req?.id_as_machine_name}
                            disabled={!isEdit}
                        >
                            Same as machine name
                        </Checkbox>
                    </div>
                    <div>
                        {
                            isEdit ?
                                kioskEditData?.policy_req?.id_as_machine_name === false ?
                                    <Input className="form-control"
                                        style={{ width: "275px" }}
                                        value={kioskEditData?.policy_req?.access_key_id}
                                        onChange={(e) => setKioskEditedData((state) => {
                                            const { policy_req } = state;
                                            return {
                                                ...kioskEditData,
                                                policy_req: { ...policy_req, access_key_id: e.target.value }
                                            }
                                        })}
                                        placeholder='Enter username'
                                    /> : "%machineName%"
                                : kioskEditData?.policy_req?.id_as_machine_name ? "%machineName%"
                                    : kioskEditData?.policy_req?.access_key_id
                        }
                    </div>
                    <div>
                        Password
                    </div>
                    <div>
                        {
                            isEdit ? <Input.Password className="form-control"
                                style={{ width: "275px" }}
                                value={kioskEditData?.policy_req?.assay}
                                onChange={(e) => setKioskEditedData((state) => {
                                    const { policy_req } = state;
                                    return {
                                        ...kioskEditData,
                                        policy_req: { ...policy_req, assay: e.target.value }
                                    }
                                })}
                                placeholder='Enter password'
                            /> : password
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
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            value={confirmPassword}
                                            placeholder='Enter confirm password'
                                        /> : kioskEditData?.policy_req?.confirm_assay
                                    }
                                </div>
                            </> : <></>
                    }
                </div>
            </div>
            {kioskDisplayData['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createkioskPolicy}>Create</Button></div>
            }
        </Skeleton>
    );
}
