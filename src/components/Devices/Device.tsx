import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Checkbox, Input, Select, Skeleton } from "antd";

import './Devices.css';

import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service";
import TextArea from "antd/lib/input/TextArea";
import { deviceInfoModel, deviceReqFields, requiredFieldsErrorMsg } from "../../constants";

function Device(props: any) {
    const history = useHistory();
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displayDetails, setDisplayDetails] = useState({});
    const [editData, setEditData]: any = useState();
    const [deviceTypeOptions, setDeviceTypeOptions] = useState({});
    const [vendorOptions, setVendorOptions] = useState({});
    const [deviceReqFieldsForDisplay, setDeviceReqFieldsForDisplay]: any = useState({'device_name': '', 'device_type': '', 'vendor': '', 'serial_number': ''});
    const accountId = localStorage.getItem('accountId');

    function createDevice() {
        const error = validateDeviceData(editData);
        if (error) {
            openNotification(`error`, error);
        } else {
            props.handleOk(editData);
        }       
    }

    useEffect(() => {
        setLoading(true);
        Promise.all(([
            ApiService.get(ApiUrls.deviceOptions(accountId)),
            ApiService.get(ApiUrls.device(accountId, window.location.pathname.split('/')[2]))
        ]))
            .then(data => {
                console.log(data[0]);
                setDeviceTypeOptions(data[0].device_type);
                setVendorOptions(data[0].device_vendor);

                if (!data[1].errorSummary) {
                    console.log(data[1]);
                    setDisplayDetails(data[1]);
                    setEditData(data[1]);
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 2) {
                    setDisplayDetails(props.deviceDetails);
                    setEditData(props.deviceDetails);
                    setIsEdit(true);
                    setLoading(false)
                }
                else {
                    openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses.errorSummary : data[1].errorSummary);
                    history.push('/devices');
                }
            }, error => {
                openNotification('error', 'An Error has occured with Device details');
            })

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

    }, [])

    const validateDeviceData = (deviceData) => {
        let requiredFields:any = [];
        let fields: any = '';
        let errorMsg:string = '';
        deviceReqFields.forEach((eachField: any) => {
            if (eachField?.objectName !== undefined) {
                if (eachField.dataType === 'string') {
                    if (deviceData[eachField?.objectName][eachField?.field] === null || deviceData[eachField?.objectName][eachField?.field] === '') {
                        requiredFields.push(deviceInfoModel[eachField.field]);
                        setDeviceReqFieldsForDisplay((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    }  else {
                        setDeviceReqFieldsForDisplay((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                } else if (eachField.dataType === 'array') {
                    if (deviceData[eachField.field].length <= 0) {
                        requiredFields.push(deviceInfoModel[eachField.field]);
                        setDeviceReqFieldsForDisplay((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    } else {
                        setDeviceReqFieldsForDisplay((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                }
            } else if (eachField.dataType === 'string') {
                if (deviceData[eachField.field] === null || deviceData[eachField.field] === '') {
                    requiredFields.push(deviceInfoModel[eachField.field]);
                    setDeviceReqFieldsForDisplay((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setDeviceReqFieldsForDisplay((prevState) => ({
                        ...prevState,
                        [eachField.field]: ''
                    }));
                }
            } else if (eachField.dataType === 'array') {
                if (deviceData[eachField.field].length <= 0) {
                    requiredFields.push(deviceInfoModel[eachField.field]);
                    setDeviceReqFieldsForDisplay((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setDeviceReqFieldsForDisplay((prevState) => ({
                        ...prevState,
                        [eachField.field]: ''
                    }));
                }
            }
        })
        if (requiredFields.length) {
            requiredFields.forEach((each, index) => {
                if (index < requiredFields.length - 1) {
                    fields = `${fields} ${each},`
                } else {
                    fields = `${fields} ${each}`
                }
            })
            errorMsg = requiredFieldsErrorMsg + fields;
        } 
        return errorMsg;
    }

    function updateDevice() {
        console.log(editData);
        const error = validateDeviceData(editData);
        if (error) {
            openNotification(`error`, error);
        } else {
            ApiService.put(ApiUrls.device(accountId, displayDetails['uid']), editData)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    openNotification('success', 'Successfully updated Device');
                    setDisplayDetails(editData);
                    setIsEdit(false);
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with updating Device');
            })
        }      
    }

    function handleEditClick() {
        setIsEdit(!isEdit);
        setEditData({ ...displayDetails });
    }

    function handleCancelClick() {
        setEditData({ ...displayDetails });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateDevice();
    }

    function setCancelClick() {
        props.handleCancel();
    }

    return <>
        {window.location.pathname.split('/').length === 3 ?
            <div className='content-header'>
                Devices
                {displayDetails['uid'] !== undefined ?
                    <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                        history.push('/devices')
                    }}>Back</Button>
                    : <></>
                }
            </div> : <></>
        }

        <Skeleton loading={loading}>
            <div className="content-container rounded-grey-border">
                <div className="row-containers">
                    <div>
                        {/* {displayDetails['uid'] === undefined ? <></> :
                            <div className="device-content-heading" style={{ marginTop: '-10px' }}>Edit Device</div>
                        } */}
                    </div>
                    <div style={{ paddingRight: '50px', paddingBottom: '20px' }}>
                        {displayDetails['device_name'] !== "" ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button> : <></>
                        }
                    </div>

                    <div className="content-device-key-header">
                        <p>Device Name<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ?
                            <Input
                                name="deviceName"
                                type="text"
                                onChange={(e) => setEditData({
                                    ...editData,
                                    device_name: e.target.value
                                })}
                                style={{ width: "275px", borderColor: deviceReqFieldsForDisplay?.device_name }}
                                className="form-control"
                                placeholder="Enter device name"
                                defaultValue={displayDetails['device_name'] !== "" ? displayDetails['device_name'] : ""}
                            /> : displayDetails['device_name']
                        }
                    </div>

                    <div className="content-device-key-header">
                        <p>Device Type<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ?
                            <Select
                                size={"large"}
                                placeholder="Please select device type"
                                defaultValue={deviceTypeOptions[displayDetails['device_type']]}
                                onChange={(value) => setEditData({
                                    ...editData,
                                    device_type: value
                                })}
                                style={{ width: '275px'}}
                                className= {deviceReqFieldsForDisplay?.device_type === 'red' ? 'select-mandatory' : ''}
                            >
                                {
                                    Object.keys(deviceTypeOptions).map(device => {
                                        return <Select.Option key={device} value={device}>
                                            {deviceTypeOptions[device]}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                            : deviceTypeOptions[displayDetails['device_type']]
                        }
                    </div>
                    <div className="content-device-key-header">
                        <p>Vendor<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ?
                            <Select
                                size={"large"}
                                placeholder="Please select vendor type"
                                defaultValue={vendorOptions[displayDetails['vendor']]}
                                onChange={(value) => setEditData({
                                    ...editData,
                                    vendor: value
                                })}
                                style={{ width: '275px' }}
                                className= {deviceReqFieldsForDisplay?.vendor === 'red' ? 'select-mandatory' : ''}
                            >
                                {
                                    Object.keys(vendorOptions).map(vendor => {
                                        return <Select.Option key={vendor} value={vendor}>
                                            {vendorOptions[vendor]}
                                        </Select.Option>
                                    })
                                }
                            </Select> : vendorOptions[displayDetails['vendor']]
                        }
                    </div>
                    <div className="content-device-key-header">
                        Model:
                    </div>
                    <div>
                        {isEdit ?
                            <Input
                                name="model"
                                type="text"
                                onChange={(e) => setEditData({
                                    ...editData,
                                    model: e.target.value
                                })}
                                style={{ width: "275px" }}
                                className="form-control"
                                placeholder="Enter model"
                                defaultValue={displayDetails['device_name'] !== "" ? displayDetails['model'] : ""}
                            /> : displayDetails['model']
                        }
                    </div>
                    <div className="content-device-key-header">
                        <p>Serial Number<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ?
                            <Input
                                name="serialNumber"
                                type="text"
                                onChange={(e) => setEditData({
                                    ...editData,
                                    serial_number: e.target.value
                                })}
                                style={{ width: "275px", borderColor: deviceReqFieldsForDisplay?.serial_number }}
                                className="form-control"
                                placeholder="Enter serial number"
                                defaultValue={displayDetails['device_name'] !== "" ? displayDetails['serial_number'] : ""}
                            /> : displayDetails['serial_number']
                        }
                    </div>
                    <div className="content-device-key-header">
                        Blocked:
                    </div>
                    <div>
                        <Checkbox
                            checked={editData?.is_blocked}
                            onChange={(e) => {
                                setEditData({
                                    ...editData,
                                    is_blocked: e.target.checked
                                })
                            }}
                            disabled={!isEdit}
                        />
                    </div>
                    <div className="content-device-key-header">
                        Additional Information:
                    </div>
                    <div>
                        {isEdit ?
                            <TextArea
                                name="additional_info"
                                onChange={(e) => setEditData({
                                    ...editData,
                                    additional_info: e.target.value
                                })}
                                style={{ width: "275px" }}
                                className="form-control"
                                placeholder="Enter additional information"
                                defaultValue={displayDetails['device_name'] !== "" ? displayDetails['additional_info'] : ""}
                            /> : displayDetails['additional_info']
                        }
                    </div>
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
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createDevice}>Create</Button></div>
            }
        </Skeleton>
    </>
}

export default Device;
