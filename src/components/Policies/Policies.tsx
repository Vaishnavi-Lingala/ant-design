import { Button, Input, Modal, Skeleton, Table, Tabs } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

import './Policies.css';

import { PinPolicy } from './pinPolicy';
import { PasswordPolicy } from './passwordPolicy'
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { KioskPolicy } from './kioskPolicy';

import { openNotification } from '../Layout/Notification';
import { CARD_ENROLL, KIOSK, PASSWORD, PIN, TecTANGO } from '../../constants';
import CardEnrollmentPolicy from './CardEnrollmentPolicy';

export default function Policies() {

	const activateColumns = [
		{
			title: 'Sort',
			dataIndex: 'sort',
			width: '5%',
			className: 'drag-visible',
			render: (text: any, record: { default: any }) => (
				record.default === false ? <DragHandle /> : <></>
			)
		},
		{
			title: 'Order',
			dataIndex: 'order',
			width: '10%'
		},
		{
			title: 'Policy Name',
			dataIndex: 'policy_name',
			width: '15%'
		},
		{
			title: 'Policy Description',
			dataIndex: 'policy_description',
			width: '40%'
		},
		{
			title: 'Details',
			dataIndex: 'details',
			width: '10%',
			render: (text: any, record: { policy_id: any; }) => (
				<Button onClick={() => getPolicyDetails(record.policy_id)}>
					View
				</Button>
			)
		},
		{
			title: 'Status',
			dataIndex: 'details',
			width: '30%',
			render: (text: any, record: { policy_id: any; default: any }) => (
				record.default === false ?
					<Button onClick={() => deActivatePolicy(record.policy_id)}>
						Deactivate
					</Button> : <></>
			)
		}
	];

	const deActivateColumns = [
		{
			title: 'Policy Name',
			dataIndex: 'policy_name',
			width: '20%'
		},
		{
			title: 'Policy Description',
			dataIndex: 'policy_description',
			width: '50%'
		},
		{
			title: 'Details',
			dataIndex: 'details',
			width: '10%',
			render: (text: any, record: { policy_id: any; }) => (
				<Button onClick={() => getPolicyDetails(record.policy_id)}>
					View
				</Button>
			)
		},
		{
			title: 'Status',
			dataIndex: 'details',
			width: '30%',
			render: (text: any, record: { policy_id: any; default: any }) => (
				record.default === false ?
					<Button onClick={() => activatePolicy(record.policy_id)}>
						Activate
					</Button> : <></>
			)
		}
	];

	const currentSeletedProduct = localStorage.getItem("productName");

	const [pinDetails, setPinDetails] = useState(undefined);
	const [passwordDetails, setPasswordDetails] = useState(undefined);
	const [kioskDetails, setKioskDetails] = useState(undefined);
	const [cardEnrollPolicy, setCardEnrollPolicy] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [activePinPolicies, setActivePinPolicies]: any = useState([]);
	const [inActivePinPolicies, setInActivePinPolicies]: any = useState([]);
	const [activePasswordPolicies, setActivePasswordPolicies]: any = useState([]);
	const [inActivepasswordPolicies, setInActivePasswordPolicies]: any = useState([]);
	const [activeKioskPolicies, setActiveKioskPolicies]: any = useState([]);
	const [inActiveKioskPolicies, setInActiveKioskPolicies]: any = useState([]);
	const [activeCardEnrollmentPolicies, setActiveCardEnrollmentPolicies] = useState([]);
	const [inActiveCardEnrollmentPolicies, setInActiveCardEnrollmentPolicies] = useState([]);
	const [isPinModalVisible, setIsPinModalVisible] = useState(false);
	const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
	const [isKioskModalVisible, setIsKioskModalVisible] = useState(false);
	const [isCardEnrollmentModalVisible, setIsCardEnrollmentModalVisible] = useState(false);
	const [tabname, setTabname] = useState("");
	const [maxEnroll, setMaxEnroll] = useState(null);
	const { TabPane } = Tabs;

	const pinData = {
		description: '',
		name: '',
		order: 0,
		policy_type: PIN,
		auth_policy_groups: [],
		policy_req: {
			expires_in_x_days: 1,
			is_special_char_req: false,
			pin_history_period: 0,
			min_length: 4,
			is_upper_case_req: false,
			is_lower_case_req: false,
			is_non_consecutive_char_req: false,
			max_length: 4,
			is_pin_history_req: false,
			is_num_req: true
		}
	}

	const passwordData = {
		description: '',
		name: '',
		order: 0,
		auth_policy_groups: [],
		policy_type: PASSWORD,
		policy_req: {
			grace_period: ''
		}
	}

	const kioskData = {
		policy_req: {
			access_key_id: "",
			assay: ""
		},
		auth_policy_groups: [],
		policy_type: KIOSK,
		kiosk_machine_groups: [],
		name: "",
		description: "",
	}

	const cardEnrollData = {
		policy_req: {
			access_key_id: "",
			assay: ""
		},
		auth_policy_groups: [],
		policy_type: CARD_ENROLL.replace("_", " "),
		kiosk_machine_groups: [],
		name: "",
		description: "",
	}

	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
	const SortableItem = SortableElement(props => <tr {...props} />);
	const SortableBody = SortableContainer(props => <tbody {...props} />);

	const handlePinSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex != activePinPolicies.length - 1) {
			const newData = arrayMoveImmutable([].concat(activePinPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActivePinPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, PIN);
		}
	};

	const pinDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={handlePinSortEnd}
			{...props}
		/>
	);

	const pinDraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activePinPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const handlePasswordSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex != activePasswordPolicies.length - 1) {
			const newData = arrayMoveImmutable([].concat(activePasswordPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActivePasswordPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, PASSWORD);
		}
	};

	const passwordDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={handlePasswordSortEnd}
			{...props}
		/>
	);

	const passwordDraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activePasswordPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const handleKioskSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex != activeKioskPolicies.length - 1) {
			const newData = arrayMoveImmutable([].concat(activeKioskPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveKioskPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, KIOSK);
		}
	};

	const kioskDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={handleKioskSortEnd}
			{...props}
		/>
	);

	const CardEnrollmentDraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activeKioskPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const handleCardEnrollmentSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex != activeCardEnrollmentPolicies.length - 1) {
			const newData = arrayMoveImmutable([].concat(activeCardEnrollmentPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveCardEnrollmentPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, CARD_ENROLL);
		}
	};

	const CardEnrollmentDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={handleCardEnrollmentSortEnd}
			{...props}
		/>
	);

	const kioskDraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activeKioskPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	function getPolicies() {
		setLoadingDetails(true)
		ApiService.get(ApiUrls.policies)
			.then(data => {
				console.log(data);
				var pinCounter = 0;
				var passwordCounter = 0;
				var kioskCounter = 0;
				var cardEnrollCounter = 0;
				var pinActive: any = [];
				var pinInActive: any = [];
				var passwordActive: any = [];
				var passwordInActive: any = [];
				var kioskActive: any = [];
				var kioskInActive: any = [];
				var cardEnrollActive: any = [];
				var cardEnrollInActive: any = [];
				for (var i = 0; i < data.length; i++) {
					var object;
					if (data[i].policy_type === PIN) {
						if (data[i].active === true) {
							object = {
								key: pinCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								order: data[i].order,
								default: data[i].default,
								index: pinCounter + 1
							}
							pinCounter = pinCounter + 1;
							pinActive.push(object);
						}
						else {
							object = {
								key: pinCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								default: data[i].default,
								index: pinCounter + 1
							}
							pinCounter = pinCounter + 1;
							pinInActive.push(object);
						}
					}

					if (data[i].policy_type === PASSWORD) {
						if (data[i].active === true) {
							object = {
								key: passwordCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								order: data[i].order,
								default: data[i].default,
								index: passwordCounter + 1
							}
							passwordCounter = passwordCounter + 1;
							passwordActive.push(object);
						}
						else {
							object = {
								key: passwordCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								default: data[i].default,
								index: passwordCounter + 1
							}
							passwordCounter = passwordCounter + 1;
							passwordInActive.push(object);
						}
					}

					if (data[i].policy_type === KIOSK) {
						if (data[i].active === true) {
							object = {
								key: kioskCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								order: data[i].order,
								default: data[i].default,
								index: kioskCounter + 1
							}
							kioskCounter = kioskCounter + 1;
							kioskActive.push(object);
						}
						else {
							object = {
								key: kioskCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								default: data[i].default,
								index: kioskCounter + 1
							}
							kioskCounter = kioskCounter + 1;
							kioskInActive.push(object);
						}
					}

					if (data[i].policy_type === CARD_ENROLL) {
						if (data[i].active === true) {
							object = {
								key: cardEnrollCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								order: data[i].order,
								default: data[i].default,
								index: cardEnrollCounter + 1
							}
							cardEnrollCounter = cardEnrollCounter + 1;
							cardEnrollActive.push(object);
						}
						else {
							object = {
								key: cardEnrollCounter + 1,
								policy_name: data[i].name,
								policy_id: data[i].uid,
								policy_description: data[i].description,
								default: data[i].default,
								index: cardEnrollCounter + 1
							}
							cardEnrollCounter = cardEnrollCounter + 1;
							cardEnrollInActive.push(object);
						}
					}
				}
				setActivePinPolicies(pinActive);
				setInActivePinPolicies(pinInActive);
				setActivePasswordPolicies(passwordActive);
				setInActivePasswordPolicies(passwordInActive);
				setActiveKioskPolicies(kioskActive);
				setInActiveKioskPolicies(kioskInActive);
				setActiveCardEnrollmentPolicies(cardEnrollActive);
				setInActiveCardEnrollmentPolicies(cardEnrollInActive);
				setLoadingDetails(false);
			}, error => {
				console.log(error)
				openNotification('error', 'An Error has occured with getting Policies');
			})
	}

	useEffect(() => {
		if (window.location.pathname.split("/")[2] !== 'password' && window.location.pathname.split("/")[2] !== 'kiosk' && window.location.pathname.split("/").length !== 4) {
			history.push('/policies/pin');
			setTabname(window.location.pathname.split('/')[2].toUpperCase());
		}

		if (window.location.pathname.split("/").length === 4) {
			getPolicyDetails(window.location.pathname.split("/")[3]);
		}

		getPolicies();
	}, []);

	useEffect(() => {
		(async function () {
			if (currentSeletedProduct === TecTANGO) {
				try {
					let licenses = await ApiService.get(ApiUrls.licences);
					licenses.forEach(license => {
						if (license.product.sku === TecTANGO && license.max_enroll_allowed) {
							setMaxEnroll(license.max_enroll_allowed);
						}
					})
				}
				catch (err) {
					console.log(err);
				}
			}
		})();
	}, []);

	const history = useHistory();

	function activatePolicy(uid: string) {
		ApiService.get(ApiUrls.activatePolicy(uid))
			.then(data => {
				if (!data.errorSummary) {
					openNotification('success', 'Successfully activated Policy');
					getPolicies();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with activating Policy');
			})
	}

	function deActivatePolicy(uid: string) {
		ApiService.get(ApiUrls.deActivatePolicy(uid))
			.then(data => {
				if (!data.errorSummary) {
					openNotification('success', 'Successfully de-activated Policy');
					getPolicies();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with de-activating Policy');
			})
	}

	function reOrderPolicies(uid: string, order: number, policyType: string) {
		var data = {
			order: order,
			auth_policy_uid: uid,
			policy_type: policyType
		}
		ApiService.post(ApiUrls.reOrderPolicies, data)
			.then(data => {
				if (!data.errorSummary) {
					console.log(data)
					getPolicies();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			}, error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with re-ordering Policies');
			})
	}

	function getPolicyDetails(uid: any) {
		localStorage.setItem("policyUid", uid);
		setLoadingDetails(true);
		ApiService.get(ApiUrls.policy(uid))
			.then(data => {
				if (!data.errorSummary) {
					console.log(data);
					if (data.policy_type === PIN) {
						history.push('/policies/pin/' + uid);
						setPinDetails(data);
					}
					if (data.policy_type === PASSWORD) {
						history.push('/policies/password/' + uid);
						setPasswordDetails(data);
					}
					if (data.policy_type === KIOSK) {
						history.push('/policies/kiosk/' + uid);
						setKioskDetails(data);
					}
					if (data.policy_type === CARD_ENROLL) {
						history.push('/policies/card-enrollment/' + uid);
						setCardEnrollPolicy(data);
					}
					setLoadingDetails(false);
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
					setInterval(() => {
						history.goBack();
					}, 2000)
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Policy Details');
				setLoadingDetails(false);
			})
	}

	const handleOk = (policyType: string, object: object) => {
		ApiService.post(ApiUrls.addPolicy, object)
			.then(data => {
				if (!data.errorSummary) {
					console.log(data);
					openNotification('success', `Successfully added ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
					getPolicies();
					if (policyType === "PIN") {
						setIsPinModalVisible(false);
					}
					if (policyType === "PASSWORD") {
						setIsPasswordModalVisible(false);
					} if (policyType === "KIOSK") {
						setIsKioskModalVisible(false);
					}
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			}, error => {
				console.error('Error: ', error);
				openNotification('error', `An Error has occured with adding ${policyType.slice(0, 1) + policyType.slice(1).toLowerCase()} Policy`);
			})
	}

	const handleCancel = (policyType: string) => {
		if (policyType === "PIN") {
			setIsPinModalVisible(false);
		}
		if (policyType === "PASSWORD") {
			setIsPasswordModalVisible(false);
		} if (policyType === "KIOSK") {
			setIsKioskModalVisible(false);
		}
	}

	return (
		<>
			<div className='content-header'>
				Policy
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
				{kioskDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setKioskDetails(undefined)
					history.push('/policies/kiosk')
				}}>
					Back
				</Button> : <></>}
				{cardEnrollPolicy ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setCardEnrollPolicy(undefined);
					history.push('/policies/card-enrollment');
				}}>
					Back
				</Button> : <></>}
			</div>

			<Tabs defaultActiveKey={window.location.pathname.split("/")[2]}
				type="card" size={"middle"} animated={false}
				tabBarStyle={{ marginBottom: '0px' }}
				onChange={(key) => {
					history.push("/policies/" + key);
					setTabname(key.toUpperCase());
				}}
				onClick={() => {
					if(tabname === "PIN")
					{
						setPasswordDetails(undefined);
						setKioskDetails(undefined);
					}
					if(tabname === "PASSWORD")
					{
						setPinDetails(undefined);
						setKioskDetails(undefined);
					}
					if(tabname === "KIOSK")
					{
						setPasswordDetails(undefined);
						setPinDetails(undefined);
					}
				}}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
				<TabPane tab="Pin" key="pin">
					<Skeleton loading={loadingDetails}>
						{pinDetails ? <PinPolicy pinDetails={pinDetails} /> :
							isPinModalVisible ? <PinPolicy pinDetails={pinData} handleOk={handleOk} handleCancel={handleCancel} /> :
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

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										ACTIVE
									</div>

									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={activateColumns}
										dataSource={activePinPolicies}
										rowKey={"index"}
										components={{
											body: {
												wrapper: pinDraggableContainer,
												row: pinDraggableBodyRow,
											},
										}}
										pagination={false}
									/>

									<br />

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										INACTIVE
									</div>
									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={deActivateColumns}
										dataSource={inActivePinPolicies}
										pagination={false}
									/>
								</>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab="Password" key="password">
					<Skeleton loading={loadingDetails}>
						{passwordDetails ? <PasswordPolicy passwordDetails={passwordDetails} /> :
							isPasswordModalVisible ? <PasswordPolicy passwordDetails={passwordData} handleOk={handleOk} handleCancel={handleCancel} /> :
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

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										ACTIVE
									</div>
									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={activateColumns}
										dataSource={activePasswordPolicies}
										rowKey={"index"}
										components={{
											body: {
												wrapper: passwordDraggableContainer,
												row: passwordDraggableBodyRow,
											},
										}}
										pagination={false}
									/>

									<br />

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										INACTIVE
									</div>
									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={deActivateColumns}
										dataSource={inActivepasswordPolicies}
										pagination={false}
									/>
								</>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab="Kiosk" key="kiosk">
					<Skeleton loading={loadingDetails}>
						{kioskDetails ? <KioskPolicy kioskDetails={kioskDetails} /> :
							isKioskModalVisible ? <KioskPolicy kioskDetails={kioskData} handleOk={handleOk} handleCancel={handleCancel} /> :
								<>
									<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
										<Button type='primary' size='large' onClick={() => {
											setIsKioskModalVisible(true)
											history.push('/policies/kiosk')
										}}
										>
											Add Kiosk Policy
										</Button>
									</div>

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										ACTIVE
									</div>
									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={activateColumns}
										dataSource={activeKioskPolicies}
										rowKey={"index"}
										components={{
											body: {
												wrapper: kioskDraggableContainer,
												row: kioskDraggableBodyRow,
											},
										}}
										pagination={false}
									/>

									<br />

									<div style={{
										fontWeight: 600, fontSize: 'x-large',
										width: '100%', border: '1px solid #D7D7DC',
										borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
									}}
									>
										INACTIVE
									</div>
									<Table
										style={{ border: '1px solid #D7D7DC' }}
										showHeader={true}
										columns={deActivateColumns}
										dataSource={inActiveKioskPolicies}
										pagination={false}
									/>
								</>
						}
					</Skeleton>
				</TabPane>
				{currentSeletedProduct === TecTANGO && maxEnroll ?
					<TabPane tab="Card enrollment" key="card-enrollment">
						<Skeleton loading={loadingDetails}>
							{cardEnrollPolicy ? <CardEnrollmentPolicy policyDetails={cardEnrollPolicy} /> :
								isCardEnrollmentModalVisible ? <CardEnrollmentPolicy policyDetails={cardEnrollData} /> :
									<>
										<div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
											<Button type='primary' size='large' onClick={() => {
												setIsCardEnrollmentModalVisible(true);
												history.push('/policies/card-enrollment');
											}}
											>
												Add Card Enrollment Policy
											</Button>
										</div>

										<div style={{
											fontWeight: 600, fontSize: 'x-large',
											width: '100%', border: '1px solid #D7D7DC',
											borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
										}}
										>
											ACTIVE
										</div>
										<Table
											style={{ border: '1px solid #D7D7DC' }}
											showHeader={true}
											columns={activateColumns}
											dataSource={activeCardEnrollmentPolicies}
											rowKey={"index"}
											components={{
												body: {
													wrapper: CardEnrollmentDraggableContainer,
													row: CardEnrollmentDraggableBodyRow,
												},
											}}
											pagination={{ position: [] }}
										/>

										<br />

										<div style={{
											fontWeight: 600, fontSize: 'x-large',
											width: '100%', border: '1px solid #D7D7DC',
											borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
										}}
										>
											INACTIVE
										</div>
										<Table
											style={{ border: '1px solid #D7D7DC' }}
											showHeader={true}
											columns={deActivateColumns}
											dataSource={inActiveCardEnrollmentPolicies}
											pagination={{ position: [] }}
										/>
									</>
							}
						</Skeleton>
					</TabPane> : null}
			</Tabs>
		</>
	);
}
