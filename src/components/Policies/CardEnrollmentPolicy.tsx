import { Button, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useContext, useEffect } from "react";

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { StoreContext } from "../../helpers/Store";
import { PinPolicyType } from "../../models/Data.models";
import { showToast } from "../Layout/Toast/Toast";


const CardEnrollmentPolicy = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cardEnrollDisplayData, setCardEnrollDisplayData] = useState(props.policyDetails);
    const [cardEnrollEditData, setCardEnrollEditedData] = useState(props.policyDetails);
    const [groups, setGroups]: any = useState([]);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [toastList, setToastList] = useContext(StoreContext);

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
                setLoading(false);
                const response = showToast('error', 'An Error has occured with getting Groups');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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

    function updateCardEnrollPolicy() {
        ApiService.put(ApiUrls.policy(cardEnrollDisplayData.uid), cardEnrollEditData)
            .then(data => {
                if (!data.errorSummary) {
                    setCardEnrollDisplayData({ ...cardEnrollEditData });
                    const response = showToast('success', 'Successfully updated CARD ENROLL Policy');
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
                else {
                    const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                const response = showToast('error', 'An Error has occured with updating CARD ENROLL Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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
        setIsEdit(false);
    }

    function createCardEnrollPolicy() {
        console.log(cardEnrollEditData)
        ApiService.post(ApiUrls.addPolicy, cardEnrollEditData)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    const response = showToast('success', 'Successfully added CARD ENROLL Policy');
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
                else {
                    const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
            }, error => {
                console.error('Error: ', error);
                const response = showToast('error', 'An Error has occured with adding CARD ENROLL Policy');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }

    function setCancelClick() {
        window.location.reload();
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
        <>
            <div className="content-container-policy">
                <div className="row-container">
                    <div>
                        {cardEnrollDisplayData.uid === undefined ? <div className="content-heading">Create Card Enrollment Policy</div> :
                            <div className="content-heading">Edit Card Enrollment Policy</div>
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
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="Please select groups"
                            defaultValue={cardEnrollDisplayData.name !== "" ? groupNames : []}
                            onChange={handleGroups}
                            disabled={!isEdit}
                            style={{ width: '275px' }}
                            options={groups}
                            listHeight={120}
                        />
                    </div>

                    <div className="content-policy-key-header">
                        Policy Type:
                    </div>
                    <div>
                        {cardEnrollDisplayData.policy_type}
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
        </>
    );
}

export default CardEnrollmentPolicy;