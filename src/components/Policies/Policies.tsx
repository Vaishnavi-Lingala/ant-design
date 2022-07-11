import { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Button, Skeleton, Tabs, Tooltip } from 'antd';
import { BarsOutlined, MenuOutlined, PoweroffOutlined, StopOutlined } from "@ant-design/icons"
import { arrayMoveImmutable } from 'array-move';

import './Policies.css';

import CardEnrollmentPolicy from './CardEnrollmentPolicy';
import { KioskPolicy } from './kioskPolicy';
import { PasswordPolicy } from './passwordPolicy'
import { PinPolicy } from './pinPolicy';
import TableList from './tableList';
import { openNotification } from '../Layout/Notification';
import ProtectedRoute from '../ProtectedRoute';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { BIO, BioDescription, CardEnrollmentPolicyDescription, CARD_ENROLL, KIOSK, KioskPolicyDescription, PASSWORD, PasswordPolicyDescription, PIN, PinPolicyDescription, policyDisplayNames, TecBIO, TecTANGO } from '../../constants';
import { Store } from '../../Store';
import BioPolicy from './BioPolicy';

export default function Policies() {
	const history = useHistory();
	const [seletedProduct] = useContext(Store);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [loading, setLoading] = useState(false);
	const [activePinPolicies, setActivePinPolicies]: any = useState([]);
	const [inActivePinPolicies, setInActivePinPolicies]: any = useState([]);
	const [activePasswordPolicies, setActivePasswordPolicies]: any = useState([]);
	const [inActivepasswordPolicies, setInActivePasswordPolicies]: any = useState([]);
	const [activeKioskPolicies, setActiveKioskPolicies]: any = useState([]);
	const [inActiveKioskPolicies, setInActiveKioskPolicies]: any = useState([]);
	const [activeCardEnrollmentPolicies, setActiveCardEnrollmentPolicies] = useState([]);
	const [inActiveCardEnrollmentPolicies, setInActiveCardEnrollmentPolicies] = useState([]);
	const [activeBioPolicies, setActiveBioPolicies]: any = useState([]);
	const [inActiveBioPolicies, setInActiveBioPolicies]: any = useState([]);
	const path = window.location.pathname.split('/').length;
	const [maxEnroll, setMaxEnroll] = useState(null);
	const { productId } = useParams<any>();
	const { TabPane } = Tabs;
	const accountId = localStorage.getItem('accountId');

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
				<Tooltip title="View">
					<Button icon={<BarsOutlined />} onClick={() => {
						history.push(`/product/${productId}/policies/` + window.location.pathname.split("/")[4] + "/" + record.policy_id);
					}}>
					</Button>
				</Tooltip>
			)
		},
		{
			title: 'Status',
			dataIndex: 'details',
			width: '30%',
			render: (text: any, record: { policy_id: any; default: any }) => (
				record.default === false ?
					<Tooltip title="Deactivate">
						<Button icon={<StopOutlined />} onClick={() => deActivatePolicy(record.policy_id)}>
						</Button>
					</Tooltip> : <></>
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
				<Tooltip title="View">
					<Button icon={<BarsOutlined />} onClick={() => {
						history.push(`/product/${localStorage.getItem("productId")}/policies/` + window.location.pathname.split("/")[4] + "/" + record.policy_id);
					}}>
					</Button>
				</Tooltip>
			)
		},
		{
			title: 'Status',
			dataIndex: 'details',
			width: '30%',
			render: (text: any, record: { policy_id: any; default: any }) => (
				record.default === false ?
					<Tooltip title="Activate">
						<Button icon={<PoweroffOutlined />} onClick={() => activatePolicy(record.policy_id)}>
						</Button>
					</Tooltip> : <></>
			)
		}
	];

	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
	const SortableItem = SortableElement(props => <tr {...props} />);
	const SortableBody = SortableContainer(props => <tbody {...props} />);

	const handlePinSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex !== activePinPolicies.length - 1) {
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
		if (oldIndex !== newIndex && newIndex !== activePasswordPolicies.length - 1) {
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
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable([].concat(activeKioskPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveKioskPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex, KIOSK);
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

	const kioskDraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activeKioskPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const CardEnrollmentDraggableBodyRow = ({ className, style, ...restProps }) => {
		//@ts-ignore	
		const index = activeCardEnrollmentPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const handleCardEnrollmentSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex !== activeCardEnrollmentPolicies.length - 1) {
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

	const BioDraggableBodyRow = ({ className, style, ...restProps }) => {
		//@ts-ignore	
		const index = activeBioPolicies.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const handleBioSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex !== activeBioPolicies.length - 1) {
			const newData = arrayMoveImmutable([].concat(activeBioPolicies), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveBioPolicies(newData);
			//@ts-ignore
			console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, BIO);
		}
	};

	const BioDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={handleBioSortEnd}
			{...props}
		/>
	);

	function handleGetPolicies() {
		getPolicies();
	}

	function getPolicies() {
		console.log(path);
		if (path === 5) {
			setLoadingDetails(true)
			ApiService.get(ApiUrls.policies(accountId, productId))
				.then(data => {
					console.log(data);
					var pinCounter = 0;
					var passwordCounter = 0;
					var kioskCounter = 0;
					var cardEnrollCounter = 0;
					var bioCounter = 0;
					var pinActive: any = [];
					var pinInActive: any = [];
					var passwordActive: any = [];
					var passwordInActive: any = [];
					var kioskActive: any = [];
					var kioskInActive: any = [];
					var cardEnrollActive: any = [];
					var cardEnrollInActive: any = [];
					var bioActive: any = [];
					var bioInActive: any = [];
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

						if (data[i].policy_type === BIO) {
							if (data[i].active === true) {
								object = {
									key: bioCounter + 1,
									policy_name: data[i].name,
									policy_id: data[i].uid,
									policy_description: data[i].description,
									order: data[i].order,
									default: data[i].default,
									index: bioCounter + 1
								}
								bioCounter = bioCounter + 1;
								bioActive.push(object);
							}
							else {
								object = {
									key: bioCounter + 1,
									policy_name: data[i].name,
									policy_id: data[i].uid,
									policy_description: data[i].description,
									default: data[i].default,
									index: bioCounter + 1
								}
								bioCounter = bioCounter + 1;
								bioInActive.push(object);
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
					setActiveBioPolicies(bioActive);
					setInActiveBioPolicies(bioInActive);
					setLoadingDetails(false);
				}, error => {
					console.log(error)
					openNotification('error', 'An Error has occured with getting Policies');
				})
		}

		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}

	useEffect(() => {
		if (window.location.pathname.split("/").length === 4) {
			history.push(`/product/${localStorage.getItem("productId")}/policies/pin`);
		}

		getPolicies();
	}, [path]);

	useEffect(() => {
		(async function () {
			if (seletedProduct === TecTANGO) {
				try {
					let licenses = await ApiService.get(ApiUrls.licences(accountId));
					console.log(licenses);
					licenses.forEach(license => {
						if (license.product.sku === TecTANGO && license.max_enroll_allowed) {
							setMaxEnroll(license.max_enroll_allowed);
						}
					})
				}
				catch (err) {
					console.log(err);
					openNotification("error", "Error has occured while getting details");
				}
			}
		})();
	}, []);

	function activatePolicy(uid: string) {
		console.log(uid);
		ApiService.get(ApiUrls.activatePolicy(accountId, productId, uid))
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
		console.log(uid);
		ApiService.get(ApiUrls.deActivatePolicy(accountId, productId, uid))
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
		ApiService.post(ApiUrls.reOrderPolicies(accountId, productId), data)
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

	return (
		<>
			<div className='content-header'>
				Policy
				{window.location.pathname.split('/').length === 6 ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					history.push(`/product/${productId}/policies/` + window.location.pathname.split('/')[4]);
				}}>
					Back
				</Button> : <></>}
			</div>

			<Tabs activeKey={window.location.pathname.split("/")[4]}
				type="card" size={"middle"} animated={false}
				tabBarStyle={{ marginBottom: '0px' }}
				onChange={(key) => {
					history.push(`/product/${productId}/policies/` + key);
				}}
			>
				<TabPane tab={policyDisplayNames[PIN]} key="pin">
					<Skeleton loading={loadingDetails}>
						{window.location.pathname.split('/').length === 6 ?
							<ProtectedRoute path={`/product/${productId}/policies/pin/:id`} component={PinPolicy} subRoute /> :
							<TableList policy_type={PIN} policy_description={PinPolicyDescription}
								activateColumns={activateColumns} deActivateColumns={deActivateColumns} draggableBodyRow={pinDraggableBodyRow}
								draggableContainer={pinDraggableContainer} inActivePolicies={inActivePinPolicies} activePolicies={activePinPolicies}
								handleGetPolicies={handleGetPolicies}
							/>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab={policyDisplayNames[PASSWORD]} key="password">
					<Skeleton loading={loadingDetails}>
						{window.location.pathname.split('/').length === 6 ?
							<ProtectedRoute path={`/product/${productId}/policies/password/:id`} component={PasswordPolicy} subRoute /> :
							<TableList policy_type={PASSWORD} policy_description={PasswordPolicyDescription} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
								draggableBodyRow={passwordDraggableBodyRow} draggableContainer={passwordDraggableContainer}
								inActivePolicies={inActivepasswordPolicies} activePolicies={activePasswordPolicies} handleGetPolicies={handleGetPolicies}
							/>
						}
					</Skeleton>
				</TabPane>
				<TabPane tab={policyDisplayNames[KIOSK]} key="kiosk">
					<Skeleton loading={loadingDetails}>
						{window.location.pathname.split('/').length === 6 ?
							<ProtectedRoute path={`/product/${productId}/policies/kiosk/:id`} component={KioskPolicy} subRoute /> :
							<TableList policy_type={KIOSK} policy_description={KioskPolicyDescription} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
								draggableBodyRow={kioskDraggableBodyRow} draggableContainer={kioskDraggableContainer}
								inActivePolicies={inActiveKioskPolicies} activePolicies={activeKioskPolicies} handleGetPolicies={handleGetPolicies}
							/>
						}
					</Skeleton>
				</TabPane>
				{
					seletedProduct === TecTANGO && maxEnroll ?
						<TabPane tab={policyDisplayNames[CARD_ENROLL]} key="card-enrollment">
							<Skeleton loading={loadingDetails}>
								{window.location.pathname.split('/').length === 6 ?
									<ProtectedRoute path={`/product/${productId}/policies/card-enrollment/:id`} component={CardEnrollmentPolicy} subRoute /> :
									<TableList policy_type={CARD_ENROLL} policy_description={CardEnrollmentPolicyDescription} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
										draggableBodyRow={CardEnrollmentDraggableBodyRow} draggableContainer={CardEnrollmentDraggableContainer}
										inActivePolicies={inActiveCardEnrollmentPolicies} activePolicies={activeCardEnrollmentPolicies} handleGetPolicies={handleGetPolicies}
									/>
								}
							</Skeleton>
						</TabPane> : null

				}
				{
					seletedProduct === TecBIO ?
						<TabPane tab={policyDisplayNames[BIO]} key="bio">
							<Skeleton loading={loadingDetails}>
								{window.location.pathname.split('/').length === 6 ?
									<ProtectedRoute path={`/product/${productId}/policies/bio/:id`} component={BioPolicy} subRoute /> :
									<TableList policy_type={BIO} policy_description={BioDescription} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
										draggableBodyRow={BioDraggableBodyRow} draggableContainer={BioDraggableContainer}
										inActivePolicies={inActiveBioPolicies} activePolicies={activeBioPolicies} handleGetPolicies={handleGetPolicies}
									/>
								}
							</Skeleton>
						</TabPane> : null
				}
			</Tabs>
		</>
	);
}
