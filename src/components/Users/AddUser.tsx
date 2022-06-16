import { useState } from "react";
import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";

export function AddUser(props) {
    const { Title } = Typography;
    const [newUser, setNewUser] = useState({
        'first_name': '',
        'last_name': '',
        'user_name': '',
        'email': '',
        'login_domain': ''
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setNewUser({
            'first_name': '',
            'last_name': '',
            'user_name': '',
            'email': '',
            'login_domain': ''
        })
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setLoading(true);
        newUser.login_domain = 'WORK_GROUP';
        console.log(newUser);
        ApiService.post(ApiUrls.users, newUser).then(data => {
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
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return <>
        <div style={{ width: "100%", border: "1px solid #D7D7DC", borderBottom: "none", padding: "10px 10px 10px 25px", backgroundColor: "#f5f5f6" }}>
            <Button type="primary" size="large" onClick={showModal}>Add New User</Button>
        </div>
        <Modal closeIcon={<Button icon={<CloseOutlined />}></Button>} title={<Title level={2}>Add User</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={500}
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
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>First Name:</p>
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
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Last Name:</p>
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
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Username:</p>
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
                    <p style={{ fontWeight: 600, fontSize: 'medium' }}>Email:</p>
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
            </Row>
        </Modal>
    </>
}

