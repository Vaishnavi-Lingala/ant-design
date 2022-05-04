import { Button, Input, Modal, Skeleton, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import './Policies.css';

import { PinPolicy } from './pinPolicy';
import { PasswordPolicy } from './passwordPolicy'
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { useHistory } from 'react-router-dom';

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
	const { TabPane } = Tabs;

	const pinData = {
		description: '',
		name: '',
		order: 0,
		policy_type: 'PIN',
		auth_policy_groups: [],
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
		auth_policy_groups: [],
		policy_type: 'PASSWORD',
		policy_req: {
			grace_period: ''
		}
	}

	function getPolicies() {
		setLoadingDetails(true)
		ApiService.get(ApiUrls.policies)
			.then(data => {
				console.log(data);
				var pinCounter = 0;
				var passwordCounter = 0;
				for (var i = 0; i < data.length; i++) {
					var object;
					if (data[i].policy_type === "PIN") {
						object = {
							key: pinCounter + 1,
							policy_name: data[i].name,
							policy_id: data[i].uid,
							policy_description: data[i].description
						}
						pinCounter = pinCounter + 1;
						pinArr.push(object);
					}
					else {
						object = {
							key: passwordCounter + 1,
							policy_name: data[i].name,
							policy_id: data[i].uid,
							policy_description: data[i].description
						}
						passwordCounter = passwordCounter + 1;
						passwordArr.push(object);
					}
				}
				setLoadingDetails(false);
			})
	}

	useEffect(() => {
		if (window.location.pathname.split("/")[2] !== 'password' && window.location.pathname.split("/").length !== 4) {
			history.push('/policies/pin');
		}

		if (window.location.pathname.split("/").length === 4) {
			getPolicyDetails(window.location.pathname.split("/")[3]);
		}

		getPolicies();
	}, [])

	const history = useHistory();

	function getPolicyDetails(uid: any) {
		localStorage.setItem("policyUid", uid);
		setLoadingDetails(true);
		ApiService.get(ApiUrls.policy(uid))
			.then(data => {
				console.log(data);
				if (data.policy_type === "PIN") {
					history.push('/policies/pin/' + uid);
					setPinDetails(data);
				}
				else {
					history.push('/policies/password/' + uid);
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
				{pinDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setPinDetails(undefined)
					history.push('/policies/pin')
				}}>
					Back
				</Button> : <></>}
				{passwordDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setPasswordDetails(undefined)
					history.push('/policies/password')
				}}>
					Back
				</Button> : <></>}
			</div>

			<Tabs defaultActiveKey={window.location.pathname.split("/")[2]}
				type="card" size={"middle"} animated={false}
				tabBarStyle={{ marginBottom: '0px' }}
				onChange={(key) => history.push("/policies/" + key)}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin">
					<Skeleton loading={loadingDetails}>
						{pinDetails ? <PinPolicy pinDetails={pinDetails} /> :
							isPinModalVisible ? <PinPolicy pinDetails={pinData} /> :
								<>
									<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
										<Button type='primary' size='large' onClick={() => {
											setIsPinModalVisible(true)
											history.push('/policies/pin')
										}}
										>
											Add Pin Policy
										</Button>
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
				<TabPane tab="Password" key="password">
					<Skeleton loading={loadingDetails}>
						{passwordDetails ? <PasswordPolicy passwordDetails={passwordDetails} /> :
							isPasswordModalVisible ? <PasswordPolicy passwordDetails={passwordData} /> :
								<>
									<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
										<Button type='primary' size='large' onClick={() => {
											setIsPasswordModalVisible(true)
											history.push('/policies/password')
										}}
										>
											Add Password Policy
										</Button>
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
