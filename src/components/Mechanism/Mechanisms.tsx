import { Button, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { useHistory } from 'react-router-dom';

import './Mechanism.css';

import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';
import Mechanism from './mechanism';

export default function Mechanisms() {

	const inactiveColumns = [
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '40%'
		},
		{
			title: 'Details',
			dataIndex: 'details',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={() => getMechanismDetails(record.mechanism_id)}>
					View
				</Button>
			)
		},
		{
			title: 'Status',
			dataIndex: 'activate',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; default: any }) => (
				<Button onClick={() => activateMechanism(record.mechanism_id)}>
					Activate
				</Button>
			)
		}
	];

	const activeColumns = [
		{
			title: 'Sort',
			dataIndex: 'sort',
			width: '10%',
			className: 'drag-visible',
			render: (text: any, record: { default: any }) => (
				record.default === false ? <DragHandle /> : <></>
			)
		},
		{
			title: 'Order',
			dataIndex: 'mechanism_order',
			width: '10%'
		},
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '40%'
		},
		{
			title: 'Details',
			dataIndex: 'details',
			width: '20%',
			render: (text: any, record: { mechanism_id: any }) => (
				<Button onClick={() => getMechanismDetails(record.mechanism_id)}>
					View
				</Button>
			)
		},
		{
			title: 'Status',
			dataIndex: 'deactivate',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; default: any }) => (
				record.default === false ?
					<Button onClick={() => deActivateMechanism(record.mechanism_id)}>
						Deactivate
					</Button> : <></>
			)
		}
	];

	const [mechanismDetails, setMechanismDetails] = useState(undefined);
	const [loading, setLoading] = useState(false);
	const [activeMechanisms, setActiveMechanisms]: any = useState([]);
	const [inactiveMechanisms, setInactiveMechanisms]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const history = useHistory();
	const mechanism = {
		challenge_factors: [
			{
				order: 0,
				factor: "",
				name: "Challenge_Test_1",
				password_grace_period: "TWO_HOURS"
			},
			{
				order: 1,
				factor: "",
				name: "Challenge_Test_2",
				password_grace_period: null
			}
		],
		reader_type: "",
		product_id: "oprc735871d0",
		name: "",
		on_tap_out: null,
		mechanism_groups: [],
		default: false,
		order: null,
		active: false,
		account_id: "ooa46c499ccb"
	}

	useEffect(() => {
		if (window.location.pathname.split("/").length === 3) {
			getMechanismDetails(window.location.pathname.split('/')[2]);
		}
		setLoading(true);
		ApiService.get(ApiUrls.mechanisms)
			.then(data => {
				console.log(data);
				var activeCounter = 0;
				var inActiveCounter = 0;
				var activeArray: any = [];
				var inActiveArray: any = [];
				for (var i = 0; i < data.length; i++) {
					var obj;
					if (data[i].active === true) {
						obj = {
							key: i + 1,
							mechanism_name: data[i].name,
							mechanism_id: data[i].uid,
							default: data[i].default,
							index: activeCounter + 1,
							mechanism_order: data[i].order
						}
						activeCounter = activeCounter + 1
						activeArray.push(obj);
					}
					else {
						obj = {
							key: i + 1,
							mechanism_name: data[i].name,
							mechanism_id: data[i].uid,
							index: inActiveCounter + 1,
							mechanism_order: data[i].order
						}
						inActiveCounter = inActiveCounter + 1
						inActiveArray.push(obj);
					}
				}
				setActiveMechanisms(activeArray);
				console.log(activeArray);
				setInactiveMechanisms(inActiveArray);
				setLoading(false);
			})
	}, [])

	function activateMechanism(uid: string) {
		ApiService.get(ApiUrls.activateMechanism(uid))
			.then(data => window.location.reload())
			.catch(error => { })
	}

	function deActivateMechanism(uid: string) {
		ApiService.get(ApiUrls.deActivateMechanism(uid))
			.then(data => window.location.reload())
			.catch(error => { })
	}

	function reOrderMechanisms(uid: string, order: number) {
		var data = {
			mechanism_id: uid,
			order: order
		}
		ApiService.post(ApiUrls.reOrderMechanisms, data)
			.then(data => {
				console.log(data)
				window.location.reload()
			})
	}

	function getMechanismDetails(uid: string) {
		localStorage.setItem("mechanismUid", uid);
		setLoading(true);
		ApiService.get(ApiUrls.mechanism(uid))
			.then(data => {
				history.push('/mechanism/' + uid);
				console.log(data);
				console.log(mechanism);
				setMechanismDetails(data);
				setLoading(false);
			})
			.catch(error => console.log(error))
	}


	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
	const SortableItem = SortableElement(props => <tr {...props} />);
	const SortableBody = SortableContainer(props => <tbody {...props} />);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex != activeMechanisms.length - 1) {
			const newData = arrayMoveImmutable([].concat(activeMechanisms), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveMechanisms(newData);
			//@ts-ignore
			console.log(newData[newIndex].mechanism_id, newData.length - newIndex - 1);
			//@ts-ignore
			reOrderMechanisms(newData[newIndex].mechanism_id, newData.length - newIndex - 1);
		}
	};

	const DraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const DraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activeMechanisms.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	return (
		<>
			<div className='content-header'>
				Mechanism
				{mechanismDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setMechanismDetails(undefined)
					history.push('/mechanism')
				}}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loading}>
				{mechanismDetails ? <Mechanism mechanismDetails={mechanismDetails} /> :
					isModalVisible ? <Mechanism mechanismDetails={mechanism} /> : <>
						<div style={{
							width: '100%', border: '1px solid #D7D7DC',
							borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
						}}
						>
							<Button type='primary' size='large' onClick={() => setIsModalVisible(true)}>
								Add New Mechanism
							</Button>
						</div>

						<div style={{
							width: '100%', border: '1px solid #D7D7DC',
							borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
						}}
						>
							<h4>ACTIVE</h4>
						</div>

						<Table
							style={{ border: '1px solid #D7D7DC' }}
							showHeader={true}
							columns={activeColumns}
							dataSource={activeMechanisms}
							rowKey={"index"}
							components={{
								body: {
									wrapper: DraggableContainer,
									row: DraggableBodyRow,
								},
							}}
							pagination={{ position: [] }}
						/>
						<br />

						<div style={{
							width: '100%', border: '1px solid #D7D7DC',
							borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
						}}
						>
							<h4>INACTIVE</h4>
						</div>
						<Table
							style={{ border: '1px solid #D7D7DC' }}
							showHeader={true}
							columns={inactiveColumns}
							dataSource={inactiveMechanisms}
							pagination={{ position: [] }}
						/>
					</>
				}
			</Skeleton>
		</>
	);
}
