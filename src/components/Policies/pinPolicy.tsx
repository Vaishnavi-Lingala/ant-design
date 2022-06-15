import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Checkbox, Button, InputNumber, Input, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { openNotification } from "../Layout/Notification";

export const PinPolicy = (props: any) => {
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pinDisplayData, setPinDisplayData] = useState({});
	const [pinEditData, setPinEditedData]: any = useState();
	const [groups, setGroups]: any = useState([]);
	const [groupNames, setGroupNames]: any = useState([]);
	const [groupUids, setGroupUids]: any = useState([]);
	const [groupsChange, setGroupsChange]: any = useState([]);
	const [policyRequirements, setPolicyRequirements] = useState({});
	const history = useHistory();

	useEffect(() => {
		Promise.all(([
			ApiService.get(ApiUrls.groups, { type: "USER" }),
			ApiService.get(ApiUrls.policy(window.location.pathname.split('/')[5]))
		]))
			.then(data => {
				console.log('GROUPS: ', data[0]);
				for (var i = 0; i < data[0].length; i++) {
					groups.push({
						label: data[0][i].name,
						value: data[0][i].uid
					})
				}
				setGroups(groups);
				var object = {};
				for (var i = 0; i < data[0].length; i++) {
					object[data[0][i].name] = data[0][i].uid
				}
				groupsChange.push(object);
				setGroupsChange(groupsChange);

				if (!data[1].errorSummary) {
					setPinDisplayData(data[1]);
					setPinEditedData(data[1]);
					setPolicyRequirements(data[1].policy_req);
					if (data[1].uid !== undefined) {
						Object.keys(data[1].auth_policy_groups).map(index => {
							groupNames.push(data[1].auth_policy_groups[index].name);
							groupUids.push(data[1].auth_policy_groups[index].uid)
							setGroupNames(groupNames)
							setGroupUids(groupUids);
							console.log(groupNames);
							console.log(groupUids);
						});
					}
					setLoading(false);
				}
				else if (window.location.pathname.split('/').length === 5) {
					setPinDisplayData(props.pinDetails);
					setPinEditedData(props.pinDetails);
					setPolicyRequirements(props.pinDetails.policy_req);
					setIsEdit(true);
					setLoading(false);
				}
				else {
					console.log('else: ', data[1]);
					openNotification('error', data[1].errorCauses.length !== 0 ? data[1].errorCauses[1].errorSummary : data[1].errorSummary);
					history.push(`/product/${localStorage.getItem("productId")}/policies/pin`);
				}
			}, error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Groups');
				setLoading(false);
			})
	}, [])

	function updatePinPolicy() {
		pinEditData.auth_policy_groups = groupUids;
		ApiService.put(ApiUrls.policy(pinDisplayData['uid']), pinEditData)
			.then(data => {
				if (!data.errorSummary) {
					groupNames.length = 0;
					setPinDisplayData({ ...pinEditData });
					openNotification('success', 'Successfully updated PIN Policy');
					Object.keys(data.auth_policy_groups).map(index => {
						groupNames.push(data.auth_policy_groups[index].name);
					});
					setGroupNames(groupNames);
					setIsEdit(false);
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with updating PIN Policy');
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
	}

	function createPinPolicy() {
		props.handleOk("PIN", pinEditData);
	}

	function setCancelClick() {
		props.handleCancel("PIN");
	}

	function handleGroups(value: any) {
		Object.keys(groupsChange[0]).map(key => {
			if (value.includes(key)) {
				var index = value.indexOf(key)
				value.splice(index, 1)
				value.push(groupsChange[0][key]);
			}
		})
		groupUids.length = 0;
		setGroupUids(value);
		pinEditData.auth_policy_groups = value;
		console.log(pinEditData.auth_policy_groups);
	}

	return (
		<Skeleton loading={loading}>
			<div className={pinDisplayData['uid'] === undefined ? "content-container" : "content-container-policy"}>
				<div className="row-policy-container">
					<div>
						{pinDisplayData['uid'] === undefined ? <></> :
							<div className="content-heading">Edit Pin Policy</div>
						}
					</div>
					<div>
						{pinDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
							{!isEdit ? 'Edit' : 'Cancel'}
						</Button> : <></>
						}
					</div>
					<div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
						Policy Name:
					</div>
					<div style={{ paddingTop: '20px' }}>
						{isEdit ? <Input className="form-control"
							style={{ width: "275px" }}
							onChange={(e) => setPinEditedData({
								...pinEditData,
								name: e.target.value
							})}
							defaultValue={pinDisplayData['name']}
							placeholder='Enter a new policy name'
						/> : pinDisplayData['name']
						}
					</div>

					<div className="content-policy-key-header">
						Description:
					</div>
					<div>
						{isEdit ? <TextArea className="form-control"
							style={{ width: "275px" }}
							onChange={(e) => setPinEditedData({
								...pinEditData,
								description: e.target.value
							})}
							defaultValue={pinDisplayData['description']}
							placeholder='Enter policy description'
						/> : pinDisplayData['description']
						}
					</div>

					<div className="content-policy-key-header">
						Assigned to groups:
					</div>
					<div>
						{isEdit ?
							<Select
								mode="multiple"
								size={"large"}
								placeholder={<div>Please select groups</div>}
								defaultValue={pinDisplayData['name'] !== "" ? groupNames : []}
								onChange={handleGroups}
								style={{ width: '275px' }}
								options={groups}
							/> : Object.keys(groupNames).map(name =>
								<div style={{ display: 'inline-block', marginRight: '3px', paddingBottom: '3px' }}>
									<Button style={{ cursor: 'text' }}>{groupNames[name]}</Button>
								</div>
							)
						}
					</div>

					<div className="content-policy-key-header">
						Policy Type:
					</div>
					<div>
						{pinDisplayData['policy_type']}
					</div>
				</div>

				<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

				<p className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>Pin Settings:</p>

				<div className="row-policy-container">
					<div>Minimum Length:</div>
					<div>
						{
							isEdit ? <InputNumber
								onChange={(val) => { pinEditData.policy_req.min_length = parseInt(val); }}
								defaultValue={policyRequirements['min_length'].toString()} /> : policyRequirements['min_length']
						}
					</div>

					<div>Maxium Length:</div>
					<div>
						{
							isEdit ? <InputNumber
								onChange={(val) => { pinEditData.policy_req.max_length = parseInt(val); }}
								defaultValue={policyRequirements['max_length'].toString()} /> : policyRequirements['max_length']
						}
					</div>
				</div>

				<div className="row-policy-container">
					<div className="content-policy-key-header" style={{ padding: '20px 0 10px 0' }}>
						Complexity Requirements:
					</div>
					<div className="checkbox-container" style={{ padding: '20px 0 10px 0' }}>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_lower_case_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_lower_case_req'] : policyRequirements['is_lower_case_req']}
								disabled={!isEdit}>
								Lower case letter
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_upper_case_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_upper_case_req'] : pinEditData.policy_req.is_upper_case_req}
								disabled={!isEdit}>
								Upper case letter
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_num_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_num_req'] : pinEditData.policy_req.is_num_req}
								disabled={!isEdit}>
								Number (0-9)
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_special_char_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_special_char_req'] : pinEditData.policy_req.is_special_char_req}
								disabled={!isEdit}>
								Special characters (e.g., !@#$%^&*)
							</Checkbox>
						</div>
						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_pin_history_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_pin_history_req'] : pinEditData.policy_req.is_pin_history_req}
								disabled={!isEdit}>
								Enforce PIN history for last&nbsp;
								{
									isEdit ? <InputNumber
										onChange={(val) => { pinEditData.policy_req.pin_history_period = parseInt(val) }}
										defaultValue={policyRequirements['pin_history_period'].toString()} /> : policyRequirements['pin_history_period']
								} {policyRequirements['pin_history_period'] > 1 ? "PINS" : "PIN"}
							</Checkbox>
						</div>

						<div>
							<Checkbox
								onChange={(e) => pinEditData.policy_req.is_non_consecutive_char_req = e.target.checked}
								defaultChecked={!isEdit ? policyRequirements['is_non_consecutive_char_req'] : pinEditData.policy_req.is_non_consecutive_char_req}
								disabled={!isEdit}>
								No consecutive characters or numbers
							</Checkbox>
						</div>
					</div>

					<div>
						PIN expires in:
					</div>
					<div>
						<div>
							{
								isEdit ? <InputNumber
									onChange={(val) => { pinEditData.policy_req.expires_in_x_days = parseInt(val) }}
									defaultValue={policyRequirements['expires_in_x_days'].toString()} /> : policyRequirements['expires_in_x_days']
							} {policyRequirements['expires_in_x_days'] > 1 ? "days" : "day"}
						</div>
					</div>
				</div>
			</div>
			{pinDisplayData['uid'] !== undefined ?
				(isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={handleCancelClick}>Cancel</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={handleSaveClick}>Save</Button>
				</div> : <></>) : <div style={{ paddingTop: '10px', paddingRight: '45px', paddingBottom: '20px' }}>
					<Button style={{ float: 'right', marginLeft: '10px' }}
						onClick={setCancelClick}>Cancel</Button>
					<Button type='primary' style={{ float: 'right' }}
						onClick={createPinPolicy}>Create</Button></div>
			}
		</Skeleton>
	);
}
