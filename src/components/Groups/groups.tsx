import { useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography } from 'antd';
import ApiService from "../../Api.service";
import GroupDetails from "./groupDetails";

export default function Groups() {

    const [groups, setGroups] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken

    const { TextArea } = Input;
    const { Title } = Typography;

    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { uid: any; }) => (
				<Button onClick={()=> getGroup(record.uid)}>
				  View
				</Button>
			)
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

    function getGroup(uid: any) {
		setLoadingDetails(true);
        ApiService.getGroupDetails(uid, accessToken)
            .then(data => {
                setGroupDetails(data);
                setLoadingDetails(false);
            })
	}

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.getGroups(accessToken)
		.then(data => {
			console.log('Groups: ', data);
            data.forEach(group => {
                group.key = group.uid;
            })
            setGroups(data);
			setLoadingDetails(false);
		})
	}, [])

    return(
        <>
            <div className='content-header'>
				Groups
				{groupDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setGroupDetails(undefined)}>Back</Button> : <></>}
			</div>
            <Skeleton loading={loadingDetails}>
                {groupDetails ? <GroupDetails groupDetails={groupDetails}/> : <>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large'  onClick={showModal}>Add New Group</Button>
					</div>
                    <Table
                        style={{ border: '1px solid #D7D7DC' }}
                        showHeader={true}
                        columns={columns}
                        dataSource={groups}   
                        // bordered={true}
                        pagination={{ position: [] }}
                    />
                </>
                }
            </Skeleton>
            <Modal title={<Title level={2}>Add Group</Title>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={500}>
                <Row gutter={16}>
                    <Col span={6}>
                        <h6>Name</h6>
                    </Col>
                    <Col span={18}>
                        <span style={{ paddingRight: '20px' }}>
                            
                            <Input
                                name="groupName"
                                type="text"
                                className="form-control"
                            /> 
                            
                        </span>
                    </Col>
                    <Col span={6}>
                        <h6>Description</h6>
                    </Col>
                    <Col span={18}>
                        <span style={{ paddingRight: '20px' }}>
                            
                            <TextArea
                                name="description"
                                className="form-control"
                            /> 
                            
                        </span>
                    </Col>
                </Row>
            </Modal>
        </>
    ) 
}