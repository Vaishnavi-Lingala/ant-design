import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Checkbox, Button, InputNumber, Input, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";

import './Policies.css';

import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { openNotification } from "../Layout/Notification";
import { globalPolicyReqFields, policyDisplayNames, policyInfoModel, requiredFieldsErrorMsg } from "../../constants";

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
	const [policyReqFields, setPolicyReqFields]: any = useState({'name': '', 'auth_policy_groups': ''});
	const history = useHistory();
	const accountId = localStorage.getItem('accountId');
	const productId = window.location.pathname.split('/')[2]

	useEffect(() => {
		console.log(productId);
		Promise.all(([
			ApiService.get(ApiUrls.groups(accountId), { type: "USER" }),
			ApiService.get(ApiUrls.policy(accountId, productId, window.location.pathname.split('/')[5]))
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
					history.push(`/product/${productId}/policies/pin`);
				}
			}, error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Groups');
				setLoading(false);
			})
	}, [])

	const validatePinPolicy = (policyData) => {
        let requiredFields:any = [];
        let fields: any = '';
        let errorMsg:string = '';
        globalPolicyReqFields.forEach((eachField: any) => {
            if (eachField?.objectName !== undefined) {
                if (eachField.dataType === 'string') {
                    if (policyData[eachField?.objectName][eachField?.field] === null || policyData[eachField?.objectName][eachField?.field] === '') {
                        requiredFields.push(policyInfoModel[eachField.field]);
                        setPolicyReqFields((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    }  else {
                        setPolicyReqFields((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                } else if (eachField.dataType === 'array') {
                    if (policyData[eachField.field].length <= 0) {
                        requiredFields.push(policyInfoModel[eachField.field]);
                        setPolicyReqFields((prevState) => ({
                            ...prevState,
                            [eachField.field]: 'red'
                        }));
                    } else {
                        setPolicyReqFields((prevState) => ({
                            ...prevState,
                            [eachField.field]: ''
                        }));
                    }
                }
            } else if (eachField.dataType === 'string') {
                if (policyData[eachField.field] === null || policyData[eachField.field] === '') {
                    requiredFields.push(policyInfoModel[eachField.field]);
                    setPolicyReqFields((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setPolicyReqFields((prevState) => ({
                        ...prevState,
                        [eachField.field]: ''
                    }));
                }
            } else if (eachField.dataType === 'array') {
                if (policyData[eachField.field].length <= 0) {
                    requiredFields.push(policyInfoModel[eachField.field]);
                    setPolicyReqFields((prevState) => ({
                        ...prevState,
                        [eachField.field]: 'red'
                    }));
                } else {
                    setPolicyReqFields((prevState) => ({
                        ...prevState,
                        [eachField.field]: ''
                    }));
                }
            }
        })
        if (requiredFields.length) {
            requiredFields.forEach((each, index) => {
                if (index < requiredFields.length - 1) {
                    fields = `${fields} ${each},`
                } else {
                    fields = `${fields} ${each}`
                }
            })
            errorMsg = requiredFieldsErrorMsg + fields;
        } 
        return errorMsg;
    }

	function updatePinPolicy() {
		pinEditData.auth_policy_groups = groupUids;
		const error = validatePinPolicy(pinEditData);
		if(error) {
			openNotification(`error`, error);
		} else {
			ApiService.put(ApiUrls.policy(accountId, productId, pinDisplayData['uid']), pinEditData)
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
	}

	function handleEditClick() {
		setIsEdit(!isEdit);
		setPinEditedData({ ...pinDisplayData });
	}

	function handleCancelClick() {
		setPinEditedData({ ...pinDisplayData });
		setIsEdit(false);
	}

	function handleSaveClick() {
		updatePinPolicy();
	}

	function createPinPolicy() {
		const error = validatePinPolicy(pinEditData);
		if(error) {
			openNotification(`error`, error);
		} else {
			props.handleOk("PIN", pinEditData);
		}	
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
						{/* {pinDisplayData['uid'] === undefined ? <></> :
							<div className="content-heading">Edit Pin Policy</div>
						} */}
					</div>
					<div>
						{pinDisplayData['default'] === false ? <Button style={{ float: 'right' }} onClick={handleEditClick}>
							{!isEdit ? 'Edit' : 'Cancel'}
						</Button> : <></>
						}
					</div>
					<div className="content-policy-key-header" style={{ paddingTop: '20px' }}>
						<p>Policy Name<span className="mandatory">*</span> :</p>
					</div>
					<div style={{ paddingTop: '20px' }}>
						{isEdit ? <Input className="form-control"
							style={{ width: "275px", borderColor: policyReqFields?.name}}
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
						<p>Assigned to groups<span className="mandatory">*</span> :</p>
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
								className= {policyReqFields?.auth_policy_groups === 'red' ? 'select-mandatory' : ''}
								options={groups}
								filterOption={(input, option) =>
									//@ts-ignore
									option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
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
						{policyDisplayNames[pinDisplayData['policy_type']]}
					</div>
				</div>

				<Divider style={{ borderTop: '1px solid #d7d7dc' }} />

				<p className="content-policy-key-header" style={{ padding: '10px 0 10px 0' }}>Pin Settings:</p>

				<div className="row-policy-container">
					<div>Minimum Length:</div>
					<div>
						{
							isEdit ? <InputNumber
								min={4}
								onChange={(value) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, min_length: value }
									}
								})}
								value={pinEditData?.policy_req?.min_length} /> : policyRequirements['min_length']
						}
					</div>

					<div>Maxium Length:</div>
					<div>
						{
							isEdit ? <InputNumber
								onChange={(value) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, max_length: value }
									}
								})}
								value={pinEditData?.policy_req?.max_length} /> : policyRequirements['max_length']
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
								checked={pinEditData?.policy_req?.is_lower_case_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_lower_case_req: e.target.checked }
									}
								})}
							>
								Lower case letter
							</Checkbox>
						</div>

						<div>
							<Checkbox
								checked={pinEditData?.policy_req?.is_upper_case_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_upper_case_req: e.target.checked }
									}
								})}
							>
								Upper case letter
							</Checkbox>
						</div>

						<div>
							<Checkbox
								checked={pinEditData?.policy_req?.is_num_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_num_req: e.target.checked }
									}
								})}
							>
								Number (0-9)
							</Checkbox>
						</div>

						<div>
							<Checkbox
								checked={pinEditData?.policy_req?.is_special_char_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_special_char_req: e.target.checked }
									}
								})}
							>
								Special characters (e.g., !@#$%^&*)
							</Checkbox>
						</div>

						{/* <div>
							<Checkbox
								checked={pinEditData?.policy_req?.is_pin_history_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_pin_history_req: e.target.checked }
									}
								})}
							>
								Enforce PIN history for last &nbsp;
								{
									isEdit ? <InputNumber
										onChange={(value) => setPinEditedData((state) => {
											const { policy_req } = state;
											return {
												...pinEditData,
												policy_req: { ...policy_req, pin_history_period: value }
											}
										})}
										value={pinEditData?.policy_req?.pin_history_period} /> : policyRequirements['pin_history_period']
								} {policyRequirements['pin_history_period'] > 1 ? "PINS" : "PIN"}
							</Checkbox>
						</div> */}

						<div>
							<Checkbox
								checked={pinEditData?.policy_req?.is_non_consecutive_char_req}
								disabled={!isEdit}
								onChange={(e) => setPinEditedData((state) => {
									const { policy_req } = state;
									return {
										...pinEditData,
										policy_req: { ...policy_req, is_non_consecutive_char_req: e.target.checked }
									}
								})}
							>
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
								isEdit ? <InputNumber min={1}
									onChange={(value) => setPinEditedData((state) => {
										const { policy_req } = state;
										return {
											...pinEditData,
											policy_req: { ...policy_req, expires_in_x_days: value }
										}
									})}
									value={pinEditData?.policy_req?.expires_in_x_days} /> : policyRequirements['expires_in_x_days']
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
					<Button type='primary' loading={props.buttonLoading} style={{ float: 'right' }}
						onClick={createPinPolicy}>Create</Button></div>
			}
		</Skeleton>
	);
}
