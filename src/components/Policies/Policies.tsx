import { Button, Checkbox, Divider, Input, InputNumber, Modal, Skeleton, Table, Tabs } from 'antd';
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
				<Button onClick={() => getPinPolicyDetails(record.policy_id)}>
					View
				</Button>
			)
		}
	];

	const [pinDetails, setPinDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [arr, setArr]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
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
	const { TabPane } = Tabs;

	var requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			//@ts-ignore
			'X-CREDENTI-ACCESS-TOKEN': JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
		}
	}

	useEffect(() => {
		setLoadingDetails(true)
		Apis.getAllPolicies(requestOptions)
			.then(data => {
				for (var i = 0; i < data.length; i++) {
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

	const showPolicyHeader = <>
		<div className="row-container">
			<div>Policy Name</div>
			<div>
				<Input
					onChange={(e) => setPinData({
						...pinData,
						name: e.target.value
					})}
					placeholder='enter a new policy name'
				/>
			</div>

			<div>Description</div>
			<div>
				<Input
					onChange={(e) => setPinData({
						...pinData,
						description: e.target.value
					})}
					placeholder='enter policy description'
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

	function getPinPolicyDetails(uid: any) {
		setLoadingDetails(true);
		Apis.getPolicyDetails(uid, requestOptions)
			.then(data => {
				setPinDetails(data);
				setLoadingDetails(false);
			})
			.catch(error => {
				console.log(error);
			})
	}

	function createPolicy() {
		let requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				//@ts-ignore
				'X-CREDENTI-ACCESS-TOKEN': JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
			},
			body: JSON.stringify({
				...pinData
			})
		}
		
		Apis.createPolicyDetails(requestOptions)
			.then(data => {
				console.log(data);
			})
	}

	return (
		<>
			<div className='content-header'>
				Authentication
				{pinDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setPinDetails(undefined)}>Back</Button> : <></>}
			</div>

			<Tabs defaultActiveKey="pin" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin">
					<Skeleton loading={loadingDetails}>
						{pinDetails ? <Policy pinDetails={pinDetails} /> : <>

							<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
								<Button type='primary' size='large' onClick={() => setIsModalVisible(true)}>Add Pin Policy</Button>
							</div>

							<Table
								style={{ border: '1px solid #D7D7DC' }}
								showHeader={true}
								columns={columns}
								dataSource={arr}
								pagination={{ position: [] }}
							/>
							<Modal visible={isModalVisible}
								afterClose={() => window.location.reload()}
								onOk={() => {
									setIsModalVisible(false);
									createPolicy();
								}}
								onCancel={() => setIsModalVisible(false)} width='800px' bodyStyle={{ height: '700px' }}
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

				</TabPane>
			</Tabs>
		</>
	);
}
