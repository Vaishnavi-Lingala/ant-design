import { useEffect, useState } from "react"
import { Divider, Table, Skeleton, Button, Modal, Col, Row, Typography } from "antd";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import Moment from 'moment';

export default function KioskGroupDetails(props: any) {
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [action, setAction] = useState('');
    const [machines, setMachines] = useState([]);

    const columns = [
		{
			title: 'Machine name',
			dataIndex: 'machine_name',
			width: '30%'
		},
        {
			title: 'Mac Address',
			dataIndex: 'mac_address',
			width: '40%'
		},
        {
			title: 'Operating System',
			dataIndex: 'os',
			width: '40%'
		}
		
	];


    return(
        <>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div className='content-header'>
                            {groupDetails.name}
                    </div>
                    <Button style={{ marginLeft: 'auto'}} onClick={() => props.clearGroupDetails()}>Back</Button>
                </div>
                <div>
                    <h6>Created: {Moment(groupDetails.created_ts).format('MM/DD/YYYY')}</h6>
                </div>
                <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                <Skeleton loading={loadingDetails}>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                        <Row>
                            <Col span={12}>
                                <Button type='primary' size='large' onClick={() =>setAction('Add')}>Add Machines</Button>
                            </Col>
                            <Col span={6} offset={6}>
                                <Button type='primary' size='large' onClick={() =>setAction('Remove')}>Remove Machines</Button>
                            </Col>
                        </Row>
                            
					</div>
                    <Table
                            style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            dataSource={machines}   
                            // bordered={true}
                            pagination={{ position: [] }}
                        />
                </Skeleton>
            </div>
        </>
    )
}