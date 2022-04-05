import { Divider, Checkbox, Button, InputNumber, Select, Tabs } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
import { useState } from "react";

import './Policies.css';

import { AuthenticationPolicy } from "../../models/Data.models";
import Apis from "../../Api.service";

export const Policy = (props: any) => {

	const [isEdit, setIsEdit] = useState(false);
	const [displayData, setDisplayData] = useState<AuthenticationPolicy>(props.policyDetails);
	const [editData, setEditedData] = useState(props.policyDetails);
	const { TabPane } = Tabs;
	const showPolicyHeader = <>
		<div className="policy-header">
			{/* {displayData.PolicyName} */}
			Default policy
			<Button style={{ float: 'right' }} onClick={handleEditClick}>
				{!isEdit ? 'Edit' : 'Cancel'}
			</Button>
		</div>
		<div className="row-container">
			<div>Description</div>
			<div>{displayData.policy_desc}</div>
			<div>Assigned to groups</div>
			<div>
				{displayData.groups}
			</div>
		</div>
	</>

	const signonTypes = [
		'PIN',
		'TAP + PIN',
		'TAP + PIN + OKTAMFA',
		'TAP + OKTAMFA'
	]

	function updatePolicy() {
		var requestBody = {
			...editData,
			"customer_id": "customer1",
			"policy_name": "Default Policy"
		}

		for (const [key] of Object.entries(requestBody)) {
			requestBody[key] = requestBody[key].toString();
		}

		delete requestBody.last_date;
		delete requestBody.pk_policy_id;

		Apis.updatPolicyDetails(requestBody)
			.then(data => {
				if (!data.errorCode) {
					if (data.status === 'SUCCESS')
						setDisplayData({ ...editData });
					setIsEdit(false);
				}
				else {
					console.log(data);
				}
			})
			.catch(error => {
				console.log(error);
				setIsEdit(false);
			})
	}

	function handleEditClick() {
		setIsEdit(!isEdit);
		setEditedData({ ...displayData });
	}

	function handleCancelClick() {
		setIsEdit(false);
	}

	function handleSaveClick() {
		updatePolicy();
	}

	return (
		<>
			<Tabs defaultActiveKey="pin" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin">
					<div className="content-container">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6 style={{ padding: '10px 0 10px 0' }}>Pin Settings:</h6>

						<div className="row-container">
							<div>Minimum Length</div>
							<div>
								{
									isEdit ? <InputNumber
										onChange={(val) => { editData.min_len = parseInt(val); }}
										defaultValue={displayData.min_len.toString()} /> : displayData.min_len
								}
							</div>
							<div>Maxium Length</div>
							<div>
								{
									isEdit ? <InputNumber
										onChange={(val) => { editData.max_len = parseInt(val); }}
										defaultValue={displayData.max_len.toString()} /> : displayData.max_len
								}
							</div>
						</div>

						<h6 style={{ padding: '10px 0 10px 0' }}>Complexity Requirements:</h6>

						<div className="row-container">
							<div>

							</div>
							<div className="checkbox-container">
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, l_case: e.target.checked })}
										checked={!isEdit ? displayData.l_case : editData.l_case}
										disabled={!isEdit}>
										Lower case letter
									</Checkbox>
								</div>
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, u_case: e.target.checked })}
										checked={!isEdit ? displayData.u_case : editData.u_case}
										disabled={!isEdit}>
										Upper case letter
									</Checkbox>
								</div>
								<div>
									<Checkbox
										// onChange={(e) => setEditedData({ ...editData, special: e.target.checked })}
										// checked={!isEdit ? displayData.special : editData.special}
										disabled={!isEdit}>
										Number (0-9)
									</Checkbox>
								</div>
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, special: e.target.checked })}
										checked={!isEdit ? displayData.special : editData.special}
										disabled={!isEdit}>
										Special characters (e.g., !@#$%^&*)
									</Checkbox>
								</div>
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, history: e.target.checked })}
										checked={!isEdit ? displayData.history : editData.history}
										disabled={!isEdit}>
										Enforce PIN history for last&nbsp;
										{
											isEdit ? <InputNumber
												onChange={(val) => { editData.history_count = parseInt(val) }}
												value={displayData.history_count.toString()} /> : displayData.history_count
										} PINS
									</Checkbox>
								</div>
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, expire: e.target.checked })}
										checked={!isEdit ? displayData.expire : editData.expire}
										disabled={!isEdit}>
										PIN expires after&nbsp;
										{
											isEdit ? <InputNumber
												onChange={(val) => { editData.expire_count = parseInt(val) }}
												value={displayData.expire_count.toString()} /> : displayData.expire_count
										} days
									</Checkbox>
								</div>
								<div>
									<Checkbox
										// onChange={(e) => setEditedData({ ...editData, expire: e.target.checked })}
										// checked={!isEdit ? displayData.expire : editData.expire}
										disabled={!isEdit}>
										No consecutive characters or numbers
									</Checkbox>
								</div>
							</div>
						</div>
					</div>
				</TabPane>

				<TabPane tab="Password" key="password">
					<div className="content-container">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6 style={{ padding: '10px 0 10px 0' }}>Grace Period:</h6>
						<div className="row-container">
							<div>Enforcement</div>
							<div>
								<Checkbox
									onChange={(e) => setEditedData({ ...editData, dne: e.target.checked })}
									checked={!isEdit ? displayData.dne : editData.dne}
									disabled={!isEdit}>Do not enforce grace for PIN
								</Checkbox>
							</div>
							<div>Expire Unit</div>
							<div>
								{
									isEdit ? <Select disabled={!isEdit} className="select-time"
										onChange={(val) => { editData.expire_units = val }}
										suffixIcon={<CaretDownOutlined
											style={{ color: isEdit ? 'black' : 'white', cursor: 'auto' }} />}
										defaultValue={displayData.expire_units}>
										<Select.Option value="Days">Days</Select.Option>
										<Select.Option value="Hours">Hours</Select.Option>
										<Select.Option value="Minutes">Minutes</Select.Option>
									</Select> : displayData.expire_units
								}
							</div>
							<div>Expiration</div>
							<div>
								<Checkbox
									onChange={(e) => setEditedData({ ...editData, sliding: e.target.checked })}
									checked={!isEdit ? displayData.sliding : editData.sliding}
									disabled={!isEdit}>
									Allow sliding of expiration time
								</Checkbox>
							</div>
						</div>
					</div>
				</TabPane>

				<TabPane tab="Security Questions" key="security-questions">
					<div className="content-container">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6>Self Service PIN Recovery Settings</h6>
						<div className="row-container">
							<div>Self Service Pin Recovery</div>
							<div className="checkbox-container">
								<div>
									<Checkbox
										onChange={(e) => setEditedData({ ...editData, sspr: e.target.checked })}
										checked={!isEdit ? displayData.sspr : editData.sspr}
										disabled={!isEdit}>Enable self-service PIN recovery
									</Checkbox>
								</div>
							</div>
						</div>

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6 style={{ padding: '10px 0 10px 0' }}>Question Factor Settings</h6>
						<div className="row-container">
							<div>Number of questions to ask for enrollment</div>
							<div>
								{
									isEdit ? <InputNumber
										onChange={(val) => { editData.question_enroll = parseInt(val) }}
										defaultValue={displayData.question_enroll.toString()}
									/> : displayData.question_enroll
								}
							</div>
							<div>Number of questions to ask for MFA</div>
							<div>
								{
									isEdit ? <InputNumber
										onChange={(val) => { editData.question_mfa = parseInt(val) }}
										defaultValue={displayData.question_mfa.toString()}
									/> : displayData.question_mfa
								}
							</div>
							<div>Minimum number of answer characters</div>
							<div>
								{
									isEdit ? <InputNumber
										onChange={(val) => { editData.question_number = parseInt(val) }}
										defaultValue={displayData.question_number.toString()}
									/> : displayData.question_number
								}
							</div>
						</div>
					</div>
				</TabPane>

				<TabPane tab="Sign-on" key="sign-on">
					<div className="content-container">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6 style={{ padding: '10px 0 10px 0' }}>Authentication Type</h6>
						<div className="row-container">
							<div>Sign-on Type</div>
							<div>
								{
									isEdit ? <Select disabled={!isEdit} className="select-type"
										onChange={(val) => { editData.authentication = val }}
										suffixIcon={<CaretDownOutlined
											style={{ color: isEdit ? 'black' : 'white', cursor: "auto" }} />}
										defaultValue={displayData.authentication.toString()}>
										<Select.Option value="1">PIN</Select.Option>
										<Select.Option value="2">TAP + PIN</Select.Option>
										<Select.Option value="3">TAP + PIN + OKTAMFA</Select.Option>
										<Select.Option value="4">TAP + OKTAMFA</Select.Option>
									</Select> : displayData.authentication ? signonTypes[displayData.authentication - 1] : ''
								}
							</div>
						</div>
					</div>
				</TabPane>
			</Tabs>
			{
				isEdit ? <div style={{ paddingTop: '10px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={handleCancelClick}>Cancel</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={handleSaveClick}>Save</Button>
				</div> : <></>
			}
		</>
	);
}
