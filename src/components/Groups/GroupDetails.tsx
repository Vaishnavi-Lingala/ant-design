import { useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";
import UsersSelection from "./UsersSelection";

export default function GroupDetails(props: any) {

    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [users, setUsers] = useState([]);
    const [usersForSelection, setUsersForSelection] = useState([]);
    
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');

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
    
    const handleOk = (selectedUsers, action) => {
        console.log('Action: ', action);
        if (action === 'Add') {
            ApiService.post(ApiUrls.groupUsers(groupDetails.uid), selectedUsers).then(data => {
                data.results.forEach(user => {
                    user.key = user.uid;
                })
                setUsers(data.results);
                setAction('');
            })
        } else if (action === 'Remove') {
            ApiService.delete(ApiUrls.groupUsers(groupDetails.uid), selectedUsers).then(data => {
                data.results.forEach(user => {
                    user.key = user.uid;
                })
                setUsers(data.results);
                setAction('');
            })
        }
        
    };

    const handleCancel = (action) => {
        console.log('Action: ', action);
        setAction('');
    };

    const addUsersInit = () => {
        ApiService.get(ApiUrls.users).then(data => {
            data.results.forEach(user => {
                user.key = user.uid;
            })
            setUsersForSelection(data.results);
            setAction('Add');
        })
    }

    const deleteUsersInit = () => {
        setUsersForSelection(users);
        setAction('Remove');
    }

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.get(ApiUrls.groupUsers(groupDetails.uid))
		.then(data => {
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
                </div>
                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                <Skeleton loading={loadingDetails}>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                        <Row>
                            <Col span={12}>
                                <Button type='primary' size='large' onClick={addUsersInit}>Add Users</Button>
                            </Col>
                            <Col span={6} offset={6}>
                                <Button type='primary' size='large' onClick={deleteUsersInit}>Remove Users</Button>
                            </Col>
                        </Row>
                            
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
                {action ? <UsersSelection action={action} users={usersForSelection} handleCancel={handleCancel} handleOk={handleOk}/> : <></>}
            </div>
        </>
    )
}