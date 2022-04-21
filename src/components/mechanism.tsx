import { Button, Dropdown, Input, Radio, Select, Skeleton, Space } from "antd";
import { useState } from "react";
import { MechanismType } from "../models/Data.models";

import './Mechanism.css'

import Apis from "../Api.service";

function Mechanism(props: any) {
    const [displayDetails, setDisplayDetails] = useState<MechanismType>(props.mechanismDetails);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData]: any = useState(props.mechanismDetails);
    const password_grace_period = {
        "TWO_HOURS": "2 hours",
        "FOUR_HOURS": "4 hours",
        "SIX_HOURS": "6 hours",
        "EIGHT_HOURS": "8 hours",
        "TWELVE_HOURS": "12 hours",
        "DO_NOT_PROMPT": "Do not prompt",
        "ALWAYS_PROMPT": "Always prompt",
    }
    
    function updateMechanism() {
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
                //@ts-ignore
                'X-CREDENTI-ACCESS-TOKEN': JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
            },
            body: JSON.stringify({
                ...editData
            })
        }

        Apis.updateMechanismDetails(displayDetails.uid, requestOptions)
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
                    <div style={{paddingRight: '50px'}}>
                        <Button style={{ float: 'right'}} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button>
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
                            }} disabled={!isEdit}
                        >
                            <Space direction="vertical">
                                <Radio value={"LOCK"}>Lock</Radio>
                                <Radio value={"SIGN_OUT"}>Sign out</Radio>
                                <Radio value={"SIGN_OUT_ALL_USERS"}>Sign out All Users</Radio>
                            </Space>
                        </Radio.Group>
                    </div>

                    <div>
                        <h6>Reader Type</h6>
                        <Radio.Group name="Tapout Action" defaultValue={displayDetails?.reader_type}
                            onChange={(e) =>
                                setEditData((editData: any) => ({
                                    ...editData,
                                    reader_type: e.target.value
                                }))} disabled={!isEdit}
                        >
                            <Space direction="vertical">
                                <Radio value={"PCSCREADER"}>PC/SC Readers</Radio>
                                <Radio value={"PCPROXREADER"}>rf IDEAS</Radio>
                            </Space>
                        </Radio.Group>
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
                                        disabled={!isEdit}
                                    >
                                        <Space direction="vertical">
                                            <Radio value={"PASSWORD"}>Password</Radio>
                                            <Radio value={"PIN"}>Pin</Radio>
                                            <Radio value={"OKTA_MFA"}>Okta MFA</Radio>
                                            <Radio value={"None"}>None</Radio>
                                        </Space>
                                    </Radio.Group>
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
                                    >
                                        <Space direction="vertical">
                                            <Radio value={"PASSWORD"}>Password</Radio>
                                            <Radio value={"PIN"}>Pin</Radio>
                                            <Radio value={"OKTA_MFA"}>Okta MFA</Radio>
                                            <Radio value={"None"}>None</Radio>

                                        </Space>
                                    </Radio.Group>
                                    <br />
                                    <br />
                                    {/* <h6>Grace period</h6>

                                    {isEdit ? <Select defaultValue={displayDetails?.challenge_factors[0].password_grace_period}
                                        onChange={(val) => { editData.challenge_factors[0].password_grace_period = val }} style={{ width: 200 }}
                                    >
                                        <Select.Option value="TWO_HOURS">2 hours</Select.Option>
                                        <Select.Option value="FOUR_HOURS">4 hours</Select.Option>
                                        <Select.Option value="SIX_HOURS">6 hours</Select.Option>
                                        <Select.Option value="EIGHT_HOURS">8 hours</Select.Option>
                                        <Select.Option value="TWELVE_HOURS">12 hours</Select.Option>
                                        <Select.Option value="DO_NOT_PROMPT">Do not prompt</Select.Option>
                                        <Select.Option value="ALWAYS_PROMPT">Always prompt</Select.Option>
                                    </Select> : //@ts-ignore
                                        password_grace_period[displayDetails.challenge_factors[0].password_grace_period.toString()]   
                                    } */}
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
