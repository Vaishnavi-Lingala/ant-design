import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Divider, Input, Radio, Select, Skeleton } from "antd";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import TextArea from "antd/lib/input/TextArea";
import { policyDisplayNames, requiredFieldsErrorMsg, vdiPolicyInfoModel, vdiPolicyReqFields, VIRTUAL_DESKTOP_INTERFACE } from "../../constants";

function VDIPolicy(props: any) {
    const [loading, setLoading] = useState(true);
    const [vdiDisplayData, setVDIDisplayData] = useState({});
    const [vdiEditData, setVDIEditedData]: any = useState();
    const [groups, setGroups]: any = useState([]);
    const [fullGroups, setFullGroups]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [groupNames, setGroupNames]: any = useState([]);
    const [groupUids, setGroupUids]: any = useState([]);
    const [groupsChange, setGroupsChange]: any = useState([]);
    const [vdiTypeOptions, setVDITypeOptions] = useState([]);
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');
    const [groupType, setGroupType] = useState("");
    const [templates, setTemplates]: any = useState([]);
    const [typeTemplates, setTypeTemplates]: any = useState([]);
    const [templateName, setTemplateName] = useState("");
    const [vdiReqFieldsModel, setVdiReqFieldsModel]: any = useState({'name': '', 'groupType': '', 'kiosk_machine_groups': '', 'vdi_type': '', 'template': ''});

    useEffect(() => {
        Promise.all(([
            ApiService.get(ApiUrls.groups(accountId)),
            ApiService.get(ApiUrls.vdiTypeOptions(accountId)),
            ApiService.get(ApiUrls.templates(accountId)),
            ApiService.get(ApiUrls.globalPolicy(accountId, window.location.pathname.split('/')[3]))
        ]))
            .then(data => {
                for (var i = 0; i < data[0].length; i++) {
                    groups.push({
                        label: data[0][i].name,
                        value: data[0][i].uid,
                        type: data[0][i].type
                    })
                }
                setFullGroups(groups);
                var groupTypegroups: any = [];
                if (window.location.pathname.split('/').length !== 3) {
                    console.log(data[3].kiosk_machine_groups[0].type);
                    setGroupType(data[3].kiosk_machine_groups[0].type);
                    Object.keys(groups).map(index => {
                        if (groups[index]["type"] === data[3].kiosk_machine_groups[0].type) {
                            groupTypegroups.push(groups[index]);
                        }
                    })
                    console.log(groupTypegroups);
                    setGroups(groupTypegroups);
                }
                var object = {};
                for (var i = 0; i < data[0].length; i++) {
                    object[data[0][i].name] = data[0][i].uid
                }
                groupsChange.push(object);
                setGroupsChange(groupsChange);

                setVDITypeOptions(data[1]);

                console.log(data[2]);
                data[2].forEach(object => {
                    templates.push({
                        label: object.name,
                        value: object.uid,
                        type: object.template_type
                    })
                })
                setTemplates(templates);
                if (window.location.pathname.split('/').length !== 3) {
                    var vdiTypeTemplates: any = [];
                    Object.keys(templates).map(index => {
                        if (templates[index]["type"] === data[3].policy_req.template.template_type) {
                            vdiTypeTemplates.push(templates[index])
                        }
                    })
                    console.log(vdiTypeTemplates);
                    setTypeTemplates(vdiTypeTemplates);
                }

                console.log(data[3]);
                if (!data[3].errorSummary) {
                    setVDIEditedData(data[3]);
                    setVDIDisplayData(data[3]);
                    if (data[3].uid !== undefined) {
                        setTemplateName(data[3].policy_req?.template?.name);
                        Object.keys(data[3].kiosk_machine_groups).map(index => {
                            groupNames.push(data[3].kiosk_machine_groups[index].name);
                            groupUids.push(data[3].kiosk_machine_groups[index].uid);
                            setGroupType(data[3].kiosk_machine_groups[index].type);
                            setGroupUids(groupUids);
                            setGroupNames(groupNames)
                            console.log(groupUids);
                            console.log(groupNames);
                        });
                    }
                    setLoading(false);
                }
                else if (window.location.pathname.split('/').length === 3) {
                    setVDIDisplayData(props.policyDetails);
                    setVDIEditedData(props.policyDetails);
                    setIsEdit(true);
                    setLoading(false);
                }
                else {
                    console.log('else: ', data[3]);
                    openNotification('error', data[3].errorCauses.length !== 0 ? data[3].errorCauses[1].errorSummary : data[3].errorSummary);
                    history.push(`/global-policies/virtual-desktop-interface`);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoading(false);
            })
    }, [])

    function handleEditClick() {
        setIsEdit(!isEdit);
        setTemplateName(vdiDisplayData['policy_req']?.template?.name)
        setVDIEditedData({ ...vdiDisplayData });
    }

    function handleCancelClick() {
        setTemplateName(vdiDisplayData['policy_req']?.template?.name)
        setVDIEditedData({ ...vdiDisplayData });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateUserProvisioningPolicy();
    }

    function createUserProvisioningPolicy() {
        const error = validateVDIPolicy(vdiEditData);
        if (error) {
            openNotification(`error`, error)
        } else {
            props.handleOk(VIRTUAL_DESKTOP_INTERFACE, vdiEditData);
        }  
    }

    function setCancelClick() {
        props.handleCancel(VIRTUAL_DESKTOP_INTERFACE);
    }

    const validateVDIPolicy = (vdiPolicyData) => {
        let requiredFields:any = [];
        let fields: any = '';
        let errorMsg:string = '';
        vdiPolicyReqFields.forEach((eachField: any) => {
            if (eachField?.objectName !== undefined) {
                if (eachField.dataType === 'string') {
                    if (vdiPolicyData[eachField?.objectName][eachField?.field] === null || vdiPolicyData[eachField?.objectName][eachField?.field] === '') {
                        requiredFields.push(vdiPolicyInfoModel[eachField.field]);
                        setVdiReqFieldsModel((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    }  else {
                        setVdiReqFieldsModel((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                } else if (eachField.dataType === 'array') {
                    if (vdiPolicyData[eachField.field].length <= 0) {
                        requiredFields.push(vdiPolicyInfoModel[eachField.field]);
                        setVdiReqFieldsModel((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    } else {
                        setVdiReqFieldsModel((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                }
            } else if (eachField.dataType === 'string') {
                if (vdiPolicyData[eachField.field] === null || vdiPolicyData[eachField.field] === '') {
                    requiredFields.push(vdiPolicyInfoModel[eachField.field]);
                    setVdiReqFieldsModel((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setVdiReqFieldsModel((prevState) => ({
                        ...prevState,
                        [eachField.field]: ''
                    }));
                }
            } else if (eachField.dataType === 'array') {
                if (vdiPolicyData[eachField.field].length <= 0) {
                    requiredFields.push(vdiPolicyInfoModel[eachField.field]);
                    setVdiReqFieldsModel((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setVdiReqFieldsModel((prevState) => ({
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

    function updateUserProvisioningPolicy() {
        vdiEditData.kiosk_machine_groups = groupUids;
        const error = validateVDIPolicy(vdiEditData);
        console.log(vdiEditData);
        if (error) {
            openNotification(`error`, error);
        } else {
            if (typeof vdiEditData.policy_req?.template !== 'string') {
                vdiEditData.policy_req.template_id = vdiDisplayData['policy_req'].template.uid;
            }
            ApiService.put(ApiUrls.globalPolicy(accountId, vdiDisplayData['uid']), vdiEditData)
            .then(data => {
                if (!data.errorSummary) {
                    groupNames.length = 0;
                    setTemplateName(data.policy_req.template.name)
                    setVDIDisplayData({ ...vdiEditData });
                    openNotification('success', 'Successfully updated VDI Policy');
                    Object.keys(data.kiosk_machine_groups).map(index => {
                        groupNames.push(data.kiosk_machine_groups[index].name);
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
                openNotification('error', 'An Error has occured with updating VDI Policy');
            })
        }   
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
        vdiEditData.kiosk_machine_groups = value;
        console.log(vdiEditData.kiosk_machine_groups);
    }

    return <Skeleton loading={loading}>
        <div className={vdiDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
            <div className="row-policy-container">
                <div>
                </div>
                <div>
                    {vdiDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
                        {!isEdit ? 'Edit' : 'Cancel'}
                    </Button> : <></>
                    }
                </div>
                <div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
                    Policy Name<span className="mandatory">*</span>:
                </div>
                <div style={{ paddingTop: '20px' }}>
                    {isEdit ? <Input className="form-control"
                        style={{ width: "275px", borderColor: vdiReqFieldsModel?.name}}
                        onChange={(e) => setVDIEditedData({
                            ...vdiEditData,
                            name: e.target.value
                        })}
                        defaultValue={vdiDisplayData['name']}
                        placeholder='Enter a new policy name'
                    /> : vdiDisplayData['name']
                    }
                </div>

                <div className="content-policy-key-header">
                    Description:
                </div>
                <div>
                    {isEdit ? <TextArea className="form-control"
                        style={{ width: "275px" }}
                        onChange={(e) => setVDIEditedData({
                            ...vdiEditData,
                            description: e.target.value
                        })}
                        defaultValue={vdiDisplayData['description']}
                        placeholder='Enter policy description'
                    /> : vdiDisplayData['description']
                    }
                </div>

                <div className="content-policy-key-header">
                    Machine group type <span className="mandatory">*</span>:
                </div>
                <div>
                    <Radio.Group
                        defaultValue={groupType}
                        disabled={!isEdit}
                        onChange={(e) => {
                            vdiEditData.groupType = e.target.value
                            groupNames.length = 0
                            setGroupNames([]);
                            //@ts-ignore
                            // clearItems.current.clearValue();
                            // clearItems.value = [];
                            groupUids.length = 0;
                            setGroupType(e.target.value)
                            var groupTypegroups: any = [];
                            Object.keys(fullGroups).map(index => {
                                if (fullGroups[index]["type"] === e.target.value) {
                                    groupTypegroups.push(fullGroups[index])
                                }
                            })
                            setGroups(groupTypegroups);
                        }}
                    >
                        <Radio value={"STANDARD"}>
                            Standard
                        </Radio>
                        <br />
                        <Radio value={"KIOSK"}>
                            Kiosk
                        </Radio>
                        <br />
                        <Radio value={"THIN"}>
                            Thin
                        </Radio>
                    </Radio.Group>
                </div>

                <div className="content-policy-key-header">
                    Assigned to machine groups<span className="mandatory">*</span>:
                </div>
                <div>
                    {isEdit ?
                        <Select
                            id={"select"}
                            mode="multiple"
                            size={"large"}
                            // ref={clearItems}
                            placeholder={<div>Please select groups</div>}
                            defaultValue={vdiDisplayData['name'] !== "" ? groupNames : []}
                            onChange={handleGroups}
                            style={{ width: '275px' }}
                            className={vdiReqFieldsModel?.kiosk_machine_groups === 'red' ? 'select-mandatory' : ''}
                            options={groups}
                            filterOption={(input, option) =>
                                // @ts-ignore
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        /> : Object.keys(groupNames).map(name =>
                            <div style={{ display: 'inline-block', marginRight: '3px', paddingBottom: '3px' }}>
                                <Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>
                            </div>
                        )
                    }
                </div>

                <div className="content-policy-key-header">
                    Policy Type:
                </div>
                <div>
                    {policyDisplayNames[vdiDisplayData['policy_type']]}
                </div>
            </div>

            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

            <div className="row-policy-container">
                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    VDI Type<span className="mandatory">*</span>:
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    <Radio.Group
                        value={vdiEditData?.policy_req?.vdi_type}
                        disabled={!isEdit}
                        onChange={(e) => setVDIEditedData((state) => {
                            const { policy_req } = state;
                            // setVDIEditedData((state) => {
                            //     const {policy_req} = state
                            //     return {
                            //         ...vdiEditData,
                            //         policy_req: {
                            //             ...policy_req,
                            //             template: ""
                            //         }
                            //     }
                            // });
                            var vdiTypeTemplates: any = [];
                            Object.keys(templates).map(index => {
                                if (templates[index]["type"] === e.target.value) {
                                    vdiTypeTemplates.push(templates[index])
                                }
                            })
                            setTypeTemplates(vdiTypeTemplates);
                            return {
                                ...vdiEditData,
                                policy_req: {
                                    ...policy_req,
                                    vdi_type: e.target.value
                                }
                            }
                        })}
                    >
                        {
                            Object.keys(vdiTypeOptions).map(type => {
                                return <div key={type}>
                                    <Radio value={type}>
                                        {vdiTypeOptions[type]}
                                    </Radio>
                                    <br />
                                </div>
                            })
                        }
                    </Radio.Group>
                </div>

                <div className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>
                    Template<span className="mandatory">*</span> : 
                </div>
                <div style={{ padding: '12px 0 10px 0' }}>
                    {isEdit ?
                        <Select
                            size={"large"}
                            placeholder="Please select template"
                            value={templateName}
                            onChange={(value) => setVDIEditedData((state) => {
                                const { policy_req } = state
                                console.log(value);
                                return {
                                    ...vdiEditData,
                                    policy_req: {
                                        ...policy_req,
                                        template_id: value
                                    }
                                }
                            })}
                            options={typeTemplates}
                            style={{ width: '275px' }}
                            className={vdiReqFieldsModel?.template_id === 'red' ? 'select-mandatory' : ''}
                        />
                        : templateName
                    }
                </div>
            </div>
        </div>

        {
            vdiDisplayData['uid'] !== undefined ?
                (isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={setCancelClick}>Cancel</Button>
                    <Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
                        onClick={createUserProvisioningPolicy}>Create</Button></div>
        }
    </Skeleton >
}

export default VDIPolicy;
