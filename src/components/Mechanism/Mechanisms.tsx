import { Button, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { useHistory } from 'react-router-dom';

import './Mechanism.css';

import Mechanism from './mechanism';
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';

export default function Mechanisms() {

	const inActivateColumns = [
		{
			title: 'Sort',
			dataIndex: 'sort',
			width: '10%',
			// render: (text: any, record: { mechanism_id: any; }) => (
			// 	<Button onClick={() => reOrderMechanisms(record.mechanism_id, 1)}>
			// 		Sort
			// 	</Button>
			// )
			render: () => <DragHandle />,
		},
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '50%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
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
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={() => activateMechanism(record.mechanism_id)}>
					Activate
				</Button>
			)
		}
	];

	const activateColumns = [
		{
			title: 'Sort',
			dataIndex: 'sort',
			width: '10%',
			className: 'drag-visible',
			render: () => <DragHandle />,
		},
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '50%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={() => getMechanismDetails(record.mechanism_id)}>
					View
				</Button>
			)
		},
		{
			title: 'Status',
			dataIndex: 'inactivate',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={() => inActivateMechanism(record.mechanism_id)}>
					Inactivate
				</Button>
			)
		}
	];

	const [mechanismDetails, setMechanismDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [activeMechanisms, setActiveMechanisms]: any = useState([]);
	const [inActiveMechanisms, setInActiveMechanisms]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const history = useHistory();
	const mechanism = {
		order: 0,
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
		on_tap_out: ""
	}

	useEffect(() => {
		if (window.location.pathname.split("/").length === 3) {
			getMechanismDetails(window.location.pathname.split('/')[2]);
		}
		setLoadingDetails(true);
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
							index: activeCounter + 1
						}
						activeCounter = activeCounter + 1
						activeArray.push(obj);
					}
					else {
						obj = {
							key: i + 1,
							mechanism_name: data[i].name,
							mechanism_id: data[i].uid,
							index: inActiveCounter + 1
						}
						inActiveCounter = inActiveCounter + 1
						inActiveArray.push(obj);
					}
				}
				setActiveMechanisms(activeArray);
				console.log(activeArray);
				setInActiveMechanisms(inActiveArray);
				setLoadingDetails(false);
			})
	}, [])

	function activateMechanism(uid: string) {
		ApiService.get(ApiUrls.activateMechanism(uid))
			.then(data => window.location.reload())
			.catch(error => { })
	}

	function inActivateMechanism(uid: string) {
		ApiService.get(ApiUrls.inActivateMechanism(uid))
			.then(data => window.location.reload())
			.catch(error => {})
	}

	function reOrderMechanisms(uid: string, order: number) {
		var data = {
			mechanism_id: uid,
			order: order
		}
		ApiService.post(ApiUrls.reOrderMechanisms, data)
			.then(data => {
				console.log(data)
				// window.location.reload()
			})
	}

	function getMechanismDetails(uid: string) {
		localStorage.setItem("mechanismUid", uid);
		setLoadingDetails(true);
		ApiService.get(ApiUrls.mechanism(uid))
			.then(data => {
				history.push('/mechanism/' + uid);
				console.log(data);
				console.log(mechanism);
				setMechanismDetails(data);
				setLoadingDetails(false);
			})
			.catch(error => console.log(error))
	}


	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
	const SortableItem = SortableElement(props => <tr {...props} />);
	const SortableBody = SortableContainer(props => <tbody {...props} />);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable([].concat(activeMechanisms), oldIndex, newIndex).filter(
				el => !!el,
			);
			console.log('Sorted items: ', newData);
			setActiveMechanisms(newData);
			//@ts-ignore
			console.log(newData[newIndex].mechanism_id, newData.length - newIndex);
			//@ts-ignore
			reOrderMechanisms(newData[newIndex].mechanism_id, newData.length - newIndex);
		}
	};

	const DraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const DraggableBodyRow = ({ className, style, ...restProps }) => {
		const index = activeMechanisms.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps}/>;
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

			<Skeleton loading={loadingDetails}>
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
							<h4>ACTIVE MECHANISMS</h4>
						</div>

						<Table
							style={{ border: '1px solid #D7D7DC' }}
							showHeader={true}
							columns={activateColumns}
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
							<h4>INACTIVE MECHANISMS</h4>
						</div>
						<Table
							style={{ border: '1px solid #D7D7DC' }}
							showHeader={true}
							columns={inActivateColumns}
							dataSource={inActiveMechanisms}
							pagination={{ position: [] }}
						/>
					</>
				}
			</Skeleton>
		</>
	);
}
