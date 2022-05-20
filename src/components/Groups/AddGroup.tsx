import { useContext, useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export default function AddGroup(props: any) {

    const { Title } = Typography;
    const { TextArea } = Input;
    const [newGroup, setNewGroup] = useState({
        'name': '',
        'description': '',
        'type': props.type
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [toastList, setToastList] = useContext(StoreContext);

    const showModal = () => {
        setNewGroup({
            'name': '',
            'description': '',
            'type': props.type
        })
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setLoading(true);
        console.log('New group: ', newGroup);
        ApiService.post(ApiUrls.groups, newGroup).then(data => {
            if (!data.errorSummary) {
                console.log('Post group response: ', data);
                setLoading(false);
                setIsModalVisible(false);
                props.onGroupCreate();
                const response = showToast('success', 'Successfully added Group');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            }
            else {
                const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                console.log('response: ', response);
                setToastList([...toastList, response]);
                setLoading(false);
            }
        }, error => {
            console.error('Error: ', error);
            setLoading(false);
            const response = showToast('error', 'An Error has occured with adding Group');
            console.log('response: ', response);
            setToastList([...toastList, response]);
        })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                <Button type='primary' size='large' onClick={showModal}>Add New {props.type.slice(0, 1).toUpperCase() + props.type.slice(1).toLowerCase()} Group</Button>
            </div>
            <Modal title={<Title level={2}>Add Group</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={500}
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
                        <p style={{ fontWeight: 600, fontSize: 'medium', marginTop: '-5px' }}>Name:</p>
                    </Col>
                    <Col span={18}>
                        <span style={{ paddingRight: '20px' }}>

                            <Input
                                name="name"
                                type="text"
                                className="form-control"
                                onChange={(e) => setNewGroup({
                                    ...newGroup,
                                    name: e.target.value
                                })}
                                value={newGroup.name}
                            />

                        </span>
                    </Col>

                    <Col span={6}>
                        <p style={{ fontWeight: 600, fontSize: 'medium', marginTop: '-5px' }}>Description:</p>
                    </Col>
                    <Col span={18}>
                        <span style={{ paddingRight: '20px' }}>

                            <TextArea
                                name="description"
                                className="form-control"
                                onChange={(e) => setNewGroup({
                                    ...newGroup,
                                    description: e.target.value
                                })}
                                value={newGroup.description}
                            />

                        </span>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}