import { Button, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';

import './Mechanism.css';

import Mechanism from './mechanism';
import Apis from '../Api.service';

export default function Mechanisms() {

	const columns = [
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={()=> getMechanismDetails(record.mechanism_id)}>
				  View
				</Button>
			)
		}
	];
	
	const [mechanismDetails, setMechanismDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [arr, setArr]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [mechanism, setMechanism] = useState({
		
	})

	var requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json', 
			//@ts-ignore
			'X-CREDENTI-ACCESS-TOKEN': JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
		}
	}

	useEffect(() => {
		setLoadingDetails(true);
        Apis.getAllMechanisms(requestOptions)
		.then(data => {
			for(var i = 0; i < data.length; i++) {	
				var obj = {
					key: i + 1,
					mechanism_name: data[i].name,
					mechanism_id: data[i].uid
				}
				arr.push(obj);
			}
			setLoadingDetails(false);
		})
	}, [])

	function getMechanismDetails(uid: any) {
		setLoadingDetails(true);
        Apis.getMechanismDetails(uid, requestOptions)
            .then(data => {
                setMechanismDetails(data);
                setLoadingDetails(false);
            })
	}

	return (
		<>
			<div className='content-header'>
				Mechanism
				{mechanismDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setMechanismDetails(undefined)}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{mechanismDetails ? <Mechanism mechanismDetails={mechanismDetails} /> : <>

					<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large'>Add New Mechanism</Button>
					</div>

					<Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}   
                        // bordered={true}
						pagination={{ position: [] }}
					/>
				</>
				}
			</Skeleton>
		</>
	);
}
