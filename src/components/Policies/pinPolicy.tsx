import { Divider, Checkbox, Button, InputNumber, Input, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";

import './Policies.css';

// import { AuthenticationPolicy } from "../../models/Data.models";
import { PinPolicyType } from "../../models/Data.models";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

export const PinPolicy = (props: any) => {

	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pinDisplayData, setPinDisplayData] = useState<PinPolicyType>(props.pinDetails);
	const [pinEditData, setPinEditedData] = useState(props.pinDetails);
	const [groups, setGroups]: any = useState([]);
	const [groupNames, setGroupNames]: any = useState([]);
	const [groupUids, setGroupUids]: any = useState([]);
	const [groupsChange, setGroupsChange]: any = useState([]);

	useEffect(() => {
		if (pinDisplayData.uid === undefined) {
			setIsEdit(true);
		}

		ApiService.get(ApiUrls.groups)
			.then(data => {
				console.log('GROUPS: ', data);
				for (var i = 0; i < data.length; i++) {
					groups.push({
						label: data[i].name,
						value: data[i].uid
					})
				}
				var object = {};
				for (var i = 0; i < data.length; i++) {
					object[data[i].name] = data[i].uid
				}
				groupsChange.push(object);
				console.log(groups);
				setLoading(false);
			})

		if (pinDisplayData.uid !== undefined) {
			Object.keys(pinDisplayData.auth_policy_groups).map(data => {
				groupNames.push(pinDisplayData.auth_policy_groups[data].name);
				groupUids.push(pinDisplayData.auth_policy_groups[data].uid)
				console.log(groupNames);
				console.log(groupUids);
			});
		}
		pinEditData.auth_policy_groups = groupUids;
	}, [])

	function updatePinPolicy() {
		ApiService.put(ApiUrls.policy(pinDisplayData.uid), pinEditData)
			.then(data => {
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

	function handleGroups(value: any) {
		Object.keys(groupsChange[0]).map(key => {
			if (value.includes(key)) {
				console.log(key)
				var index = value.indexOf(key)
				console.log(index)
				value.splice(index, 1)
				value.push(groupsChange[0][key]);
			}
		})
		pinEditData.auth_policy_groups = value;
		console.log(pinEditData.auth_policy_groups);
	}

	return (
		<Skeleton loading={loading}>
			<div className="content-container-policy">
				<div className="row-container">
					<div>
						{pinDisplayData.uid === undefined ? <h3>Create Pin Policy</h3> :
							<h3>Edit Pin Policy</h3>
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
							style={{ width: "275px" }}
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
						<Select
							mode="multiple"
							size={"large"}
							placeholder="Please select groups"
							defaultValue={pinDisplayData.name !== "" ? groupNames : []}
							onChange={handleGroups}
							disabled={!isEdit}
							style={{ width: '275px' }}
							options={groups}
						/>
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
		</Skeleton>
	);
}
