import { Divider, Checkbox, Button, InputNumber } from "antd";
import { useState } from "react";

import './Policies.css';

// import { AuthenticationPolicy } from "../../models/Data.models";
import { PinPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

export const PinPolicy = (props: any) => {

	const [isEdit, setIsEdit] = useState(false);
	const [pinDisplayData, setPinDisplayData] = useState<PinPolicyType>(props.pinDetails);
	const [pinEditData, setPinEditedData] = useState(props.pinDetails);

	const showPolicyHeader = <>
		<div className="policy-header">
			{pinDisplayData.name} policy
			{pinDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
				{!isEdit ? 'Edit' : 'Cancel'}
			</Button> : <></>
			}
		</div>

		<div className="row-container">
			<div>Description</div>
			<div>{pinDisplayData.description}</div>
			<div>Assigned to groups</div>
			<div>
				{/* {displayData.groups} */}
				Everyone
			</div>
		</div>
	</>

	const signonTypes = [
		'PIN',
		'TAP + PIN',
		'TAP + PIN + OKTAMFA',
		'TAP + OKTAMFA'
	]

	function updatePinPolicy() {
		ApiService.post(ApiUrls.policy(pinDisplayData.uid), pinEditData)
			.then(data => {
				console.log(data);
				setPinDisplayData({ ...pinEditData });
			})
			.catch(error => {
				console.log(error);
			})
	}

	function handleEditClick() {
		setIsEdit(!isEdit);
		setPinEditedData({ ...pinDisplayData });
	}

	function handleCancelClick() {
		setIsEdit(false);
	}

	function handleSaveClick() {
		updatePinPolicy();
		setIsEdit(false);
	}

	return (
		<>
			{/* <Tabs defaultActiveKey="pin" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin"> */}
			<div className="content-container-policy">
				{showPolicyHeader}

				<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

				<h6 style={{ padding: '10px 0 10px 0' }}>Pin Settings:</h6>

				<div className="row-container">
					<div>Minimum Length</div>
					<div>
						{
							isEdit ? <InputNumber
								onChange={(val) => { pinEditData.policy_req.min_length = parseInt(val); }}
								defaultValue={pinDisplayData.policy_req.min_length.toString()} /> : pinDisplayData.policy_req.min_length
						}
					</div>
					<div>Maxium Length</div>
					<div>
						{
							isEdit ? <InputNumber
								onChange={(val) => { pinEditData.policy_req.max_length = parseInt(val); }}
								defaultValue={pinDisplayData.policy_req.max_length.toString()} /> : pinDisplayData.policy_req.max_length
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
								onChange={(e) => pinEditData.policy_req.is_lower_case_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_lower_case_req : pinEditData.policy_req.is_lower_case_req}
								disabled={!isEdit}>
								Lower case letter
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_upper_case_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_upper_case_req : pinEditData.policy_req.is_upper_case_req}
								disabled={!isEdit}>
								Upper case letter
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_num_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_num_req : pinEditData.policy_req.is_num_req}
								disabled={!isEdit}>
								Number (0-9)
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_special_char_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_special_char_req : pinEditData.policy_req.is_special_char_req}
								disabled={!isEdit}>
								Special characters (e.g., !@#$%^&*)
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_pin_history_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_pin_history_req : pinEditData.policy_req.is_pin_history_req}
								disabled={!isEdit}>
								Enforce PIN history for last&nbsp;
								{
									isEdit ? <InputNumber
										onChange={(val) => { pinEditData.policy_req.pin_history_period = parseInt(val) }}
										defaultValue={pinDisplayData.policy_req.pin_history_period.toString()} /> : pinDisplayData.policy_req.pin_history_period
								} {pinDisplayData.policy_req.pin_history_period > 1 ? "PINS" : "PIN"}
							</Checkbox>
						</div>

						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_non_consecutive_char_req = e.target.checked}
								defaultChecked={!isEdit ? pinDisplayData.policy_req.is_non_consecutive_char_req : pinEditData.policy_req.is_non_consecutive_char_req}
								disabled={!isEdit}>
								No consecutive characters or numbers
							</Checkbox>
						</div>
					</div>
					<div>
						PIN expires in
					</div>
					<div>
						<div>
							{
								isEdit ? <InputNumber
									onChange={(val) => { pinEditData.policy_req.expires_in_x_days = parseInt(val) }}
									defaultValue={pinDisplayData.policy_req.expires_in_x_days.toString()} /> : pinDisplayData.policy_req.expires_in_x_days
							} {pinDisplayData.policy_req.expires_in_x_days > 1 ? "days" : "day"}
						</div>
					</div>
				</div>
			</div>
			{/* </TabPane> */}

			{/* <TabPane tab="Password" key="password">
					<div className="content-container-policy">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

							<div className="row-container">
							<div>
								<h6 style={{ padding: '10px 0 10px 0' }}>
									Grace Period:
								</h6>
							</div>
							<div style={{ padding: '10px 0 10px 0' }}>
									<Radio.Group defaultValue={"TWO_HOURS"}
										// defaultValue={displayDetails?.challenge_factors[0].factor}
                                        disabled={!isEdit}
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
                                    </Radio.Group> */}
			{/* {
									isEdit ? 
									<><InputNumber defaultValue={3}/><Select disabled={!isEdit} className="select-time"
										// onChange={(val) => { editData.expire_units = val }}
										suffixIcon={<CaretDownOutlined
											style={{ color: isEdit ? 'black' : 'white', cursor: 'auto' }} />}
											defaultValue={"Days"}
										// defaultValue={displayData.expire_units}
										>
										<Select.Option value="Days">Days</Select.Option>
										<Select.Option value="Hours">Hours</Select.Option>
										<Select.Option value="Minutes">Minutes</Select.Option>
									</Select> </> : "3 Days" 
									// displayData.expire_units
								} */}
			{/* </div> */}
			{/* <div>Enforcement</div>
							<div>
								<Checkbox
									// onChange={(e) => setEditedData({ ...editData, dne: e.target.checked })}
									// checked={!isEdit ? displayData.dne : editData.dne}
									disabled={!isEdit}>Do not enforce grace for PIN
								</Checkbox>
							</div> */}
			{/* <div></div>
							<div>
								<Checkbox
									// onChange={(e) => setEditedData({ ...editData, sliding: e.target.checked })}
									// checked={!isEdit ? displayData.sliding : editData.sliding}
									disabled={!isEdit}>
									Allow sliding of expiration time
								</Checkbox>
							</div> */}
			{/* // 		</div> */}
			{/* // 	</div> */}
			{/* // </TabPane> */}

			{/* <TabPane tab="Security Questions" key="security-questions">
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
				</TabPane> */}

			{/* <TabPane tab="Sign-on" key="sign-on">
					<div className="content-container-policy">
						{showPolicyHeader}

						<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

						<h6 style={{ padding: '10px 0 10px 0' }}>Authentication Type</h6>
						<div className="row-container">
							<div>Sign-on Type</div>
							<div>
								{
									isEdit ? <Select disabled={!isEdit} className="select-type"
										// onChange={(val) => { editData.authentication = val }}
										suffixIcon={<CaretDownOutlined
											style={{ color: isEdit ? 'black' : 'white', cursor: "pointer" }} />}
										// defaultValue={displayData.authentication.toString()}
										>
										<Select.Option value="1">PIN</Select.Option>
										<Select.Option value="2">TAP + PIN</Select.Option>
										<Select.Option value="3">TAP + PIN + OKTAMFA</Select.Option>
										<Select.Option value="4">TAP + OKTAMFA</Select.Option>
									</Select> : "PIN" 
									// displayData.authentication ? signonTypes[displayData.authentication - 1] : ''
								}
							</div>
						</div>
					</div>
				</TabPane> */}
			{/* // </Tabs> */}
			{
				isEdit ? <div style={{ paddingTop: '10px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={handleCancelClick}>
						Cancel
					</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={handleSaveClick}>
						Save
					</Button>
				</div> : <></>
			}
		</>
	);
}
