import { Button, Input, Skeleton, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import './Policies.css';

import { PinPolicy } from './pinPolicy';
import { PasswordPolicy } from './passwordPolicy'
import Apis from "../../Api.service";

export default function Policies() {

	const columns = [
		{
			title: 'Policy Name',
			dataIndex: 'policy_name',
			width: '20%'
		},
		{
			title: 'Policy Description',
			dataIndex: 'policy_description',
			width: '60%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '20%',
			render: (text: any, record: { policy_id: any; }) => (
				<Button onClick={() => getPolicyDetails(record.policy_id)}>
					View
				</Button>
			)
		}
	];

	const [pinDetails, setPinDetails] = useState(undefined);
	const [passwordDetails, setPasswordDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);

	const [pinArr, setPinArr]: any = useState([]);
	const [passwordArr, setPasswordArr]: any = useState([]);

	const [isPinModalVisible, setIsPinModalVisible] = useState(false);
	const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

	//@ts-ignore
	const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken

	const pinData = {
		description: '',
		name: '',
		order: 0,
		policy_type: 'PIN',
		policy_req: {
			expires_in_x_days: 0,
			is_special_char_req: false,
			pin_history_period: 0,
			min_length: 0,
			is_upper_case_req: false,
			is_lower_case_req: false,
			is_non_consecutive_char_req: false,
			max_length: 0,
			is_pin_history_req: false,
			is_num_req: false
		}
	}

	const passwordData = {
		description: '',
		name: '',
		order: 0,
		policy_type: 'PASSWORD',
		policy_req: {
			grace_period: ''
		}
	}

	const { TabPane } = Tabs;

	useEffect(() => {
		setLoadingDetails(true)
		Apis.getAllPolicies(accessToken)
			.then(data => {
				console.log(data);
				var pinCounter = 0;
				var passwordCounter = 0;
				for (var i = 0; i < data.length; i++) {
					var object = {
						key: pinCounter + 1,
						policy_name: data[i].name,
						policy_id: data[i].uid,
						policy_description: data[i].description
					}
					if (data[i].policy_type === "PIN") {
						pinCounter = pinCounter + 1;
						pinArr.push(object);
					}
					else {
						passwordCounter = passwordCounter + 1;
						passwordArr.push(object);
					}
				}
				setLoadingDetails(false);
			})
	}, [])

	function getPolicyDetails(uid: any) {
		setLoadingDetails(true);
		Apis.getPolicyDetails(uid, accessToken)
			.then(data => {
				console.log(data);
				if (data.policy_type === "PIN") {
					setPinDetails(data);
				}
				else {
					setPasswordDetails(data);
				}
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
				{passwordDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setPasswordDetails(undefined)}>Back</Button> : <></>}
			</div>

			<Tabs defaultActiveKey="pin" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin">
					<Skeleton loading={loadingDetails}>
						{pinDetails ? <PinPolicy pinDetails={pinDetails} /> :
							isPinModalVisible ? <PinPolicy pinDetails={pinData} /> :
								<>
									<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
										<Button type='primary' size='large' onClick={() => setIsPinModalVisible(true)}>Add Pin Policy</Button>
									</div>

									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={columns}
										dataSource={pinArr}
										pagination={{ position: [] }}
									/>
								</>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab="Password">
					<Skeleton loading={loadingDetails}>
						{passwordDetails ? <PasswordPolicy passwordDetails={passwordDetails} /> :
							isPasswordModalVisible ? <PasswordPolicy passwordDetails={passwordData} /> :
								<>
									<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
										<Button type='primary' size='large' onClick={() => setIsPasswordModalVisible(true)}>Add Password Policy</Button>
									</div>

									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={columns}
										dataSource={passwordArr}
										pagination={{ position: [] }}
									/>

								</>
						}
					</Skeleton>
				</TabPane>
			</Tabs>
		</>
	);
}
