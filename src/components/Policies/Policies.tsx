import { Button, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';

import './Policies.css';

import { Policy } from './policy';
import Apis from "../../Api.service";

export default function Policies() {

	const columns = [
		{
			title: 'Policy Name',
			dataIndex: 'policy_name',
			width: '30%'
		},
		{
			title: 'Policy Id',
			dataIndex: 'policy_id',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { policy_id: any; }) => (
				<Button onClick={()=> getPinPolicyDetails(record.policy_id)}>
				  View
				</Button>
			)
		}
	];
	
	const [pinDetails, setPinDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [arr, setArr]: any = useState([]);

	useEffect(() => {
		setLoadingDetails(true)
		Apis.getAllPolicies()
		.then(data => {
			for(var i = 0; i < data.length; i++) {	
				var obj = {
					key: i + 1,
					policy_name: data[i].name,
					policy_id: data[i].uid
				}
				arr.push(obj);
			}
			setLoadingDetails(false);
		})
	}, [])
	
	function getPinPolicyDetails(uid: any) {
		setLoadingDetails(true);
		Apis.getPolicyDetails(uid)
		.then(data => {
				setPinDetails(data);
				setLoadingDetails(false);
			})
			.catch(error => {
				console.log(error);
			})
		}

	return (
		<>
			<div className='content-header'>
				Authentication
				{pinDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setPinDetails(undefined)}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{pinDetails ? <Policy pinDetails={pinDetails} /> : <>

					<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large'>Add New Policy</Button>
					</div>

					<Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}
						pagination={{ position: [] }}
					/>
				</>
				}
			</Skeleton>
		</>
	);
}
