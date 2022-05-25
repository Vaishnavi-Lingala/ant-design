import { useContext, useEffect, useState } from "react";
import { Table, Button, Modal, Typography, Input } from "antd";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

import { openNotification } from "../Layout/Notification";

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
    const [searchText, setSearchText] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);

    useEffect(() => {
        if (props.action === 'Add') {
            getGroupNotMembers(props.groupId);
        }
        if (props.action === 'Remove') {
            getGroupMembers(props.groupId);
        }
    }, [])

    const handleOk = () => {
        props.handleOk(selectedRowKeys, props.action);
        setSelectedRowKeys([]);
        setTotalItems(0);
        setSearchText('');
    };

    const handleCancel = () => {
        setSelectedRowKeys([]);
        setUsersList([]);
        setTotalItems(0);
        setSearchText('');
        props.handleCancel(props.action);
    };

    function getGroupMembers(groupId, params = {}) {
        ApiService.get(ApiUrls.groupUsers(groupId), params).then(data => {
            console.log('Remove users search data: ', data);
            data.results.forEach(user => {
                user.key = user.uid;
            })
            setUsersList(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Group Users');
            setLoadingDetails(false);
        })
    }

    function getGroupNotMembers(groupId, params = {}) {
        ApiService.get(ApiUrls.usersNotInGroup(groupId), params).then(data => {
            console.log('Add users search data: ', data)
            data.results.forEach(user => {
                user.key = user.uid;
            })
            setUsersList(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Users not in Group');
            setLoadingDetails(false);
        })
    }

    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onSearch = text => {
        console.log('Search action: ', props.action);
        setLoadingDetails(true);
        setSearchText(text)
        setPage(1);
        const params = {
            q: text
        }
        if (props.action === 'Add') {
            getGroupNotMembers(props.groupId, params);
        }
        if (props.action === 'Remove') {
            getGroupMembers(props.groupId, params);
        }

    }

    const onUsersPageChange = async (page, pageSize) => {
        setLoadingDetails(true);
        const params = {
            q: searchText,
            start: page,
            limit: pageSize
        }
        if (props.action === 'Add') {
            getGroupNotMembers(props.groupId, params);
        }
        if (props.action === 'Remove') {
            getGroupMembers(props.groupId, params);
        }

    }


    return (
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
                        enterButton />
                </div>
                <Table
                    loading={loadingDetails}
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={usersList}
                    rowSelection={rowSelection}
                    // bordered={true}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalItems,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                            onUsersPageChange(page, pageSize);
                        }
                    }}
                />

            </Modal>
        </>
    )
}