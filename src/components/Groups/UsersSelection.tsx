import { useEffect, useState } from "react";
import {Table, Skeleton, Button, Modal, Col, Row, Typography, Input } from "antd";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

export default function UsersSelection(props: any) {

    const { Title } = Typography;
    const { Search } = Input;
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

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
		setUsersList(props.users)
	}, [])
    
    const handleOk = () => {
        props.handleOk(selectedRowKeys, props.action);
        setSelectedRowKeys([]);
    };

    const handleCancel = () => {
        setSelectedRowKeys([]);
        setUsersList([]);
        props.handleCancel(props.action);
    };

    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
      };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };

    const onSearch = searchText => {
        if (props.action === 'Add') {
            console.log('Search text: ', searchText);
            console.log('Length: ', searchText.length);
            setLoadingDetails(true);
            const params = {
                q : searchText
            }
            ApiService.get(ApiUrls.users, params).then(data => {
                console.log('Data: ', data)
                data.results.forEach(user => {
                    user.key = user.uid;
                })
                setUsersList(data.results);
                setLoadingDetails(false);
            })
        }
        
    }

    return(
        <>
            <Modal title={<Title level={2}>{props.action} Users</Title>} visible={true} onOk={handleOk} onCancel={handleCancel} width={1000}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                       {props.action}
                    </Button>
                ]}>
                <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                    <Search placeholder="Search for users by name or email" allowClear style={{ width: 400 }} 
                    onSearch={onSearch}
                    size="large"
                    enterButton/>
                </div>
                <Table
                    loading={loadingDetails}
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={usersList}   
                    rowSelection={rowSelection}
                    // bordered={true}
                    pagination={{ position: [] }}
                />
                    
            </Modal>
        </>
    )
}