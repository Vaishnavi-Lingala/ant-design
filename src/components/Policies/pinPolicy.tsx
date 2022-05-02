import { Divider, Checkbox, Button, InputNumber, Input } from "antd";
import { useEffect, useState } from "react";

import './Policies.css';

// import { AuthenticationPolicy } from "../../models/Data.models";
import { PinPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

export const PinPolicy = (props: any) => {

	const [isEdit, setIsEdit] = useState(false);
	const [pinDisplayData, setPinDisplayData] = useState<PinPolicyType>(props.pinDetails);
	const [pinEditData, setPinEditedData] = useState(props.pinDetails);
	
	useEffect(() => {
		if (pinDisplayData.uid === undefined) {
			setIsEdit(true);
		}
	}, [])

	function updatePinPolicy() {
		ApiService.put(ApiUrls.policy(pinDisplayData.uid), pinEditData)
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

	function createPinPolicy() {
		ApiService.put(ApiUrls.addPolicy, pinEditData)
			.then(data => {
				console.log(data);
			})
		setTimeout(() => {
			window.location.reload()
		}, 1000);
	}

	function setCancelClick() {
		window.location.reload();
	}

	return (
		<>
			<div className="content-container-policy">
				<div className="row-container">
					<div>
						{pinDisplayData.uid === undefined ? <h5>Create Pin Policy</h5> :
							<h5>Edit Pin Policy</h5>
						}
					</div>
					<div>
						{pinDisplayData.default === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
							{!isEdit ? 'Edit' : 'Cancel'}
						</Button> : <></>
						}
					</div>
					<div style={{ paddingTop: '20px' }}>
						<h6>Policy Name</h6>
					</div>
					<div style={{ paddingTop: '20px' }}>
						{isEdit ? <Input className="form-control"
							style={{ width: "275px" }}
							onChange={(e) => setPinEditedData({
								...pinEditData,
								name: e.target.value
							})}
							defaultValue={pinDisplayData.name}
							placeholder='Enter a new policy name'
						/> : pinDisplayData.name
						}
					</div>

					<div>
						<h6>Description</h6>
					</div>
					<div>
						{isEdit ? <Input className="form-control"
							style={{ width: "410px" }}
							onChange={(e) => setPinEditedData({
								...pinEditData,
								description: e.target.value
							})}
							defaultValue={pinDisplayData.description}
							placeholder='Enter policy description'
						/> : pinDisplayData.description
						}
					</div>

					<div>
						<h6>Assigned to groups</h6>
					</div>
					<div>
						Everyone
					</div>

					<div>
						<h6>Policy Type</h6>
					</div>
					<div>
						{pinDisplayData.policy_type}
					</div>
				</div>

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
			{pinDisplayData.uid !== undefined ?
				(isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={handleCancelClick}>Cancel</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={handleSaveClick}>Save</Button>
				</div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={setCancelClick}>Cancel</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={createPinPolicy}>create</Button></div>
			}
		</>
	);
}
