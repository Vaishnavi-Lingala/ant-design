import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils"

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
        ApiService.post(ApiUrls.users, newUser).then (data => {
            console.log('Post user response: ', JSON.stringify(data));
            props.onUserCreate();
        }).catch(error => {
            console.error(`Error in creating user: ${JSON.stringify(error)}`);
        }).finally(() => {
            setLoading(false);
            setIsModalVisible(false);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return <>
    <div style={{width: "100%", border: "1px solid #D7D7DC", borderBottom: "none", padding: "10px 10px 10px 25px", backgroundColor: "#f5f5f6"}}>
        <Button type="primary" size="large" onClick={showModal}>Add New User</Button>
    </div>
    <Modal title={<Title level={2}>Add User</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={500}
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
                        <h6>First Name</h6>
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
                        <h6>Last Name</h6>
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
                        <h6>Username</h6>
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
                        <h6>Email</h6>
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

