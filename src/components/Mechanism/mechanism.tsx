import { Button, Input, Radio, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";

import './Mechanism.css'

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { openNotification } from "../Layout/Notification";
import { useHistory } from "react-router-dom";
import { MechanismType } from "../../models/Data.models";


function Mechanism(props: any) {
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [displayDetails, setDisplayDetails] = useState({});
    const [editData, setEditData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [challengeFactors, setChallengeFactors] = useState([]);
    const [tapOutOptions, setTapOutOption]: any = useState({});
    const [factorOptions, setFactorOptions]: any = useState({});
    const [render, setRender] = useState(false);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [value, setValue] = useState("");
    const [disabledFactors]: any = useState([]);
    const [disabledFactors1]: any = useState([]);
    const history = useHistory();
    const mechanism = {
        challenge_factors: [
            {
                order: 0,
                factor: "",
                name: "Challenge_1",
                password_grace_period: "TWO_HOURS"
            },
            {
                order: 1,
                factor: "",
                name: "Challenge_2",
                password_grace_period: null
            }
        ],
        product_id: "oprc735871d0",
        name: "",
        on_tap_out: null,
        mechanism_groups: [],
        default: false,
        order: null,
        active: false,
        account_id: "ooa46c499ccb"
    }

    useEffect(() => {
        ApiService.get(ApiUrls.mechanism(window.location.pathname.split('/')[2]))
            .then((data: MechanismType) => {
                //@ts-ignore
                if (!data.errorSummary) {
                    console.log(data);
                    setDisplayDetails(data);
                    //@ts-ignore
                    setEditData(data);
                    if (data.challenge_factors.length !== 2) {
                        //@ts-ignore
                        data.challenge_factors = mechanism.challenge_factors
                    }
                    //@ts-ignore
                    setChallengeFactors(data.challenge_factors);
                    disabledFactors.push(data.challenge_factors[1].factor);
                    disabledFactors1.push(data.challenge_factors[0].factor);
                    if (data.uid === undefined) {
                        setIsEdit(true);
                    }

                    if (disabledFactors.includes("NONE")) {
                        disabledFactors.pop();
                    }

                    if (disabledFactors1.includes("NONE")) {
                        disabledFactors1.pop();
                        disabledFactors.pop();
                        setValue("NONE")
                        data.challenge_factors[1].factor = "NONE";
                        console.log(data.challenge_factors[1].factor);
                    }

                    if (data.uid !== undefined) {
                        Object.keys(data.mechanism_groups).map(result => {
                            groupNames.push(data.mechanism_groups[result].name);
                            groupUids.push(data.mechanism_groups[result].uid)
                            console.log(groupNames);
                            console.log(groupUids);
                        });
                        setGroupNames(groupNames);
                        setGroupUids(groupUids);
                    }
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 2) {
                    setDisplayDetails(mechanism);
                    setEditData(mechanism);
                    setIsEdit(true);
                    //@ts-ignore
                    setChallengeFactors(mechanism.challenge_factors)
                    setLoading(false);
                }
                else {
                    console.log('else: ', data);
                    //@ts-ignore
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses.errorSummary : data.errorSummary);
                    history.push('/mechanism');
                }
            })
    }, [])

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups, { type: "USER" }),
            ApiService.get(ApiUrls.mechanismOptions),
            ApiService.get(ApiUrls.mechanismChallengeFactors),
        ]))
            .then(data => {
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
                console.log(groups);

                console.log(data[1]);
                setTapOutOption(data[1].tap_out_options);

                console.log(data[2]);
                setFactorOptions(data[2]);

                console.log(displayDetails);
                setLoadingDetails(false);
            })
            .catch(error => {
                openNotification('error', error.message);
            })
    }, [])

    function updateMechanism() {
        console.log(groupUids);
        editData.mechanism_groups = groupUids
        ApiService.put(ApiUrls.mechanism(displayDetails['uid']), editData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    // setDisplayDetails({ ...editData });
                    openNotification('success', 'Successfully updated Mechanism');
                    Object.keys(data.mechanism_groups).map(index => {
                        groupNames.push(data.mechanism_groups[index].name);
                    });
                    console.log(groupNames);
                    setGroupNames(groupNames);
                    setIsEdit(false);
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with updating Mechanism');
            })
    }

    function handleEditClick() {
        setIsEdit(!isEdit);
        setEditData({ ...displayDetails });
    }

    function handleCancelClick() {
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateMechanism();
    }

    function showDisabled(e: any, array: any) {
        setRender(!render);
        Object.keys(factorOptions).map(factor => {
            if (e.target.value === factor) {
                array.pop();
                if (factor != "NONE") {
                    array.push(factor);
                }
            }
        })
    }

    function createMechanism() {
        if (editData.challenge_factors[0].factor !== "" && editData.challenge_factors[1].factor === "") {
            editData.challenge_factors[1].factor = "NONE";
        }
        props.handleOk(editData);
    }

    function setCancelClick() {
        props.handleCancel();
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
        editData.mechanism_groups = value;
        console.log(editData.mechanism_groups);
    }

    return (<>
        <div className='content-header'>
            Mechanism
            <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                history.push('/mechanism')
            }}>Back</Button>
        </div>

        <Skeleton loading={loading || loadingDetails}>
            <div className="content-container rounded-grey-border">
                <div className="row-containers">
                    <div>
                        {displayDetails['uid'] === undefined ? <></> :
                            <div className="content-heading">Edit Mechanism</div>
                        }
                    </div>
                    <div style={{ paddingRight: '50px', paddingBottom: '20px' }}>
                        {displayDetails['name'] !== "" ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                        }
                    </div>

                    <div className="content-mechanism-key-header">
                        Mechanism name:
                    </div>
                    <div>
                        {displayDetails['default'] === false && isEdit ?
                            <Input
                                name="machanismName"
                                type="text"
                                onChange={(e) => setEditData({
                                    ...editData,
                                    name: e.target.value
                                })}
                                style={{ width: "275px" }}
                                className="form-control"
                                placeholder="Enter mechanism name"
                                defaultValue={displayDetails['name'] !== "" ? displayDetails['name'] : ""}
                            /> : displayDetails['name']
                        }
                    </div>

                    <div className="content-mechanism-key-header">
                        Assigned to groups:
                    </div>
                    <div>
                        {displayDetails['default'] === false && isEdit ?
                            <Select
                                mode="multiple"
                                size={"large"}
                                placeholder="Please select groups"
                                defaultValue={displayDetails['name'] !== "" ? groupNames : []}
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

                    <div className="content-mechanism-key-header">
                        Primary Challenge:
                    </div>
                    <div>
                        {localStorage.getItem("productName") === 'TecTANGO' ?
                            <Radio.Group name="Primary challenge" defaultValue={"PROXIMITY_CARD"}>
                                <Radio value={"PROXIMITY_CARD"} disabled>Proximity Card</Radio>
                            </Radio.Group>
                            :
                            localStorage.getItem("productName") === 'TecBIO' ?
                                <Radio.Group name="Primary challenge" defaultValue={"BIO_METRICS"}>
                                    <Radio value={"BIO_METRICS"} disabled>Biometrics</Radio>: <></>
                                </Radio.Group>
                                : <></>
                        }
                    </div>

                    <div className="content-mechanism-key-header" style={{ paddingTop: '20px' }}>
                        Tapout Action:
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        <Radio.Group name="Tapout Action" defaultValue={displayDetails['on_tap_out']}
                            onChange={(e) => {
                                setEditData({
                                    ...editData,
                                    on_tap_out: e.target.value
                                })
                            }} disabled={!isEdit}
                        >
                            {
                                Object.keys(tapOutOptions).map(factor => {
                                    return <div key={factor}>
                                        <Radio value={factor}>
                                            {tapOutOptions[factor]}
                                        </Radio>
                                        <br />
                                    </div>
                                })
                            }
                        </Radio.Group>
                    </div>
                    {/*{localStorage.getItem("productName") === 'TecTANGO' ?
                        <>
                            <div className="content-mechanism-key-header" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                                Reader Type:
                            </div>
                            <div style={{ paddingTop: '20px' }}>
                                <Radio.Group name="Reader" defaultValue={displayDetails?.reader_type}
                                    onChange={(e) =>
                                        setEditData((editData: any) => ({
                                            ...editData,
                                            reader_type: e.target.value
                                        }))} disabled={!isEdit}
                                >
                                    {
                                        Object.keys(readerOptions).map(factor => {
                                            return <div key={factor}>
                                                <Radio value={factor}>
                                                    {readerOptions[factor]}
                                                </Radio>
                                                <br />
                                            </div>
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </> : <></>
                    } */}

                    {challengeFactors.length === 2 ?
                        <>
                            <div>
                                <div className="card-header" style={{ width: '90%' }}>
                                    Challenge 1
                                </div>
                                <div className="card" style={{ width: '90%' }}>
                                    <Radio.Group value={disabledFactors !== disabledFactors1 ? challengeFactors[0]['factor'] : ""}
                                        disabled={!isEdit}
                                        onChange={(e) => {
                                            editData.challenge_factors[0]["factor"] = e.target.value
                                            showDisabled(e, disabledFactors1)
                                            if (editData.challenge_factors[0]["factor"] === "NONE") {
                                                disabledFactors.pop();
                                                editData.challenge_factors[1]["factor"] = "NONE"
                                                setValue("NONE")
                                            }
                                        }}
                                    >
                                        {
                                            Object.keys(factorOptions).map(factor => {
                                                return <div key={factor}>
                                                    <Radio value={factor}
                                                        disabled={disabledFactors.includes(factor)}
                                                    >
                                                        {factorOptions[factor]}
                                                    </Radio>
                                                    <br />
                                                </div>
                                            })
                                        }
                                    </Radio.Group>
                                </div>
                            </div>

                            <div>
                                <div className="card-header" style={{ width: '90%' }}>
                                    Challenge 2
                                </div>
                                <div className="card" style={{ width: '90%' }}>
                                    <div>
                                        <Radio.Group value={displayDetails["name"] !== "" ? challengeFactors[0]['factor'] === "NONE" ? value : challengeFactors[1]['factor'] : value}
                                            disabled={challengeFactors[0]['factor'] === "NONE" || !isEdit}
                                            onChange={(e) => {
                                                setValue(e.target.value)
                                                editData.challenge_factors[1].factor = e.target.value
                                                showDisabled(e, disabledFactors)
                                            }}
                                        >
                                            {
                                                Object.keys(factorOptions).map(factor => {
                                                    return <div key={factor}>
                                                        <Radio value={factor}
                                                            disabled={disabledFactors1.includes(factor)}
                                                        >
                                                            {factorOptions[factor]}
                                                        </Radio>
                                                        <br />
                                                    </div>
                                                })
                                            }
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <></>}
                </div>
            </div>

            {displayDetails['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={createMechanism}>Create</Button></div>
            }
        </Skeleton>
    </>
    );
}

export default Mechanism;
