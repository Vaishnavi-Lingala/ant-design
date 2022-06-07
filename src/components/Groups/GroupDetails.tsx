import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";
import UsersSelection from "./UsersSelection";
import Moment from 'moment';
import { useHistory } from "react-router-dom";
import './GroupDetails.css';

import { openNotification } from "../Layout/Notification";

export default function GroupDetails(props: any) {

    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [users, setUsers] = useState([]);

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);
    const history = useHistory();
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
        setLoadingDetails(true);
        if (action === 'Add') {
            ApiService.post(ApiUrls.groupUsers(groupDetails.uid), selectedUsers).then(data => {
                if(!data.errorSummary){
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
            ApiService.delete(ApiUrls.groupUsers(groupDetails.uid), selectedUsers).then(data => {
                if(!data.errorSummary){
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
        ApiService.get(ApiUrls.groupUsers(groupDetails.uid), { start: page, limit: pageSize })
            .then(data => {
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
    }, [])


    const onUsersPageChange = async (page, pageSize) => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groupUsers(groupDetails.uid), { start: page, limit: pageSize }).then(data => {
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
                <div className="row-container">

                    <div className='content-header'>
                        {groupDetails.name}
                    </div>
                    <Button style={{ marginLeft: 'auto' }} onClick={() => {
                        history.goBack()
                        props.clearGroupDetails()
                    }}
                    >
                        Back
                    </Button>

                </div>
                <div style={{ fontWeight: 600, fontSize: 'medium'}}>
                    Created: {Moment(groupDetails.created_ts).format('MM/DD/YYYY')}
                </div>
                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                <Skeleton loading={loadingDetails}>
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
                {action ? <UsersSelection groupId={groupDetails.uid} action={action} handleCancel={handleCancel} handleOk={handleOk} /> : <></>}
            </div>
        </>
    )
}