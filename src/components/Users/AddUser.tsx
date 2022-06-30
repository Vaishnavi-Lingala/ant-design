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
        'upn': ''
    });
    const [loading, setLoading] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [domains, setDomains]: any = useState([]);
    const accountId = localStorage.getItem('accountId');

    const showModal = () => {
        setNewUser({
            'first_name': '',
            'last_name': '',
            'user_name': '',
            'email': '',
            'login_domain': '',
            'sam': '',
            'upn': ''
        })
        setIsModalVisible(true);
    };

    useEffect(() => {
        getDomains();
    }, []);

    const getDomains = async () => {
        setLoading(true);
        let data = await ApiService.get(ApiUrls.domains(accountId)).catch(error => {
            openNotification(`error`, `Error in getting domains: ${JSON.stringify(error)}`);
        }).finally(() => {
            setLoading(false);
        });
        if (!data.errorSummary) {
            console.log('Domains list ', JSON.stringify(data));
            setIsModalVisible(false);
        }
        else {
            console.log(data);
            openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
        }
        setDomains(data);
    }

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
        let requiredFields:any = [];
        let errorMsg = ``;
        let fields = '';
        userRequiredFields.forEach(eachField => {
            if (newUser[eachField] === null || newUser[eachField] === '') {
                requiredFields.push(userDataModel[eachField]);
            }
        })
        if (requiredFields.length) {
            requiredFields.forEach((each, index) => {
                if (index < requiredFields.length-1 ) {
                    fields = `${fields} ${each},`
                } else {
                    fields = `${fields} ${each}`
                }
            })
            errorMsg = requiredFieldsErrorMsg+fields;
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
    };

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
            ]}
        >
            <Row gutter={16}>
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>First Name<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Input
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
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Last Name<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Input
                            name="lasttName"
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

                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Username<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Input
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

                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Email<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>
                        <Input
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
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>SAM<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Input
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
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>UPN<span className="mandatory">*</span> :</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Input
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
                <Col span={6}>
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Login Domain:</p>
                </Col>
                <Col span={18}>
                    <span style={{ paddingRight: '20px' }}>

                        <Select style={{
                            width: 120,
                        }} onChange={(value) => {
                            console.log(`Selected value: ${value}`);
                            setNewUser({
                                ...newUser,
                                login_domain: value
                            })
                        }}>
                            {
                                domains.map(eachDomain => {
                                    return <Select.Option value={eachDomain} key={eachDomain}> {eachDomain} </Select.Option>
                                })
                            }

                        </Select>

                    </span>
                </Col>
            </Row>
        </Modal>
    </>
}

