import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Divider, Row, Skeleton, Table } from "antd";
import Moment from 'moment';

import './GroupDetails.css';

import UsersSelection from "./UsersSelection";
import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";

export default function GroupDetails(props: any) {
    const [groupDetails, setGroupDetails] = useState({});
    const [users, setUsers] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);
    const history = useHistory();

    const columns = [
        {
			title: 'First Name',
			dataIndex: 'first_name'
		},
		{
			title: 'Last Name',
			dataIndex: 'last_name'
		},
		{
			title: 'Email',
			dataIndex: 'email'
		},
		{
			title: 'Username',
			dataIndex: 'user_name'
		},
		{
			title: 'Status',
			dataIndex: 'status'
		}
    ];

    const handleOk = (selectedUsers, action) => {
        console.log('Action: ', action);
        setLoadingDetails(true);
        if (action === 'Add') {
            ApiService.post(ApiUrls.groupUsers(groupDetails['uid']), selectedUsers).then(data => {
                if (!data.errorSummary) {
                    data.results.forEach(user => {
                        user.key = user.uid;
                    })
                    setUsers(data.results);
                    setTotalItems(data.total_items);
                    setAction('');
                    setLoadingDetails(false);
                    openNotification('success', 'Successfully added Group User');
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with adding Group User');
                setLoadingDetails(false);
            })
        } else if (action === 'Remove') {
            ApiService.delete(ApiUrls.groupUsers(groupDetails['uid']), selectedUsers).then(data => {
                if (!data.errorSummary) {
                    data.results.forEach(user => {
                        user.key = user.uid;
                    })
                    setUsers(data.results);
                    setTotalItems(data.total_items);
                    setAction('');
                    openNotification('success', 'Successfully removed Group User');
                    setLoadingDetails(false);
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with removing Group User');
                setLoadingDetails(false);
            })
        }

    };

    const handleCancel = (action) => {
        console.log('Action: ', action);
        setAction('');
    };

    useEffect(() => {
        setLoadingDetails(true);
        Promise.all(([
            ApiService.get(ApiUrls.groupUsers(window.location.pathname.split('/')[3]), { start: page, limit: pageSize }),
            ApiService.get(ApiUrls.group(window.location.pathname.split('/')[3]))
        ]))
            .then(data => {
                data[0].results.forEach(user => {
                    user.key = user.uid;
                })
                setUsers(data[0].results);
                console.log(data[0].results);
                setTotalItems(data[0].total_items);

                if (!data[1].errorSummary) {
                    console.log('GROUP_DETAILS: ', data[1]);
                    setGroupDetails(data[1]);
                    setLoadingDetails(false);
                }
                else {
                    openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses[0].errorSummary : data[1].errorSummary);
                    history.push('/groups/user');
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting details');
                setLoadingDetails(false);
            })
    }, [])


    const onUsersPageChange = async (page, pageSize) => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groupUsers(groupDetails['uid']), { start: page, limit: pageSize }).then(data => {
            data.results.forEach(user => {
                user.key = user.uid;
            })
            setUsers(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Group Users');
            setLoadingDetails(false);
        })
    }

    return (
        <>
            <div className="content-container rounded-grey-border">
                <Skeleton loading={loadingDetails}>
                    <div className="row-container">
                        <div className='group-content-header'>
                            {groupDetails['name']}
                        </div>
                        <>
                            <Button style={{ marginLeft: 'auto' }} onClick={() => {
                                history.push('/groups/user')
                            }}
                            >
                                Back
                            </Button>
                        </>
                    </div>
                    <div style={{ fontSize: 'medium' }}>
                        <b>Description:</b> {groupDetails['description']}
                    </div>
                    <div style={{ fontSize: 'medium' }}>
                    <b>Sourced by:</b> {groupDetails['sourced_by']}
                    </div>
                    <div style={{ fontSize: 'medium' }}>
                    <b>Created:</b> {Moment(groupDetails['created_ts']).format('MM/DD/YYYY')}
                    </div>
                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                        <Row>
                            <Col span={12}>
                                <Button type='primary' size='large' onClick={() => setAction('Add')}>Add Users</Button>
                            </Col>
                            <Col span={6} offset={6}>
                                <Button type='primary' size='large' onClick={() => setAction('Remove')}>Remove Users</Button>
                            </Col>
                        </Row>

                    </div>
                    <Table
                        style={{ border: '1px solid #D7D7DC' }}
                        showHeader={true}
                        columns={columns}
                        dataSource={users}
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
                </Skeleton>
                {action ? <UsersSelection groupId={groupDetails['uid']} action={action} handleCancel={handleCancel} handleOk={handleOk} /> : <></>}
            </div>
        </>
    )
}
