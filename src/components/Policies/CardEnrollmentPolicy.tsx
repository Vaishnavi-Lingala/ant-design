import { Button, Input, InputNumber, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { CARD_ENROLL, TecTANGO } from "../../constants";
import { openNotification } from "../Layout/Notification";

const CardEnrollmentPolicy = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cardEnrollDisplayData, setCardEnrollDisplayData] = useState(props.policyDetails);
    const [cardEnrollEditData, setCardEnrollEditedData] = useState(props.policyDetails);
    const [groups, setGroups]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [maxEnroll, setMaxEnroll] = useState(null);
    const [isLimitReached, setIsLimitReached] = useState(false);

    useEffect(() => {
        if (cardEnrollDisplayData.uid === undefined) {
            setIsEdit(true);
        }

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
                openNotification('error', 'An Error has occured with getting Groups');
                setLoading(false);
            })

        if (cardEnrollDisplayData.uid !== undefined) {
            Object.keys(cardEnrollDisplayData.auth_policy_groups).map(data => {
                groupNames.push(cardEnrollDisplayData.auth_policy_groups[data].name);
                groupUids.push(cardEnrollDisplayData.auth_policy_groups[data].uid)
                console.log(groupNames);
                console.log(groupUids);
            });
        }
        cardEnrollDisplayData.auth_policy_groups = groupUids;
    }, []);

    useEffect(() => {
        (async function () {
            try {
                let licenses = await ApiService.get(ApiUrls.licences);
                licenses.forEach(license => {
                    if (license.product.sku === TecTANGO && license.max_enroll_allowed) {
                        setMaxEnroll(license.max_enroll_allowed);
                    }
                })
            }
            catch (err) {
                console.log(err);
                openNotification("error", "Error has occured while getting licences");
            }
        })();
    }, []);


    function updateCardEnrollPolicy() {
        ApiService.put(ApiUrls.policy(cardEnrollDisplayData.uid), cardEnrollEditData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    setCardEnrollDisplayData({ ...cardEnrollEditData });
                    openNotification('success', 'Successfully updated Card Enroll Policy');
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
                openNotification('error', 'An Error has occured with updating CARD ENROLL Policy');
            })
    }

    function handleEditClick() {
        setIsEdit(!isEdit);
        setCardEnrollEditedData({ ...cardEnrollDisplayData });
    }

    function handleCancelClick() {
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateCardEnrollPolicy();
    }

    function createCardEnrollPolicy() {
        props.handleOk(CARD_ENROLL, cardEnrollEditData);
    }

    function setCancelClick() {
        props.handleCancel(CARD_ENROLL);
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
        cardEnrollEditData.auth_policy_groups = value;
        console.log(cardEnrollEditData.auth_policy_groups);
    }

    return (
        <Skeleton loading={loading}>
            <div className="content-container-policy">
                <div className="row-policy-container">
                    <div>
                        {cardEnrollDisplayData.uid === undefined ? <div className="content-heading">Create Card Enrollment Policy</div> :
                            <div className="content-heading">{isEdit ? 'Edit' : null} Card Enrollment Policy</div>
                        }
                    </div>
                    <div>
                        {cardEnrollDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                            onChange={(e) => setCardEnrollEditedData({
                                ...cardEnrollEditData,
                                name: e.target.value
                            })}
                            defaultValue={cardEnrollDisplayData.name}
                            placeholder='Enter a new policy name'
                        /> : cardEnrollDisplayData.name
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Description:
                    </div>
                    <div>
                        {isEdit ? <TextArea className="form-control"
                            style={{ width: "275px" }}
                            onChange={(e) => setCardEnrollEditedData({
                                ...cardEnrollEditData,
                                description: e.target.value
                            })}
                            defaultValue={cardEnrollDisplayData.description}
                            placeholder='Enter policy description'
                        /> : cardEnrollDisplayData.description
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
                                defaultValue={cardEnrollDisplayData.name !== "" ? groupNames : []}
                                onChange={handleGroups}
                                style={{ width: '275px' }}
                                options={groups}
                            /> : Object.keys(groupNames).map(name =>
                                <><Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>&nbsp;</>)
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Policy Type:
                    </div>
                    <div>
                        {cardEnrollDisplayData.policy_type}
                    </div>

                    <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                        Max Card Enrollment:
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {isEdit ? <>
                            <InputNumber className="form-control"
                                max={maxEnroll}
                                min={1}
                                style={{ width: "275px" }}
                                onChange={(e) => {
                                    setIsLimitReached(parseInt(e) === maxEnroll);
                                    setCardEnrollEditedData({
                                        ...cardEnrollEditData,
                                        policy_req: { max_card_enrollment: parseInt(e) }
                                    })
                                }}
                                defaultValue={cardEnrollDisplayData.policy_req.max_card_enrollment}
                            />
                            {isLimitReached ? <div style={{ padding: '5px', color: 'red' }}>
                            Max card enrollment limit is {maxEnroll}. Please contact Tecnics to update it.
                            </div> : null}
                        </> : cardEnrollDisplayData.policy_req.max_card_enrollment
                        }
                    </div>
                </div>
            </div>
            {cardEnrollDisplayData.uid !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={createCardEnrollPolicy}>create</Button></div>
            }
        </Skeleton>
    );
}

export default CardEnrollmentPolicy;