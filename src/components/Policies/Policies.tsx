import { Button, Skeleton, Table } from 'antd';
import { useState } from 'react';

import './Policies.css';

import { Policy } from './policy';
import Apis from "../../Api.service";

export default function Policies() {

	const columns = [
		{
			title: 'Policy Name',
			dataIndex: 'name',
			width: '25%'
		},
		{
			title: 'Policy Description',
			dataIndex: 'description'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '25%'
		}
	];

	const [policyDetails, setPolicyDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);

	function getPolicyDetails() {
		setLoadingDetails(true);
		Apis.getPolicyDetails("customer1", "Default Policy")
			.then(data => {
				setPolicyDetails(data);
				setLoadingDetails(false);
			})
			.catch(error => {
				console.log(error);
			})
	}

	const data = [
		{
			key: 1,
			name: 'Default Policy',
			description: 'It is a default policy',
			actions: <Button onClick={getPolicyDetails}>Details</Button>
		}
	];

	return (
		<>
			<div className='content-header'>
				Authentication
				{policyDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setPolicyDetails(undefined)}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{policyDetails ? <Policy policyDetails={policyDetails} /> : <>

					<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large'>Add New Policy</Button>
					</div>

					<Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={false}
						columns={columns}
						dataSource={data}
						pagination={{ position: [] }}
					/>
				</>
				}
			</Skeleton>
		</>
	);
}
