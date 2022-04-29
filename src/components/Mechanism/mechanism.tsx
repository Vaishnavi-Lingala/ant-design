import { Button, Dropdown, Input, Radio, Select, Skeleton, Space } from "antd";
import { useState } from "react";
import { MechanismType } from "../../models/Data.models";

import './Mechanism.css'

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

function Mechanism(props: any) {
    const [displayDetails, setDisplayDetails] = useState<MechanismType>(props.mechanismDetails);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData]: any = useState(props.mechanismDetails);
    //@ts-ignore`
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [tapOutOptions, setTapOutOption]: any = useState({
        "LOCK": "Lock",
        "SIGN_OUT": "Sign Out",
        "SIGN_OUT_ALL_USERS": "Sign Out All Users"
    });

    const [readerOptions, setReaderOptions]: any = useState({
        "PCSCREADER": "PC/SC Readers",
        "PCPROXREADER": "rf IDEAS"
    });

    const [factorOptions, setFactorOptions]: any = useState({
        "PASSWORD": "Password",
        "PIN": "Pin",
        "OKTA_MFA": "Okta MFA",
        "NONE": "None"
    });

    // useEffect(() => {
    //     Apis.getMechanismOptions()
    //     .then(data => {
    //         console.log(data)
    //         setOptions(data);
    //         tapOutOptions.push(data.tap_out_options);
    //     })
    // }, [])

    // console.log(tapOutOptions);

    const getTapoutOptions = Object.keys(tapOutOptions).map(key => ({ value: key, label: tapOutOptions[key] }))
    const getReaderOptions = Object.keys(readerOptions).map(key => ({ value: key, label: readerOptions[key] }))
    const getFactorOptions = Object.keys(factorOptions).map(key => ({ value: key, label: factorOptions[key] }))

    function updateMechanism() {
        ApiService.post(ApiUrls.mechanism(displayDetails.uid), editData)
            .then(data => {
                console.log(data);
                setDisplayDetails({ ...editData });
            })
            .catch(error => {
                console.log(error);
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
        setIsEdit(false);
    }

    const [disabledFactors, setDisabledFactors]: any = useState([displayDetails.challenge_factors[1].factor]);
    const [disabledFactors1, setDisabledFactors1]: any = useState([displayDetails.challenge_factors[0].factor]);

    console.log(!disabledFactors.includes(displayDetails?.challenge_factors[0].factor))

    function showDisabled(e: any) {
        if (e.target.value === "PASSWORD" || displayDetails?.challenge_factors[1].factor === "PASSWORD") {
            disabledFactors.push("PASSWORD");
        }
        else if (e.target.value === "PIN" || displayDetails?.challenge_factors[1].factor === "PIN") {
            disabledFactors1.push("PIN");
        }
        else {
            while (disabledFactors.length > 0) {
                disabledFactors.pop();
                disabledFactors1.pop();
            }
        }
    }

    const [arr, setArr]: any = useState([]);

    Object.keys(factorOptions).forEach(factor => {
        arr.push(<Radio value={factor} disabled={disabledFactors.includes(factor)}>
            {factorOptions[factor]}
        </Radio>)
    })


    const [arr1, setArr1]: any = useState([]);

    Object.keys(factorOptions).forEach(factor => {
        arr1.push(<Radio value={factor} disabled={disabledFactors1.includes(factor)}>
            {factorOptions[factor]}
        </Radio>)
    })

    return (
        <Skeleton loading={loading}>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div>
                        <h6>Mechanism name</h6>
                        <span style={{ paddingRight: '20px' }}>
                            {
                                isEdit ?
                                    <input
                                        name="machanismName"
                                        type="text"
                                        defaultValue={displayDetails?.name}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            name: e.target.value
                                        })}
                                        style={{ width: "275px" }}
                                        className="form-control"
                                        placeholder="Enter Mechanism Name"
                                    /> : displayDetails.name
                            }
                        </span>
                    </div>
                    <div style={{ paddingRight: '50px' }}>
                    {displayDetails.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                    }
                    </div>
                </div>
                <br />

                <div className="row-container-3columns">
                    <div>
                        <h6>Default Challenge</h6>
                        <Radio.Group name="Default challenge" defaultValue={"PROXIMITY_CARD"}
                        >
                            <Radio value={"PROXIMITY_CARD"} disabled>Proximity Card</Radio>
                        </Radio.Group>
                    </div>

                    <div>
                        <h6>Tapout Action</h6>
                        <Radio.Group name="Tapout Action" defaultValue={displayDetails?.on_tap_out}
                            onChange={(e) => {
                                setEditData({
                                    ...editData,
                                    on_tap_out: e.target.value
                                })
                                //@ts-ignore
                            }} disabled={!isEdit} options={getTapoutOptions}
                        />
                    </div>

                    <div>
                        <h6>Reader Type</h6>
                        <Radio.Group name="Tapout Action" defaultValue={displayDetails?.reader_type}
                            onChange={(e) =>
                                setEditData((editData: any) => ({
                                    ...editData,
                                    reader_type: e.target.value
                                }))} disabled={!isEdit} options={getReaderOptions}
                        />
                    </div>
                </div>

                <div style={{ paddingBottom: '65px' }}></div>

                {displayDetails.challenge_factors.length === 2 ?
                    <div className="row-container">
                        <div className="card shadow mb-4" style={{ width: '90%' }}>
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-gray-900 text-lg" style={{ float: 'left', padding: '2px 5px' }}>Challenge 1</h6>
                            </div>
                            <div className="card-body">
                                <div>
                                    <Radio.Group defaultValue={displayDetails?.challenge_factors[1].factor}
                                        onChange={showDisabled}
                                        disabled={!isEdit} options={getFactorOptions}
                                    />
                                    {/* <Radio.Group defaultValue={"PASSWORD"}
                                        onChange={showDisabled} disabled={!isEdit}
                                    >
                                        <Space direction="vertical">
                                            {arr}
                                        </Space>
                                    </Radio.Group> */}
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4" style={{ width: '90%' }}>
                            <div className="card-header py-3" >
                                <h6 className="m-0 font-weight-bold text-gray-900 text-lg" style={{ float: 'left', padding: '2px 5px' }}>Challenge_2(Optional)</h6>
                            </div>
                            <div className="card-body">
                                <div>
                                    <Radio.Group defaultValue={displayDetails?.challenge_factors[0].factor}
                                        disabled={!isEdit} 
                                        onChange={showDisabled} options={getFactorOptions}
                                    />
                                    {/* <Radio.Group defaultValue={"PASSWORD"}
                                        onChange={showDisabled} disabled={!isEdit}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div> : <></>
                }

                {
                    isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                        <Button style={{ float: 'right', marginLeft: '10px' }}
                            onClick={handleCancelClick}>Cancel</Button>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={handleSaveClick}>Save</Button>
                    </div> : <></>
                }

                <div className='card-body' style={{ paddingRight: '30px' }}>
                    {/* <h6
                        className="font-weight-bold btn btn-primary"
                        style={{ float: 'right', padding: '3px 10px', marginRight: '10px', marginBottom: '0px' }}
                        onClick={updateMechanism}
                    >
                        Save
                    </h6> */}
                </div>
            </div>
        </Skeleton>
    );
}

export default Mechanism;
