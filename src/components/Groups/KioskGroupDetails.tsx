import { useContext, useEffect, useState } from "react"
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import Moment from 'moment';
import MachinesSelection from "./MachinesSelection";
import { useHistory } from "react-router-dom";

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export default function KioskGroupDetails(props: any) {
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');
    const [machines, setMachines] = useState([]);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);
    const [toastList, setToastList] = useContext(StoreContext);
    const history = useHistory();
    const columns = [
        {
            title: 'Machine name',
            dataIndex: 'machine_name',
            width: '25%'
        },
        {
            title: 'Mac Address',
            dataIndex: 'mac_address',
            width: '25%'
        },
        {
            title: 'Last Know IP Address',
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
        ApiService.get(ApiUrls.groupMachines(groupDetails.uid))
            .then(data => {
                console.log('Group machines data: ', data);
                data.results.forEach(user => {
                    user.key = user.uid;
                })
                setMachines(data.results);
                setTotalItems(data.total_items);
                setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                setLoadingDetails(false);
                const response = showToast('error', 'An Error has occured with getting Machines');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }, [])

    const onMachinesPageChange = async (page, pageSize) => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groupMachines(groupDetails.uid), { start: page, limit: pageSize }).then(data => {
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setMachines(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            setLoadingDetails(false);
            const response = showToast('error', 'An Error has occured with getting Machines');
            console.log('response: ', response);
            setToastList([...toastList, response]);
        })
    }

    const handleOk = (selectedUsers, action) => {
        console.log('Action: ', action);
        setLoadingDetails(true);
        ApiService.post(ApiUrls.groupMachines(groupDetails.uid), selectedUsers).then(data => {
            if(!data.errorSummary){
                if (data.results !== undefined) {
                    data.results.forEach(machine => {
                        machine.key = machine.uid;
                    })
                    setMachines(data.results);
                    setTotalItems(data.total_items);
                }
                setLoadingDetails(false);
                const response = showToast('success', 'Successfully added Group Machines');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            }
            else {
                const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                console.log('response: ', response);
                setToastList([...toastList, response]);
            }
        }, error => {
            console.error('Error: ', error);
            setLoadingDetails(false);
            const response = showToast('error', 'An Error has occured with adding Group Machines');
            console.log('response: ', response);
            setToastList([...toastList, response]);
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
                        {groupDetails.name}
                    </div>
                    <Button style={{ marginLeft: 'auto' }} onClick={() => {
                        props.clearGroupDetails()
                        history.goBack()
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
                {action ? <MachinesSelection groupId={groupDetails.uid} action={action} handleOk={handleOk} handleCancel={handleCancel} /> : <></>}
            </div>
        </>
    )
}