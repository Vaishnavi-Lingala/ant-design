import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Checkbox, Divider, Input, InputNumber, Radio, Select, Skeleton } from "antd";

import './Mechanism.css'

import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import { MechanismType } from "../../models/Data.models";
import { Store } from "../../Store";
import Hint from "../Controls/Hint";
import { tapOutFields, TecBIO, TECBIO_LOCK_DESCRIPTION, TECBIO_SIGN_OUT_ALL_DESCRIPTION, TECBIO_SIGN_OUT_DESCRIPTION, TecTANGO, TECTANGO_LOCK_DESCRIPTION, TECTANGO_SIGN_OUT_ALL_DESCRIPTION, TECTANGO_SIGN_OUT_DESCRIPTION } from "../../constants";


function Mechanism(props: any) {
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [visible, setVisible] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [displayDetails, setDisplayDetails] = useState({});
    const [editData, setEditData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [challengeFactors, setChallengeFactors] = useState([]);
    const [tapOutOptions, setTapOutOption]: any = useState({});
    const [factorOptions, setFactorOptions]: any = useState({});
    const [idleTimeoutOptions, setIdleTimeoutOptions]: any = useState({});
    const [render, setRender] = useState(false);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [value, setValue] = useState("");
    const [disabledFactors]: any = useState([]);
    const [disabledFactors1]: any = useState([]);
    const [selectedHeader] = useContext(Store);
    const history = useHistory();
    const { productId } = useParams<any>();
    const accountId = localStorage.getItem('accountId');

    const mechanism = {
        challenge_factors: [
            {
                order: 0,
                factor: selectedHeader === TecBIO ? "NONE" : "PASSWORD",
                name: "Challenge_1",
            },
            {
                order: 1,
                factor: "NONE",
                name: "Challenge_2",
            }
        ],
        product_id: "oprc735871d0",
        idle_timeout: "FIFTEEN_MINUTES",
        name: "",
        on_tap_out: selectedHeader === TecBIO ? "SIGN_OUT" : null,
        idle_timeout_flag: false,
        mechanism_groups: [],
        default: false,
        order: null,
        active: false,
        account_id: "ooa46c499ccb"
    }

    useEffect(() => {
        ApiService.get(ApiUrls.mechanism(accountId, productId, window.location.pathname.split('/')[4]))
            .then((data: MechanismType) => {
                //@ts-ignore
                if (!data.errorSummary) {
                    console.log(data);
                    setDisplayDetails(data);
                    //@ts-ignore
                    setEditData(data);
                    //@ts-ignore
                    console.log(data.idle_timeout_flag);
                    //@ts-ignore
                    setVisible(data.idle_timeout_flag)
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
                else if (window.location.pathname.split('/').length === 4) {
                    setDisplayDetails(mechanism);
                    setEditData(mechanism);
                    setIsEdit(true);
                    //@ts-ignore
                    setChallengeFactors(mechanism.challenge_factors)
                    setVisible(mechanism.idle_timeout_flag)
                    setValue("NONE");
                    setLoading(false);
                }
                else {
                    console.log('else: ', data);
                    //@ts-ignore
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses.errorSummary : data.errorSummary);
                    history.push(`/product/${productId}/mechanism`);
                }
            })
    }, [])

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
            ApiService.get(ApiUrls.mechanismOptions(accountId)),
            ApiService.get(ApiUrls.mechanismChallengeFactors(accountId, productId)),
            ApiService.get(ApiUrls.idleTimeoutOptions(accountId))
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

                console.log(data[3]);
                setIdleTimeoutOptions(data[3]);

                console.log(displayDetails);
                setLoadingDetails(false);
            })
            .catch(error => {
                openNotification('error', error.message);
            })

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [])

    function updateMechanism() {
        console.log(groupUids);
        editData.mechanism_groups = groupUids;
        console.log(editData);
        if (editData?.idle_timeout_flag === false) {
            editData.idle_timeout = "NONE";
        }
        console.log(editData);
        ApiService.put(ApiUrls.mechanism(accountId, productId, displayDetails['uid']), editData)
            .then(data => {
                if (!data.errorSummary) {
                    setDisplayDetails({ ...editData });
                    groupNames.length = 0;
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
        setEditData({ ...displayDetails });
        setIsEdit(!isEdit);
    }

    function handleCancelClick() {
        setEditData({ ...displayDetails });
        setIsEdit(false);
    }

    function handleSaveClick() {
        console.log(editData);
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
        {window.location.pathname.split('/').length === 5 ?
            <div className='content-header'>
                Mechanism
                {displayDetails['uid'] !== undefined ?
                    <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                        history.push(`/product/${productId}/mechanism`);
                    }}>Back</Button>
                    : <></>
                }
            </div> : <></>
        }

        <Skeleton loading={loading || loadingDetails}>
            <div className="content-container rounded-grey-border">
                <div className="row-containers">
                    <div>
                        {/* {displayDetails['uid'] === undefined ? <></> :
                            <div className="content-heading">Edit Mechanism</div>
                        } */}
                    </div>
                    <div style={{ paddingRight: '50px', paddingBottom: '20px' }}>
                        {displayDetails['name'] !== "" ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                        }
                    </div>

                    <div className="content-mechanism-key-header">
                        <p>Mechanism name<span className="mandatory">*</span> :</p>
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
                        <p>Assigned to groups<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {displayDetails['default'] === false && isEdit ?
                            <Select
                                mode="multiple"
                                size={"large"}
                                placeholder="Please select groups"
                                defaultValue={displayDetails['name'] !== "" ? groupNames : []}
                                onChange={handleGroups}
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

                    {/* <div className="content-mechanism-key-header">
                        Primary Challenge:
                    </div>
                    <div>
                        {selectedHeader === 'TecTANGO' ?
                            <Radio.Group name="Primary challenge" defaultValue={"PROXIMITY_CARD"}>
                                <Radio value={"PROXIMITY_CARD"} disabled>Proximity Card</Radio>
                            </Radio.Group>
                            :
                            selectedHeader === 'TecBIO' ?
                                <Radio.Group name="Primary challenge" defaultValue={"BIO_METRICS"}>
                                    <Radio value={"BIO_METRICS"} disabled>Biometrics</Radio>: <></>
                                </Radio.Group>
                                : <></>
                        }
                    </div> */}
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                {
                    selectedHeader === TecTANGO ?
                        <div style={{ padding: '0 0 20px 0' }}>
                            <b>WHEN</b> user <b>TAPS</b> the proximity card/badge on the card reader
                        </div> :
                        <div style={{ padding: '0 0 20px 0' }}>
                            <b>WHEN</b> user <b>SCANS</b> their finger on the biometric scanner
                        </div>
                }

                <div className="row-containers">
                    {
                        challengeFactors.length === 2 ?
                            <>
                                <div>
                                    <b>THEN</b> first challenge is one of the following
                                </div>
                                <div>
                                    <b>AND</b> second challenge is one  of the following
                                </div>
                                <div>
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

                                <div>
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
                            </>
                            : <></>
                    }
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                {
                    selectedHeader === TecTANGO ?
                        <div style={{ padding: '0 0 20px 0' }}>
                            <b>WHEN</b> user <b>TAPS</b> the proximity card/badge on the card reader over an active session
                        </div> :
                        <div style={{ padding: '0 0 20px 0' }}>
                            <b>WHEN</b> user <b>SCANS</b> their finger on the biometric scanner over an active session
                        </div>
                }

                <div style={{ padding: '0 0 20px 0' }}>
                    <b>THEN</b> perform one of the the following action on the machine
                </div>

                <div className="row-containers">
                    <div>
                        <Radio.Group name="Tapout Action" value={editData?.on_tap_out}
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
                                            {tapOutFields[factor]}
                                            <Hint text={factor === "LOCK" ?
                                                selectedHeader === TecTANGO ? TECTANGO_LOCK_DESCRIPTION : TECBIO_LOCK_DESCRIPTION :
                                                factor === "SIGN_OUT" ?
                                                    selectedHeader === TecTANGO ? TECTANGO_SIGN_OUT_DESCRIPTION : TECBIO_SIGN_OUT_DESCRIPTION :
                                                    selectedHeader === TecTANGO ? TECTANGO_SIGN_OUT_ALL_DESCRIPTION : TECBIO_SIGN_OUT_ALL_DESCRIPTION}
                                            />
                                        </Radio>
                                        <br />
                                    </div>
                                })
                            }
                        </Radio.Group>
                    </div>

                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <div style={{ padding: '0 0 20px 0' }}>
                    <b>IF</b> user idle timeout (period of inactivity) is {
                        <Checkbox
                            defaultChecked={editData?.idle_timeout_flag}
                            disabled={!isEdit}
                            onChange={(e) => {
                                setEditData({
                                    ...editData,
                                    idle_timeout_flag: e.target.checked
                                })
                            }}
                        />
                    } enabled
                </div>

                <b>THEN</b> after {
                    isEdit ?
                        editData?.idle_timeout_flag === true ? <Select
                            size={"large"}
                            placeholder="Select mins..."
                            value={idleTimeoutOptions[editData['idle_timeout']]}
                            onChange={(value) => setEditData({
                                ...editData,
                                idle_timeout: value
                            })}
                            style={{ width: '130px' }}
                        >
                            {
                                Object.keys(idleTimeoutOptions).map(option => {
                                    return <Select.Option key={option} value={option}>
                                        {idleTimeoutOptions[option]}
                                    </Select.Option>
                                })
                            }
                        </Select>
                            : <>(x) minutes</>
                        : editData?.idle_timeout_flag === true ? idleTimeoutOptions[displayDetails['idle_timeout']] : <>(x) minutes</>
                } user will be locked/signed-out.

                <div style={{ padding: '20px 0 0 0' }}>
                    <Checkbox
                        checked={editData?.launch_idp_dashboard}
                        disabled={!isEdit}
                        onChange={(e) => {
                            setEditData({
                                ...editData,
                                launch_idp_dashboard: e.target.checked
                            })
                        }}
                    /> Launch IDP Dashboard
                </div>
            </div>

            {
                displayDetails['uid'] !== undefined ?
                    (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                        <Button style={{ float: 'right', marginLeft: '10px' }}
                            onClick={handleCancelClick}>Cancel</Button>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={handleSaveClick}>Save</Button>
                    </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                        <Button style={{ float: 'right', marginLeft: '10px' }}
                            onClick={setCancelClick}>Cancel</Button>
                        <Button loading={props.buttonLoading} type='primary' style={{ float: 'right' }}
                            onClick={createMechanism}>Create</Button></div>
            }
        </Skeleton>
    </>
    );
}

export default Mechanism;
