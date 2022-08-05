import { useState, useEffect } from "react";
import { Button, Checkbox, Divider, Input, InputNumber, Radio, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import './Policies.css';
import ColorPicker from "../Controls/ColorPicker";
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_TEXT_COLOR } from "../../constants";

const PrivacyShieldPolicy = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [fontOptions, setFontOptions] = useState({
        "ARIAL": "Arial",
        "HELVETICA": "Helvetica",
        "TIMES_NEW_ROMAN": "Times New Roman",
        "TIMES": "Times",
        "COURIER_NEW": "Courier New",
        "COURIER": "Courier"
    })

    useEffect(() => { });

    function handleEditClick() {
        setIsEdit(!isEdit);
    }

    function handleColorSelection(field, color) {
        console.log(field + ': ', color);
    }

    return (
        <Skeleton loading={false}>
            <div className="content-container-policy">
                <div className="row-policy-container">
                    <div>

                    </div>
                    <div>
                        <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            {!isEdit ? 'Edit' : 'Cancel'}
                        </Button>
                    </div>
                    <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                        <p>Policy Name<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {
                            isEdit ?
                                <Input className="form-control" style={{ width: "308px" }} /> :
                                <>Privacy Shield policy</>
                        }
                    </div>

                    <div className="content-policy-key-header">
                        Description:
                    </div>
                    <div>
                        {
                            isEdit ? <TextArea className="form-control"
                                style={{ width: "308px" }} /> :
                                <>This is a Privacy shield policy</>
                        }
                    </div>
                </div>

                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                <div style={{ padding: '0 0 20px 0' }}>
                    On the privacy screen show the following
                </div>

                <div className="row-display-text">
                    <div className="content-policy-key-header">
                        <p>Display name format<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {
                            isEdit ? <Select className="form-control" style={{ width: "308px" }}
                                placeholder={"Please select display name format"}
                            /> : <>TecTango</>
                        }
                    </div>
                </div>
                <div className="row-font-selection-container">
                    <div className="content-policy-key-header">
                        <p>Display name font<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Color</div>
                        <ColorPicker disabled={isEdit} setFieldColor={handleColorSelection} field='displayName' defaultColor='#000000'></ColorPicker>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font</div>
                        {isEdit ?
                            <Select className="form-control" style={{ width: "170px" }}
                                placeholder={"Please select font"}
                            >
                                {
                                    Object.keys(fontOptions).map(key => {
                                        return <Select.Option key={key} value={key}>
                                            {fontOptions[key]}
                                        </Select.Option>
                                    })
                                }
                            </Select> : <>Arial</>
                        }
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font size</div>
                        {isEdit ?
                            <Input className="form-control" style={{ width: "100px" }} /> :
                            <>10</>
                        }
                    </div>
                </div>
                <div className="row-display-text">
                    <div className="content-policy-key-header">
                        <p>Login status text<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ? <Input className="form-control" /> : <>Active</>}
                        <div>
                            <Checkbox disabled={!isEdit}></Checkbox> Set to default
                        </div>
                    </div>

                </div>
                <div className="row-font-selection-container">
                    <div className="content-policy-key-header">
                        <p>Login status font<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Color</div>
                        <ColorPicker disabled={isEdit} setFieldColor={handleColorSelection} field='loginStatus' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font</div>
                        {
                            isEdit ?
                                <Select className="form-control" style={{ width: "170px" }}
                                    placeholder={"Please select font"}
                                >
                                    {
                                        Object.keys(fontOptions).map(key => {
                                            return <Select.Option key={key} value={key}>
                                                {fontOptions[key]}
                                            </Select.Option>
                                        })
                                    }
                                </Select> :
                                <>Arial</>
                        }
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font size</div>
                        {
                            isEdit ?
                                <Input className="form-control" style={{ width: "100px" }} /> :
                                <>10</>
                        }
                    </div>
                </div>

                <div className="row-display-text">
                    <div className="content-policy-key-header">
                        <p>Login prompt text<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ? <Input className="form-control" /> : <>Logged In</>}
                        <div>
                            <Checkbox disabled={!isEdit}></Checkbox> Set to default
                        </div>
                    </div>
                </div>

                <div className="row-font-selection-container">
                    <div className="content-policy-key-header">
                        <p>Login prompt font<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Color</div>
                        <ColorPicker disabled={isEdit} setFieldColor={handleColorSelection} field='loginPrompt' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font</div>
                        {
                            isEdit ?
                                <Select className="form-control" style={{ width: "170px" }}
                                    placeholder={"Please select font"}
                                >
                                    {
                                        Object.keys(fontOptions).map(key => {
                                            return <Select.Option key={key} value={key}>
                                                {fontOptions[key]}
                                            </Select.Option>
                                        })
                                    }
                                </Select> :
                                <>Arial</>
                        }
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font size</div>
                        {isEdit ? <Input className="form-control" style={{ width: "100px" }} /> : <>10</>}
                    </div>
                </div>
                <div className="row-display-text">
                    <div className="content-policy-key-header">
                        <p>Logoff prompt text<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ? <Input className="form-control" /> : <>Logged off</>}
                        <div>
                            <Checkbox disabled={!isEdit}></Checkbox> Set to default
                        </div>
                    </div>
                </div>
                <div className="row-font-selection-container">
                    <div className="content-policy-key-header">
                        <p>Logoff prompt font<span className="mandatory">*</span> :</p>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Color</div>
                        <ColorPicker disabled={isEdit} setFieldColor={handleColorSelection} field='logoffPrompt' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font</div>
                        {
                            isEdit ?
                                <Select className="form-control" style={{ width: "170px" }}
                                    placeholder={"Please select font"}
                                >
                                    {
                                        Object.keys(fontOptions).map(key => {
                                            return <Select.Option key={key} value={key}>
                                                {fontOptions[key]}
                                            </Select.Option>
                                        })
                                    }
                                </Select> :
                                <>Arial</>
                        }
                    </div>
                    <div style={{ paddingTop: '5px' }}>
                        <div>Font size</div>
                        {isEdit ? <Input className="form-control" style={{ width: "100px" }} /> : <>10</>}
                    </div>
                </div>
                <div className="row-policy-container">
                    <div className="content-policy-key-header">
                        <p>Primary Shield backgound<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        <div>Color</div>
                        <ColorPicker disabled={isEdit} setFieldColor={handleColorSelection} field='primaryBackground' defaultColor={DEFAULT_BACKGROUND_COLOR}></ColorPicker>
                    </div>
                    <div className="content-policy-key-header">
                        <p>Primary Shield logo<span className="mandatory">*</span> :</p>
                    </div>
                    <div>
                        {isEdit ? <Input /> : <>Nothing</>}
                    </div>
                </div>
            </div>

        </Skeleton >
    );
}

export default PrivacyShieldPolicy;