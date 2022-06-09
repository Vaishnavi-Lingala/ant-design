import { useEffect, useState } from "react"
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";
import { useHistory } from "react-router-dom";
import Moment from 'moment';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import MachinesSelection from "./MachinesSelection";
import './MachineGroupDetails.css';
import { openNotification } from "../Layout/Notification";

export default function MachineGroupDetails(props: any) {
    const [groupDetails, setGroupDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');
    const [machines, setMachines] = useState([]);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);
    const history = useHistory();
    const columns = [
        {
            title: 'Machine name',
            dataIndex: 'machine_name',
            width: '25%'
        },
        {
            title: 'MAC',
            dataIndex: 'mac_address',
            width: '25%'
        },
        {
            title: 'Last Known IP',
            dataIndex: 'local_ip',
            width: '25%'
        },
        {
            title: 'OS version',
            dataIndex: 'os',
            width: '25%'
        }

    ];

    useEffect(() => {
        setLoadingDetails(true);
        Promise.all(([
            ApiService.get(ApiUrls.groupMachines(window.location.pathname.split('/')[3])),
            ApiService.get(ApiUrls.group(window.location.pathname.split('/')[3]))
        ]))
            .then(data => {
                console.log('Group machines data: ', data[0]);
                data[0].results.forEach(user => {
                    user.key = user.uid;
                })
                setMachines(data[0].results);
                setTotalItems(data[0].total_items);

                if (!data[1].errorSummary) {
                    console.log('GROUP_DETAILS: ', data[1]);
                    setGroupDetails(data[1]);
                    setLoadingDetails(false);
                }
                else {
                    openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses[0].errorSummary : data[1].errorSummary);
                    history.push('/groups/' + window.location.pathname.split('/')[2]);
                }
                setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting details');
                setLoadingDetails(false);
            })
    }, [])

    const onMachinesPageChange = async (page, pageSize) => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groupMachines(groupDetails['uid']), { start: page, limit: pageSize }).then(data => {
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setMachines(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Machines');
            setLoadingDetails(false);
        })
    }

    const handleOk = (selectedUsers, action) => {
        console.log('Action: ', action);
        setLoadingDetails(true);
        ApiService.post(ApiUrls.groupMachines(groupDetails['uid']), selectedUsers).then(data => {
            if (!data.errorSummary) {
                if (data.results !== undefined) {
                    data.results.forEach(machine => {
                        machine.key = machine.uid;
                    })
                    setMachines(data.results);
                    setTotalItems(data.total_items);
                    setAction('');
                }
                openNotification('success', 'Successfully added Group Machines');
                setLoadingDetails(false);
            }
            else {
                openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
            }
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with adding Group Machines');
            setLoadingDetails(false);
        })
    };

    const handleCancel = (action) => {
        console.log('Action: ', action);
        setAction('');
    };


    return (
        <>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div className='content-header'>
                        {groupDetails['name']}
                    </div>
                    <Button style={{ marginLeft: 'auto' }} onClick={() => {
                        history.push('/groups/' + window.location.pathname.split('/')[2]);
                    }}
                    >
                        Back
                    </Button>
                </div>
                <div style={{ fontWeight: 600, fontSize: 'medium' }}>
                    Created: {Moment(groupDetails['created_ts']).format('MM/DD/YYYY')}
                </div>
                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                <Skeleton loading={loadingDetails}>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                        <Row>
                            <Col span={12}>
                                <Button type='primary' size='large' onClick={() => setAction('Add')}>Add Machines</Button>
                            </Col>
                        </Row>

                    </div>
                    <Table
                        style={{ border: '1px solid #D7D7DC' }}
                        showHeader={true}
                        columns={columns}
                        dataSource={machines}
                        // bordered={true}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: totalItems,
                            onChange: (page, pageSize) => {
                                setPage(page);
                                setPageSize(pageSize);
                                onMachinesPageChange(page, pageSize);
                            }
                        }}
                    />
                </Skeleton>
                {action ? <MachinesSelection groupId={groupDetails['uid']} action={action} handleOk={handleOk} handleCancel={handleCancel} /> : <></>}
            </div>
        </>
    )
}