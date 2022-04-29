import { Button, Checkbox, Divider, Input, InputNumber, Modal, Radio, Skeleton, Space, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import './Policies.css';

import { PinPolicy } from './pinPolicy';
import { PasswordPolicy } from './passwordPolicy'
import ApiUrls from '../../ApiUtils'; 
import ApiService from '../../Api.service';

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

	const [pinData, setPinData] = useState({
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
	})

	const [passwordData, setPasswordData] = useState({
		description: '',
		name: '',
		order: 0,
		policy_type: 'PASSWORD',
		policy_req: {
			grace_period: ''
		}
	})

	const { TabPane } = Tabs;

	useEffect(() => {
		// setArr([]);
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
	}, [])

	const showPolicyHeader = <>
		<div className="row-container">
			<div>Policy Name</div>
			<div>
				<Input
					onChange={(e) => setPinData({
						...pinData,
						name: e.target.value
					})}
					placeholder='Enter a new policy name'
				/>
			</div>

			<div>Description</div>
			<div>
				<Input
					onChange={(e) => setPinData({
						...pinData,
						description: e.target.value
					})}
					placeholder='Enter policy description'
				/>
			</div>

			<div>Policy Type</div>
			<div>
				{pinData.policy_type}
			</div>

			{/* <div>Order</div>
			<div>
				<InputNumber
					onChange={(val) => pinData.order = val}
					defaultValue={pinData.order}
				/>
			</div> */}
		</div>
	</>

	console.log(pinArr);
	console.log(passwordArr);

	function getPolicyDetails(uid: any) {
		setLoadingDetails(true);
		ApiService.get(ApiUrls.policy(uid))
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

	function createPolicy(object: object) {
		ApiService.post(ApiUrls.addPolicy, object)
			.then(data => {
				console.log(data);
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
						{pinDetails ? <PinPolicy pinDetails={pinDetails} /> : <>

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

							<Modal visible={isPinModalVisible}
								afterClose={() => window.location.reload()}
								onOk={() => {
									setIsPinModalVisible(false);
									createPolicy(pinData);
								}}
								onCancel={() => setIsPinModalVisible(false)} width='800px' bodyStyle={{ height: '700px' }}
								title={<h4>Add New Pin Policy</h4>} centered maskClosable={false} okText={"Save"}
							>

								<div className="content-container">
									{showPolicyHeader}

									<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

									<h6 style={{ padding: '10px 0 10px 0' }}>Pin Settings:</h6>

									<div className="row-container">
										<div>Minimum Length</div>
										<div>
											{
												<InputNumber
													onChange={(val) => pinData.policy_req.min_length = val}
													defaultValue={pinData.policy_req.min_length}
												/>
											}
										</div>
										<div>Maxium Length</div>
										<div>
											{
												<InputNumber
													onChange={(val) => pinData.policy_req.max_length = val}
													defaultValue={pinData.policy_req.max_length}
												/>
											}
										</div>
									</div>

									<div className="row-container">
										<div>
											<h6 style={{ padding: '20px 0 10px 0' }}>Complexity Requirements:</h6>
										</div>
										<div className="checkbox-container" style={{ padding: '20px 0 10px 0' }}>
											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_lower_case_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_lower_case_req}
												>
													Lower case letter
												</Checkbox>
											</div>
											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_upper_case_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_upper_case_req}
												>
													Upper case letter
												</Checkbox>
											</div>
											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_num_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_num_req}
												>
													Number (0-9)
												</Checkbox>
											</div>
											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_special_char_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_special_char_req}
												>
													Special characters (e.g., !@#$%^&*)
												</Checkbox>
											</div>
											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_pin_history_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_pin_history_req}
												>
													Enforce PIN history for last&nbsp;
													<InputNumber
														onChange={(val) => pinData.policy_req.pin_history_period = val}
														defaultValue={pinData.policy_req.pin_history_period}
													/>
													{pinData.policy_req.pin_history_period > 1 ? "PINS" : "PIN"}
												</Checkbox>
											</div>

											<div>
												<Checkbox
													onChange={(e) => pinData.policy_req.is_non_consecutive_char_req = e.target.checked}
													defaultChecked={pinData.policy_req.is_non_consecutive_char_req}
												>
													No consecutive characters or numbers
												</Checkbox>
											</div>
										</div>
										<div>
											PIN expires in
										</div>
										<div>
											<div>
												<InputNumber
													onChange={(val) => pinData.policy_req.expires_in_x_days = val}
													defaultValue={pinData.policy_req.expires_in_x_days}
												/>
												{pinData.policy_req.expires_in_x_days > 1 ? "days" : "day"}
											</div>
										</div>
									</div>
								</div>
							</Modal>
						</>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab="Password">
					<Skeleton loading={loadingDetails}>
						{passwordDetails ? <PasswordPolicy passwordDetails={passwordDetails} /> : <>

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
							<Modal visible={isPasswordModalVisible}
								afterClose={() => window.location.reload()}
								onOk={() => {
									// setIsPasswordModalVisible(false);
									createPolicy(passwordData);
								}}
								onCancel={() => setIsPasswordModalVisible(false)} width='700px' bodyStyle={{ height: '400px' }}
								title={<h4>Add New Password Policy</h4>} centered maskClosable={false} okText={"Save"}
							>
								<div className="row-container">
									<div>Policy Name:</div>
									<div>
										<Input
											onChange={(e) => setPasswordData({
												...passwordData,
												name: e.target.value
											})}
											placeholder='Enter a new policy name'
										/>
									</div>

									<div>Description:</div>
									<div>
										<Input
											onChange={(e) => setPasswordData({
												...passwordData,
												description: e.target.value
											})}
											placeholder='Enter policy description'
										/>
									</div>

									<div>Policy Type:</div>
									<div>
										{passwordData.policy_type}
									</div>
									<div style={{ padding: '10px 0 10px 0' }}>
											Grace Period:
									</div>
									<div style={{ padding: '12px 0 10px 0' }}>
										<Radio.Group defaultValue={passwordData.policy_req.grace_period}
											onChange={(e) => passwordData.policy_req.grace_period = e.target.value}
										>
											<Space direction="vertical">
												<Radio value={"TWO_HOURS"}>2 hours</Radio>
												<Radio value={"FOUR_HOURS"}>4 hours</Radio>
												<Radio value={"SIX_HOURS"}>6 hours</Radio>
												<Radio value={"EIGHT_HOURS"}>8 hours</Radio>
												<Radio value={"TWELVE_HOURS"}>12 hours</Radio>
												<Radio value={"ALWAYS_PROMPT"}>Always prompt</Radio>
												<Radio value={"DO_NOT_PROMPT"}>Do not prompt</Radio>
											</Space>
										</Radio.Group>
									</div>
								</div>
							</Modal>
						</>
						}
					</Skeleton>
				</TabPane>
			</Tabs>
		</>
	);
}
