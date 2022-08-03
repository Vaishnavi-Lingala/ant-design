import { useState, useEffect } from "react";
import { Button, Checkbox, Divider, Input, InputNumber, Radio, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import './Policies.css';
import ColorPicker from "../Controls/ColorPicker";
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_TEXT_COLOR } from "../../constants";

const PrivacyShieldPolicy = (props) => {
    useEffect(() => {});

    function handleColorSelection(field, color) {
        console.log(field + ': ', color);
    }

    return (
        <Skeleton loading={false}>
        <div className="content-container-policy">
            <div className="row-policy-container">
                <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                    <p>Policy Name<span className="mandatory">*</span> :</p>
                </div>
                <div style={{ paddingTop: '20px' }}>
                    <Input className="form-control" style={{ width: "308px" }}></Input>
                </div>

                <div className="content-policy-key-header">
                    Description:
                </div>
                <div>
                    <TextArea className="form-control"
                        style={{ width: "308px" }}/>
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
                    <Select className="form-control" style={{ width: "308px" }}></Select>
                </div>
            </div>
            <div className="row-font-selection-container">
                <div className="content-policy-key-header">
                    <p>Display name font<span className="mandatory">*</span> :</p>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Color</div>
                    <ColorPicker setFieldColor={handleColorSelection} field='displayName' defaultColor='#000000'></ColorPicker>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font</div>
                    <Select className="form-control" style={{ width: "200px" }}></Select>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font size</div>
                    <Input className="form-control" style={{ width: "100px" }}></Input>

                </div>
            </div>
            <div className="row-display-text">
                <div className="content-policy-key-header">
                    <p>Login status text<span className="mandatory">*</span> :</p>
                </div>
                <div>
                    <Input className="form-control"></Input>
                    <div>
                        <Checkbox></Checkbox> Set to default
                    </div>
                </div>
                
            </div>
            <div className="row-font-selection-container">
                <div className="content-policy-key-header">
                    <p>Login status font<span className="mandatory">*</span> :</p>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Color</div>
                    <ColorPicker setFieldColor={handleColorSelection} field='loginStatus' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font</div>
                    <Select className="form-control" style={{ width: "200px" }}></Select>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font size</div>
                    <Input className="form-control" style={{ width: "100px" }}></Input>

                </div>
            </div>    
                
            <div className="row-display-text">
                <div className="content-policy-key-header">
                    <p>Login prompt text<span className="mandatory">*</span> :</p>
                </div>
                <div>
                    <Input className="form-control"></Input>
                    <div>
                        <Checkbox></Checkbox> Set to default
                    </div>
                </div>
            </div>

            <div className="row-font-selection-container">
                <div className="content-policy-key-header">
                    <p>Login prompt font<span className="mandatory">*</span> :</p>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Color</div>
                    <ColorPicker setFieldColor={handleColorSelection} field='loginPrompt' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font</div>
                    <Select className="form-control" style={{ width: "200px" }}></Select>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font size</div>
                    <Input className="form-control" style={{ width: "100px" }}></Input>

                </div>
            </div>
            <div className="row-display-text">  
                <div className="content-policy-key-header">
                    <p>Logoff prompt text<span className="mandatory">*</span> :</p>
                </div>
                <div>
                    <Input className="form-control"></Input>
                    <div>
                        <Checkbox></Checkbox> Set to default
                    </div>
                </div>
            </div>
            <div className="row-font-selection-container">
                <div className="content-policy-key-header">
                    <p>Logoff prompt font<span className="mandatory">*</span> :</p>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Color</div>
                    <ColorPicker setFieldColor={handleColorSelection} field='logoffPrompt' defaultColor={DEFAULT_TEXT_COLOR}></ColorPicker>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font</div>
                    <Select className="form-control" style={{ width: "200px" }}></Select>
                </div>
                <div style={{ paddingTop: '5px' }}>
                    <div>Font size</div>
                    <Input className="form-control" style={{ width: "100px" }}></Input>

                </div>
            </div>
            <div className="row-policy-container">
                <div className="content-policy-key-header">
                    <p>Primary Shield backgound<span className="mandatory">*</span> :</p>
                </div>
                <div>
                    <div>Color</div>
                    <ColorPicker setFieldColor={handleColorSelection} field='primaryBackground' defaultColor={DEFAULT_BACKGROUND_COLOR}></ColorPicker>
                </div>
                <div className="content-policy-key-header">
                    <p>Primary Shield logo<span className="mandatory">*</span> :</p>
                </div>
                <div>
                    
                    
                </div>
            </div>
        </div>
        
        </Skeleton >
    );
}

export default PrivacyShieldPolicy;