import { Button, Input, Radio, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { MechanismType } from "../../models/Data.models";

import './Mechanism.css'

import Apis from "../../Api.service";

function Mechanism(props: any) {
    const [displayDetails, setDisplayDetails] = useState<MechanismType>(props.mechanismDetails);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData]: any = useState(props.mechanismDetails);
    //@ts-ignore`
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [tapOutOptions, setTapOutOption]: any = useState({});
    const [readerOptions, setReaderOptions]: any = useState({});
    const [factorOptions, setFactorOptions]: any = useState({});
    const [render, setRender] = useState(false);
    const [disabledFactors]: any = useState([displayDetails.challenge_factors[1].factor]);
    const [disabledFactors1]: any = useState([displayDetails.challenge_factors[0].factor]);

    useEffect(() => {
        Apis.getMechanismOptions(accessToken)
            .then(data => {
                console.log(data);
                setTapOutOption(data.tap_out_options);
                setReaderOptions(data.readers);
            })

        Apis.getMechanismChallengeFactors(accessToken)
            .then(data => {
                console.log(data);
                setFactorOptions(data);
                setLoading(false);
            })

        if (displayDetails.uid === undefined) {
            setIsEdit(true);
        }

        if (disabledFactors.includes("NONE")) {
            disabledFactors.pop();
        }

        if (disabledFactors1.includes("NONE")) {
            disabledFactors1.pop();
        }
    }, [])

    function updateMechanism() {
        Apis.updateMechanismDetails(displayDetails.uid, editData, accessToken)
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
        setTimeout(() => {
            window.location.reload()
        }, 1000);
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
        Apis.createMechanism(editData, accessToken)
            .then(data => {
                console.log(data);
            })
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    }

    function setCancelClick() {
        window.location.reload();
    }

    return (
        <Skeleton loading={loading}>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div></div>
                    <div style={{ paddingRight: '50px', paddingBottom: '20px' }}>
                        {displayDetails.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                        }
                    </div>
                    <div>
                        <h6>Mechanism name</h6>
                    </div>
                    <div>
                        <span style={{ paddingRight: '20px' }}>
                            {isEdit ?
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
                                    defaultValue={displayDetails.name !== "" ? displayDetails.name : ""}
                                /> : displayDetails.name
                            }
                        </span>
                    </div>
                    <div>
                        <h6>Primary Challenge</h6>
                    </div>
                    <div>
                        <Radio.Group name="Primary challenge" defaultValue={"PROXIMITY_CARD"}>
                            <Radio value={"PROXIMITY_CARD"} disabled>Proximity Card</Radio>
                        </Radio.Group>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        <h6>Tapout Action</h6>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        <Radio.Group name="Tapout Action" defaultValue={displayDetails?.on_tap_out}
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
                    <div style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                        <h6>Reader Type</h6>
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


                    {displayDetails.challenge_factors.length === 2 ?
                        <>
                            <div className="card shadow mb-4" style={{ width: '90%' }}>
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-gray-900 text-lg" style={{ float: 'left', padding: '2px 5px' }}>Challenge 1</h6>
                                </div>
                                <div className="card-body">
                                    <Radio.Group defaultValue={disabledFactors !== disabledFactors1 ? displayDetails?.challenge_factors[0].factor : ""}
                                        disabled={!isEdit}
                                        onChange={(e) => {
                                            editData.challenge_factors[0].factor = e.target.value
                                            showDisabled(e, disabledFactors1)
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

                            <div className="card shadow mb-4" style={{ width: '90%' }}>
                                <div className="card-header py-3" >
                                    <h6 className="m-0 font-weight-bold text-gray-900 text-lg" style={{ float: 'left', padding: '2px 5px' }}>Challenge_2(Optional)</h6>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <Radio.Group defaultValue={disabledFactors !== disabledFactors1 ? displayDetails?.challenge_factors[1].factor : ""}
                                            disabled={!isEdit}
                                            onChange={(e) => {
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
                        </> : <></>}
                </div>
            </div>

            {displayDetails.uid !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={createMechanism}>create</Button></div>
            }
        </Skeleton>
    );
}

export default Mechanism;
