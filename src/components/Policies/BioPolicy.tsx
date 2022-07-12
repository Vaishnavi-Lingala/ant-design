import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, InputNumber, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { BIO, policyDisplayNames } from "../../constants";
import { openNotification } from "../Layout/Notification";

function BioPolicy(props: any) {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bioDisplayData, setBioDisplayData] = useState({});
    const [bioEditData, setBioEditedData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');
    const productId = window.location.pathname.split('/')[2];

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
            ApiService.get(ApiUrls.policy(accountId, productId, window.location.pathname.split('/')[5]))
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

                if (!data[1].errorSummary) {
                    setBioDisplayData(data[1]);
                    setBioEditedData(data[1]);

                    Object.keys(data[1]['auth_policy_groups']).map(index => {
                        groupNames.push(data[1].auth_policy_groups[index].name);
                        groupUids.push(data[1].auth_policy_groups[index].uid)
                        setGroupNames(groupNames);
                        setGroupUids(groupUids);
                    });
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setBioDisplayData(props.policyDetails);
                    setBioEditedData(props.policyDetails);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[1]);
                    openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses[1].errorSummary : data[1].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/bio`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoading(false);
            })
    }, []);

    function updateBioPolicy() {
        if (bioEditData?.policy_req?.min_fingerprint_scan > bioEditData?.policy_req?.max_fingerprint_scan) {
            openNotification('error', 'Minimum Fingerprint Scan should not greater than Maximum Fingerprint Scan');
        }
        else {
            bioEditData['auth_policy_groups'] = groupUids;
            ApiService.put(ApiUrls.policy(accountId, productId, bioDisplayData['uid']), bioEditData)
                .then(data => {
                    if (!data.errorSummary) {
                        groupNames.length = 0;
                        setBioDisplayData({ ...bioEditData });
                        openNotification('success', 'Successfully updated BIO Policy');
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
                    openNotification('error', 'An Error has occured with updating BIO Policy');
                })
        }
    }

    function handleEditClick() {
        setIsEdit(!isEdit);
        setBioEditedData({ ...bioDisplayData });
    }

    function handleCancelClick() {
        setBioEditedData({ ...bioDisplayData });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateBioPolicy();
    }

    function createBioPolicy() {
        props.handleOk(BIO, bioEditData);
    }

    function setCancelClick() {
        props.handleCancel(BIO);
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
        bioEditData.auth_policy_groups = value;
        console.log(bioEditData.auth_policy_groups);
    }

    return (
        <Skeleton loading={loading}>
            <div className={bioDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
                <div className="row-policy-container">
                    <div>

                    </div>
                    <div>
                        {bioDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                        }
                    </div>

                    <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                        <p>Policy Name<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {isEdit ? <Input className="form-control"
                            style={{ width: "275px" }}
                            onChange={(e) => setBioEditedData({
                                ...bioEditData,
                                name: e.target.value
                            })}
                            defaultValue={bioDisplayData['name']}
                            placeholder='Enter a new policy name'
                        /> : bioDisplayData['name']
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Description:
                    </div>
                    <div>
                        {isEdit ? <TextArea className="form-control"
                            style={{ width: "275px" }}
                            onChange={(e) => setBioEditedData({
                                ...bioEditData,
                                description: e.target.value
                            })}
                            defaultValue={bioDisplayData['description']}
                            placeholder='Enter policy description'
                        /> : bioDisplayData['description']
                        }
                    </div>

                    <div className="content-policy-key-header">
                        <p>Assigned to groups<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ?
                            <Select
                                mode="multiple"
                                size={"large"}
                                placeholder={<div>Please select groups</div>}
                                defaultValue={bioDisplayData['name'] !== "" ? groupNames : []}
                                onChange={handleGroups}
                                style={{ width: '275px' }}
                                options={groups}
                                filterOption={(input, option) =>
                                    //@ts-ignore
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            /> : Object.keys(groupNames).map(name =>
                                <><Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>&nbsp;</>)
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Policy Type:
                    </div>
                    <div>
                        {policyDisplayNames[bioDisplayData['policy_type']]}
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <p className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>Bio Settings:</p>

                <div className="row-policy-container">
                    <div className="content-policy-key-header">
                        Minimum Fingerprint Scan:
                    </div>
                    <div >
                        {isEdit ? <>
                            <InputNumber className="form-control"
                                min={1}
                                onChange={(value) => {
                                    setBioEditedData((state) => {
                                        const { policy_req } = state;
                                        return {
                                            ...bioEditData,
                                            policy_req: {
                                                ...policy_req,
                                                min_fingerprint_scan: value
                                            }
                                        }
                                    }
                                    )
                                }}
                                value={bioEditData?.policy_req?.min_fingerprint_scan}
                            />
                        </> : bioDisplayData['policy_req']?.min_fingerprint_scan
                        }
                    </div>

                    <div className="content-policy-key-header" style={{ paddingTop: '10px' }}>
                        Maximum Fingerprint Scan:
                    </div>
                    <div style={{ paddingTop: '10px' }}>
                        {isEdit ? <>
                            <InputNumber className="form-control"
                                min={4}
                                max={10}
                                onChange={(value) => {
                                    setBioEditedData((state) => {
                                        const { policy_req } = state;
                                        return {
                                            ...bioEditData,
                                            policy_req: {
                                                ...policy_req,
                                                max_fingerprint_scan: value
                                            }
                                        }
                                    }
                                    )
                                }}
                                value={bioEditData?.policy_req?.max_fingerprint_scan}
                            />
                        </> : bioDisplayData['policy_req']?.max_fingerprint_scan
                        }
                    </div>

                    {/* <div className="content-policy-key-header" style={{ paddingTop: '10px' }}>
                        Threshold Score:
                    </div>
                    <div style={{ paddingTop: '10px' }}>
                        {isEdit ? <>
                            <Input className="form-control" readOnly
                                style={{ width: "275px" }}
                                onChange={(e) => {
                                    setBioEditedData((state) => {
                                        const { policy_req } = state;
                                        return {
                                            ...bioEditData,
                                            policy_req: {
                                                ...policy_req,
                                                threshold_score: e.target.value
                                            }
                                        }
                                    })
                                }}
                                value={bioEditData?.policy_req?.threshold_score}
                                placeholder='Enter threshold score'
                            />
                        </> : bioDisplayData['policy_req']?.threshold_score
                        }
                    </div> */}
                </div>
            </div>

            {bioDisplayData['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createBioPolicy}>Create</Button></div>
            }
        </Skeleton>
    );
}

export default BioPolicy;
