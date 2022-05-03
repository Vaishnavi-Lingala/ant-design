import { useEffect, useState } from "react";
import {Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";

export default function UsersSelection(props: any) {

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

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    
    const handleOk = () => {
        props.handleOk(selectedRowKeys, props.action);
        setSelectedRowKeys([]);
    };

    const handleCancel = () => {
        setSelectedRowKeys([]);
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
                <Table
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={props.users}   
                    rowSelection={rowSelection}
                    // bordered={true}
                    pagination={{ position: [] }}
                />
                    
            </Modal>
        </>
    )
}