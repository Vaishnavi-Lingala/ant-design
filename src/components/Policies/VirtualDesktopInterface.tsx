import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import TextArea from "antd/lib/input/TextArea";
import { policyDisplayNames, VIRTUAL_DESKTOP_INTERFACE } from "../../constants";

function VDIPolicy(props: any) {
    const [loading, setLoading] = useState(true);
    const [vdiDisplayData, setVDIDisplayData] = useState({});
    const [vdiEditData, setVDIEditedData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [fullGroups, setFullGroups]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [vdiTypeOptions, setVDITypeOptions] = useState([]);
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');
    const [groupType, setGroupType] = useState("");
    const [clearItems, setClearItems] = useState(false);

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId)),
            ApiService.get(ApiUrls.vdiTypeOptions(accountId)),
            ApiService.get(ApiUrls.policy(accountId, window.location.pathname.split('/')[5]))
        ]))
            .then(data => {
                for (var i = 0; i < data[0].length; i++) {
                    groups.push({
                        label: data[0][i].name,
                        value: data[0][i].uid,
                        type: data[0][i].type
                    })
                }
                console.log(groups);
                setGroups(groups);
                setFullGroups(groups);
                var object = {};
                for (var i = 0; i < data[0].length; i++) {
                    object[data[0][i].name] = data[0][i].uid
                }
                groupsChange.push(object);
                setGroupsChange(groupsChange);

                setVDITypeOptions(data[1]);

                console.log(data[2]);
                if (!data[2].errorSummary) {
                    setVDIEditedData(data[2]);
                    setVDIDisplayData(data[2]);
                    if (data[2].uid !== undefined) {
                        Object.keys(data[2].kiosk_machine_groups).map(index => {
                            groupNames.push(data[2].kiosk_machine_groups[index].name);
                            groupUids.push(data[2].kiosk_machine_groups[index].uid);
                            setGroupType(data[2].kiosk_machine_groups[index].type);
                            setGroupUids(groupUids);
                            setGroupNames(groupNames)
                            console.log(groupUids);
                            console.log(groupNames);
                        });
                    }
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setVDIDisplayData(props.policyDetails);
                    setVDIEditedData(props.policyDetails);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[2]);
                    openNotification('error', data[2].errorCauses.length !== 0 ? data[2].errorCauses[1].errorSummary : data[2].errorSummary);
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
        setVDIEditedData({ ...vdiDisplayData });
    }

    function handleCancelClick() {
        setVDIEditedData({ ...vdiDisplayData });
        setIsEdit(false);
    }

    function handleSaveClick() {
        console.log(vdiEditData);
        updateUserProvisioningPolicy();
    }

    function createUserProvisioningPolicy() {
        props.handleOk(VIRTUAL_DESKTOP_INTERFACE, vdiEditData);
    }

    function setCancelClick() {
        props.handleCancel(VIRTUAL_DESKTOP_INTERFACE);
    }

    function updateUserProvisioningPolicy() {
        vdiEditData.kiosk_machine_groups = groupUids;
        ApiService.put(ApiUrls.policy(accountId, vdiDisplayData['uid']), vdiEditData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    setVDIDisplayData({ ...vdiEditData });
                    openNotification('success', 'Successfully updated VDI Policy');
                    Object.keys(data.kiosk_machine_groups).map(index => {
                        groupNames.push(data.kiosk_machine_groups[index].name);
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
                openNotification('error', 'An Error has occured with updating VDI Policy');
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
        vdiEditData.kiosk_machine_groups = value;
        console.log(vdiEditData.kiosk_machine_groups);
    }

    return <Skeleton loading={loading}>
        <div className={vdiDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
            <div className="row-policy-container">
                <div>
                </div>
                <div>
                    {vdiDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                        {!isEdit ? 'Edit' : 'Cancel'}
                    </Button> : <></>
                    }
                </div>
                <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                    Policy Name<span className="mandatory">*</span>:
                </div>
                <div style={{ paddingTop: '20px' }}>
                    {isEdit ? <Input className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setVDIEditedData({
                            ...vdiEditData,
                            name: e.target.value
                        })}
                        defaultValue={vdiDisplayData['name']}
                        placeholder='Enter a new policy name'
                    /> : vdiDisplayData['name']
                    }
                </div>

                <div className="content-policy-key-header">
                    Description:
                </div>
                <div>
                    {isEdit ? <TextArea className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setVDIEditedData({
                            ...vdiEditData,
                            description: e.target.value
                        })}
                        defaultValue={vdiDisplayData['description']}
                        placeholder='Enter policy description'
                    /> : vdiDisplayData['description']
                    }
                </div>

                <div className="content-policy-key-header">
                    Machine group type <span className="mandatory">*</span>:
                </div>
                <div>
                    <Radio.Group
                        defaultValue={groupType}
                        disabled={!isEdit}
                        onChange={(e) => {
                            // setGroupNames([
                            //     ...groupNames,
                            //     groupNames.length = 0
                            // ]);
                            setGroupType(e.target.value)
                            var groupTypegroups: any = [];
                            Object.keys(fullGroups).map(index => {
                                console.log(index)
                                if (fullGroups[index]["type"] === e.target.value) {
                                    groupTypegroups.push(fullGroups[index])
                                }
                            })
                            setGroups(groupTypegroups);
                        }}
                        >
                        <Radio value={"STANDARD"}>
                            Standard
                        </Radio>
                        <br />
                        <Radio value={"KIOSK"}>
                            Kiosk
                        </Radio>
                        <br />
                        <Radio value={"THIN"}>
                            Thin
                        </Radio>
                    </Radio.Group>
                </div>

                <div className="content-policy-key-header">
                    Assigned to machine groups<span className="mandatory">*</span>:
                </div>
                <div>
                    {isEdit ?
                        <Select
                        id={"select"}
                        mode="multiple"
                            size={"large"}
                            placeholder={<div>Please select groups</div>}
                            defaultValue={vdiDisplayData['name'] !== "" ? groupNames : []}
                            onChange={handleGroups}
                            style={{ width: '275px' }}
                            options={groups}
                            filterOption={(input, option) =>
                                // @ts-ignore
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
                    {policyDisplayNames[vdiDisplayData['policy_type']]}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-policy-container">
                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    VDI Type<span className="mandatory">*</span>:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    <Radio.Group
                        value={vdiEditData?.policy_req?.vdi_type}
                        disabled={!isEdit}
                        onChange={(e) => setVDIEditedData((state) => {
                            const { policy_req } = state;
                            return {
                                ...vdiEditData,
                                policy_req: {
                                    ...policy_req,
                                    vdi_type: e.target.value
                                }
                            }
                        })}
                    >
                        {
                            Object.keys(vdiTypeOptions).map(type => {
                                return <div key={type}>
                                    <Radio value={type}>
                                        {vdiTypeOptions[type]}
                                    </Radio>
                                    <br />
                                </div>
                            })
                        }
                    </Radio.Group>
                </div>

                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    App Template<span className="mandatory">*</span>:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    {isEdit ? <TextArea className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setVDIEditedData((state) => {
                            const { policy_req } = state;
                            return {
                                ...vdiEditData,
                                policy_req: {
                                    ...policy_req,
                                    app_template: e.target.value
                                }
                            }
                        })}
                        defaultValue={vdiDisplayData['policy_req']?.app_template}
                        placeholder='Enter app template'
                    /> : vdiDisplayData['policy_req']?.app_template
                    }
                </div>
            </div>
        </div>

        {
            vdiDisplayData['uid'] !== undefined ?
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

export default VDIPolicy;
