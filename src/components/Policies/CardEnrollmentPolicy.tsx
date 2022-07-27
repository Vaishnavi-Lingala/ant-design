import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, InputNumber, Radio, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { CARD_ENROLL, policyDisplayNames, TecTANGO } from "../../constants";
import { openNotification } from "../Layout/Notification";

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
    const [maxEnrollOptions, setMaxEnrollOptions] = useState({});
    const [maxEnroll, setMaxEnroll] = useState(1);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');
    const productId = window.location.pathname.split('/')[2];

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
            ApiService.get(ApiUrls.maxCardEnrollExceedOptions(accountId)),
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

                console.log(data[1]);
                setMaxEnrollOptions(data[1]);

                console.log(data[2]);
                if (!data[2].errorSummary) {
                    setCardEnrollDisplayData(data[2]);
                    setCardEnrollEditedData(data[2]);
                    setPolicyRequirements(data[2].policy_req);

                    Object.keys(data[2]['auth_policy_groups']).map(index => {
                        groupNames.push(data[2].auth_policy_groups[index].name);
                        groupUids.push(data[2].auth_policy_groups[index].uid)
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
                    console.log('else: ', data[2]);
                    openNotification('error', data[2].errorCauses.length !== 0 ? data[2].errorCauses[1].errorSummary : data[2].errorSummary);
                    history.push(`/product/${localStorage.getItem("productId")}/policies/card-enrollment`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Details');
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
        if (cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config === "DO_NOT_ALLOW") {
            cardEnrollEditData.policy_req.last_used_days = null
        }
        cardEnrollEditData['auth_policy_groups'] = groupUids;
        ApiService.put(ApiUrls.policy(accountId, productId, cardEnrollDisplayData['uid']), cardEnrollEditData)
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
                        <p>Policy Name<span className="mandatory">*</span> :</p>
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
                        <p>Assigned to groups<span className="mandatory">*</span> :</p>
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
                </div>

                <div className="row-policy-container">
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
                                By default users may only be allowed to have {maxEnroll} cards enrolled to them. If a higher limit is required please contact your support team.
                                {/* Max card enrollment limit is {maxEnroll}. Please contact Tecnics to update it. */}
                            </div> : null}
                        </> : policyRequirements['max_card_enrollment']
                        }
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                
                <div>
                    <b>WHEN</b> max card enrollment is exceeded <b>THEN</b>
                </div>
                <div style={{ paddingTop: '10px' }}>
                    <Radio.Group onChange={(e) => {
                        setCardEnrollEditedData((state) => {
                            const { policy_req } = state
                            return {
                                ...cardEnrollEditData,
                                policy_req: {
                                    ...policy_req,
                                    max_card_enroll_exceed_config: e.target.value
                                }
                            }
                        })
                    }} disabled={!isEdit} value={cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config}
                    >
                        {
                            Object.keys(maxEnrollOptions).map(key => {
                                return <>
                                    <Radio value={key} key={key}>
                                        {maxEnrollOptions[key]}
                                        {key === "DO_NOT_ALLOW" ?
                                            <> enrollment unless admin manually unenroll the card in the portal</> :
                                            key === "UNENROLL_LEAST_USED" ?
                                                <> in the last {
                                                    isEdit ?
                                                        cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config === "UNENROLL_LEAST_USED" ?
                                                            <InputNumber min={1} value={cardEnrollEditData?.policy_req?.last_used_days}
                                                                style={{ width: '55px' }}
                                                                onChange={(value) => {
                                                                    setCardEnrollEditedData((state) => {
                                                                        const { policy_req } = state
                                                                        return {
                                                                            ...cardEnrollEditData,
                                                                            policy_req: {
                                                                                ...policy_req,
                                                                                last_used_days: value
                                                                            }
                                                                        }
                                                                    })
                                                                }} /> : <>(x)</> : cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config === "UNENROLL_LEAST_USED" ?
                                                            cardEnrollEditData?.policy_req?.last_used_days === null ? <>(x)</> : cardEnrollEditData?.policy_req?.last_used_days : <>(x)</>
                                                } day(s) & allow new enrollment.
                                                </> :
                                                <> in the last {
                                                    isEdit ?
                                                        cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config === "UNENROLL_FREQUENTLY_USED" ?
                                                            <InputNumber min={1} value={cardEnrollEditData?.policy_req?.last_used_days}
                                                                style={{ width: '55px' }}
                                                                onChange={(value) => {
                                                                    setCardEnrollEditedData((state) => {
                                                                        const { policy_req } = state
                                                                        return {
                                                                            ...cardEnrollEditData,
                                                                            policy_req: {
                                                                                ...policy_req,
                                                                                last_used_days: value
                                                                            }
                                                                        }
                                                                    })
                                                                }} /> : <>(x)</> : cardEnrollEditData?.policy_req?.max_card_enroll_exceed_config === "UNENROLL_FREQUENTLY_USED" ?
                                                            cardEnrollEditData?.policy_req?.last_used_days === null ? <>(x)</> : cardEnrollEditData?.policy_req?.last_used_days : <>(x)</>
                                                } day(s) & allow new enrollment.
                                                </>
                                        }
                                    </Radio>
                                    <br />
                                </>
                            })
                        }
                    </Radio.Group>
                </div>
            </div>
            {
                cardEnrollDisplayData['uid'] !== undefined ?
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
        </Skeleton >
    );
}

export default CardEnrollmentPolicy;