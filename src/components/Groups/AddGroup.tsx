import { useState } from "react"
import { Button, Col, Input, Modal, Row, Typography } from 'antd';
import { CloseOutlined } from "@ant-design/icons";

import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import GroupFiltersModal from "./GroupFilterModel";

export default function AddGroup(props: any) {
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { Title } = Typography;
    const { TextArea } = Input;
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [newGroup, setNewGroup] = useState({
        'name': '',
        'description': '',
        'type': props.type
    });

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
                openNotification('success', 'Successfully added Group');
            }
            else {
                openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                setLoading(false);
            }
        }, error => {
            console.error('Error: ', error);
            setLoading(false);
            openNotification('error', 'An error has occured with adding Group');
        })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const applyAdvancedFilters = (filters) => {
        setAdvancedFilters(filters)
    };

    const resetFilters = () => {
        setAdvancedFilters({})
        props.getGroupsByFilter({}, { group_type: props.type, start: 1, limit: 10 });
    };

    return (
        <>
            <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6', display: 'flex' }}>
                <div style={{ width: '75%' }}>
                    <Button type='primary' size='large' onClick={showModal}>Add New {props.type.slice(0, 1).toUpperCase() + props.type.slice(1).toLowerCase()} Group</Button>
                </div>
                <div style={{paddingTop: '10px'}}>
                    <GroupFiltersModal
                        type={props.type}
                        getGroups={props.getGroupsByFilter}
                        onFilterApply={applyAdvancedFilters}
                        onResetClick={resetFilters}
                    />
                </div>
            </div>
            <Modal closeIcon={<Button icon={<CloseOutlined />}></Button>} title={<Title level={2}>Add Group</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={500}
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
