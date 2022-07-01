import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Input, InputNumber, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { CARD_ENROLL, policyDisplayNames, TecTANGO } from "../../constants";
import { openNotification } from "../Layout/Notification";
import Hint from "../Controls/Hint";

const CardEnrollmentPolicy = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cardEnrollDisplayData, setCardEnrollDisplayData] = useState({});
    const [cardEnrollEditData, setCardEnrollEditedData]: any = useState();
    const [policyRequirements, setPolicyRequirements] = useState({});
    const [groups, setGroups]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [maxEnroll, setMaxEnroll] = useState(1);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
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

                if (!data[1].errorSummary) {
                    setCardEnrollDisplayData(data[1]);
                    setCardEnrollEditedData(data[1]);
                    setPolicyRequirements(data[1].policy_req);

                    Object.keys(data[1]['auth_policy_groups']).map(index => {
                        groupNames.push(data[1].auth_policy_groups[index].name);
                        groupUids.push(data[1].auth_policy_groups[index].uid)
                        setGroupNames(groupNames);
                        setGroupUids(groupUids);
                    });
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 5) {
                    setCardEnrollDisplayData(props.policyDetails);
                    setCardEnrollEditedData(props.policyDetails);
                    setPolicyRequirements(props.policyDetails.policy_req);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[1]);
                    openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses[1].errorSummary : data[1].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/card-enrollment`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        (async function () {
            try {
                let licenses = await ApiService.get(ApiUrls.licences(accountId));
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
        cardEnrollEditData['auth_policy_groups'] = groupUids;
        ApiService.put(ApiUrls.policy(accountId, cardEnrollDisplayData['uid']), cardEnrollEditData)
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
        setCardEnrollEditedData({ ...cardEnrollDisplayData });
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
                var index = value.indexOf(key)
                value.splice(index, 1)
                value.push(groupsChange[0][key]);
            }
        })
        groupUids.length = 0;
        setGroupUids(value);
        cardEnrollEditData.auth_policy_groups = value;
        console.log(cardEnrollEditData.auth_policy_groups);
    }

    return (
        <Skeleton loading={loading}>
            <div className={cardEnrollDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
                <div className="row-policy-container">
                    <div>
                        {cardEnrollDisplayData['uid'] === undefined ? <></> :
                            <div>
                                {/* <div style={{display: 'inline-block', marginRight: '3px'}} className="content-heading">
                                    {isEdit ? 'Edit' : null} Card Enrollment Policy 
                                </div>
                                <div style={{display: 'inline-block', marginRight: '3px'}}>
                                    <Hint text={"This policy allows you to control how many cards can be enrolled per user"} />
                                </div> */}
                            </div>  
                        }
                    </div>
                    <div>
                        {cardEnrollDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
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
                            defaultValue={cardEnrollDisplayData['name']}
                            placeholder='Enter a new policy name'
                        /> : cardEnrollDisplayData['name']
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
                            defaultValue={cardEnrollDisplayData['description']}
                            placeholder='Enter policy description'
                        /> : cardEnrollDisplayData['description']
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
                                defaultValue={cardEnrollDisplayData['name'] !== "" ? groupNames : []}
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
                        {policyDisplayNames[cardEnrollDisplayData['policy_type']]}
                    </div>

                    <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                        Max Card Enrollment:
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {isEdit ? <>
                            <InputNumber className="form-control"
                                min={1}
                                style={{ width: "275px" }}
                                onChange={(e) => {
                                    setIsLimitReached(parseInt(e) > maxEnroll);
                                    setCardEnrollEditedData({
                                        ...cardEnrollEditData,
                                        policy_req: { max_card_enrollment: parseInt(e) }
                                    })
                                }}
                                defaultValue={policyRequirements['max_card_enrollment']}
                            />
                            {isLimitReached ? <div style={{ padding: '5px', color: 'red' }}>
                            By policy, users will not be allowed to enroll more than the {maxEnroll} cards. If higher limit is required, please contact support team.
                                {/* Max card enrollment limit is {maxEnroll}. Please contact Tecnics to update it. */}
                            </div> : null}
                        </> : policyRequirements['max_card_enrollment']
                        }
                    </div>
                </div>
            </div>
            {cardEnrollDisplayData['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button disabled={isLimitReached} type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createCardEnrollPolicy}>Create</Button></div>
            }
        </Skeleton>
    );
}

export default CardEnrollmentPolicy;