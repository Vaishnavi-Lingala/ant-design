import { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";
import UsersFiltersModal from "./UsersFilterModal";
import { requiredFieldsErrorMsg, userRequiredFields } from "../../constants";
import { userDataModel } from "../../constants";

export function AddUser(props) {
    const { Title } = Typography;
    const [newUser, setNewUser] = useState({
        'first_name': '',
        'last_name': '',
        'user_name': '',
        'email': '',
        'login_domain': '',
        'sam': '',
        'upn': '',
        'assignedGroups': null
    });
    const [loading, setLoading] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [domains, setDomains]: any = useState([]);
    const [groups, setGroups]: any = useState([]);
    const [selectedGroups, setSelectedGroups]: any = useState([]);
    const [samRequired, setSamRequired]: any = useState(true);
    const [upnRequired, setUpnRequired]: any = useState(true);
    const accountId = localStorage.getItem('accountId');
    const [requiredFieldsModel, setRequiredFieldsModel]: any = useState({});
    const showModal = () => {
        setNewUser({
            'first_name': '',
            'last_name': '',
            'user_name': '',
            'email': '',
            'login_domain': '',
            'sam': '',
            'upn': '',
            'assignedGroups': null
        })
        setIsModalVisible(true);
    };

    useEffect(() => {
        setRequiredFieldsModel({
            'first_name': '',
            'last_name': '',
            'user_name': '',
            'email': '',
            'login_domain': '',
            'sam': '',
            'upn': ''
        })
        Promise.all([ApiService.get(ApiUrls.domains(accountId)),
        ApiService.get(ApiUrls.groups(accountId))]).then(result => {
            if (!result[0].errorSummary) {
                console.log('Domains list ', JSON.stringify(result[0]));
                setIsModalVisible(false);
                setDomains(result[0]);
            } else {
                console.log(result[0]);
                openNotification('error', result[0].errorCauses.length !== 0 ? result[0].errorCauses[0].errorSummary : result[0].errorSummary);
            }
            if (!result[1].errorSummary) {
                setIsModalVisible(false);
                setGroups(result[1]);
            } else {
                console.log(result[1]);
                openNotification('error', result[1].errorCauses.length !== 0 ? result[1].errorCauses[0].errorSummary : result[1].errorSummary);
            }
        }).catch(error => {
            console.error(`Error in getting initial data: ${JSON.stringify(error)}`)
            openNotification(`error`, `Error in getting initial data: ${JSON.stringify(error)}`);
        }).finally(() => {
            setLoading(false);
        })
    }, []);

    const handleOk = () => {
        setLoading(true);
        console.log(newUser);
        let errorMsg = validateUserInfo(newUser);
        if (errorMsg) {
            setLoading(false);
            openNotification(`error`, errorMsg);
        } else {
            ApiService.post(ApiUrls.users(accountId), newUser).then(data => {
                if (!data.errorSummary) {
                    console.log('Post user response: ', JSON.stringify(data));
                    props.onUserCreate();
                    setIsModalVisible(false);
                }
                else {
                    console.log(data);
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }).catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with adding User');
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    const validateUserInfo = (newUser) => {
        let requiredFields: any = [];
        let errorMsg = ``;
        let fields = '';
        let updatedRequiredFields: any = [];
        let reqFields = JSON.parse(JSON.stringify(userRequiredFields));
        if (newUser.login_domain.toLowerCase() === 'workgroup') {
            const samIndex = reqFields.findIndex(eachField => eachField === 'sam');
            reqFields.splice(samIndex, 1);
            const upnIndex = reqFields.findIndex(eachField => eachField === 'upn');
            reqFields.splice(upnIndex, 1);
            updatedRequiredFields.push(...reqFields);
        } else {
            updatedRequiredFields.push(...userRequiredFields);
        }
        updatedRequiredFields.forEach(eachField => {
            if (newUser[eachField] === null || newUser[eachField] === '') {
                requiredFields.push(userDataModel[eachField]);
                setRequiredFieldsModel((prevState) => ({
                    ...prevState,
                    [eachField]: 'red'
                }));
            } else {
                setRequiredFieldsModel((prevState) => ({
                    ...prevState,
                    [eachField]: ''
                }));
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

    const applyAdvancedFilters = (filters) => {
        setAdvancedFilters(filters)
    };

    const resetFilters = () => {
        setAdvancedFilters({})
        props.getUsersByFilter({}, {});
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewUser({
            ...newUser,
            login_domain: ''
        })
        setSelectedGroups([]);
    };

    const onDomainChange = (value) => {
        console.log(`Selected value: ${value}`);
        setNewUser({
            ...newUser,
            login_domain: value
        })
        if (value.toLowerCase() === "workgroup") {
            setSamRequired(false);
            setUpnRequired(false);
        } else {
            setSamRequired(true);
            setUpnRequired(true);
        }
        console.log(samRequired);
        console.log(upnRequired);
    }

    return <>
        <div style={{ display: "flex", width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
            <div style={{ width: '72%' }}>
                <Button type="primary" size="large" onClick={showModal}>Add New User</Button>
            </div>
            <div style={{ paddingTop: '10px' }}>
                <UsersFiltersModal
                    getUsersByFilter={props.getUsersByFilter}
                    onFilterApply={applyAdvancedFilters}
                    onResetClick={resetFilters}
                />
            </div>
        </div>

        <Modal closeIcon={<Button icon={<CloseOutlined />}></Button>} title={<Title level={2}>Add User</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width='800px'
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Save
                </Button>
            ] }
        >
            <div className="content-container">
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Login Domain<span className="mandatory">*</span>:</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>
                        <Select style={{
                            width: "100%",
                        }}
                        className={requiredFieldsModel?.login_domain === 'red'?'select-mandatory': ''}
                            onChange={
                                onDomainChange
                            } value={newUser.login_domain}>
                            {
                                domains.map(eachDomain => {
                                    return <Select.Option value={eachDomain} key={eachDomain}> {eachDomain} </Select.Option>
                                })
                            }

                        </Select>
                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>First Name <span className="mandatory">*</span> :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>
                        <Input
                            style={{ borderColor: requiredFieldsModel?.first_name }}
                            name="firstName"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                first_name: e.target.value
                            })}
                            value={newUser.first_name}
                        />
                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Last Name<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>

                        <Input
                            style={{ borderColor: requiredFieldsModel?.last_name }}
                            name="lastName"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                last_name: e.target.value
                            })}
                            value={newUser.last_name}
                        />

                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Username<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>

                        <Input
                            style={{ borderColor: requiredFieldsModel?.user_name }}
                            name="username"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                user_name: e.target.value
                            })}
                            value={newUser.user_name}
                        />

                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Email<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>
                        <Input
                            style={{ borderColor: requiredFieldsModel?.email }}
                            name="email"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                email: e.target.value
                            })}
                            value={newUser.email}
                        />
                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>SAM{samRequired ? <span className="mandatory">*</span> : <></>} :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>
                        <Input
                            style={{ borderColor: requiredFieldsModel?.sam }}
                            name="sam"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                sam: e.target.value
                            })}
                            value={newUser.sam}
                        />

                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>UPN{upnRequired ? <span className="mandatory">*</span> : <></>} :</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>

                        <Input
                            style={{ borderColor: requiredFieldsModel?.upn }}
                            name="upn"
                            type="text"
                            className="form-control"
                            onChange={(e) => setNewUser({
                                ...newUser,
                                upn: e.target.value
                            })}
                            value={newUser.upn}
                        />
                    </span>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Select Group:</p>
                </Col>
                <Col span={12}>
                    <span style={{ paddingLeft: '80px', paddingRight: '20px' }}>
                        <Select
                            mode="multiple"
                            placeholder={<div>Please select group</div>}
                            onChange={(value) => {
                                console.log(`Selected value: ${value}`);
                                setNewUser({
                                    ...newUser,
                                    assignedGroups: value
                                })
                                setSelectedGroups(value)
                            }}
                            style={{ width: '100%' }}
                            value={selectedGroups}
                        >
                            {
                                groups.map(eachGroup => {
                                    return <Select.Option value={eachGroup.uid} key={eachGroup.uid}>
                                        {eachGroup.name}
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </span>
                </Col>
            </Row>
            </div>
           
        </Modal>
    </>
}

