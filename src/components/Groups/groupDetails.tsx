import { useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";

export default function GroupDetails(props: any) {

    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [users, setUsers] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { Title } = Typography;

    const columns = [
		{
			title: 'Name',
			dataIndex: 'user_name',
			width: '30%'
		},
        {
			title: 'Email',
			dataIndex: 'email',
			width: '40%'
		}
		
	];

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.get(ApiUrls.groupUsers(groupDetails.uid))
		.then(data => {
			console.log('Users: ', data);
            data.results.forEach(user => {
                user.key = user.uid;
            })
            setUsers(data.results);
			setLoadingDetails(false);
		})
	}, [])

    return(
        <>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div style={{ paddingTop: '20px' }}>
                        <h6>Group name</h6>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                            {groupDetails.name}
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        <h6>Status</h6>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {groupDetails.status}
                    </div>
                </div>
                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                <Skeleton loading={loadingDetails}>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large' onClick={showModal}>Add Users</Button>
					</div>
                    <Table
                            style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            dataSource={users}   
                            // bordered={true}
                            pagination={{ position: [] }}
                        />
                </Skeleton>
                <Modal title={<Title level={2}>Add Users</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1000}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ paddingTop: '20px' }}>
                                <h6>Not Members</h6>
                            </div>
                            <Table
                                style={{ border: '1px solid #D7D7DC' }}
                                showHeader={true}
                                columns={columns}
                                dataSource={[]}   
                                // bordered={true}
                                pagination={{ position: [] }}
                            />
                        </Col>
                        <Col span={12}>
                            <div style={{ paddingTop: '20px' }}>
                                <h6>Members</h6>
                            </div>
                            <Table
                                style={{ border: '1px solid #D7D7DC' }}
                                showHeader={true}
                                columns={columns}
                                dataSource={[]}   
                                // bordered={true}
                                pagination={{ position: [] }}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        </>
    )
}