import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Button, Skeleton, Table, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { BarsOutlined, CloseOutlined, MenuOutlined, PoweroffOutlined, StopOutlined } from "@ant-design/icons"
import { arrayMoveImmutable } from 'array-move';

import './Mechanism.css';

import Mechanism from './mechanism';
import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';

export default function Mechanisms() {
	const [loading, setLoading] = useState(false);
	const [activeMechanisms, setActiveMechanisms]: any = useState([]);
	const [inactiveMechanisms, setInactiveMechanisms]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const history = useHistory();
    const [buttonLoading, setButtonLoading] = useState(false);
	const { productId } = useParams();

	const inactiveColumns = [
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '60%'
		},
		{
			title: 'Details',
			dataIndex: 'details',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Tooltip title="View">
					<Button icon={<BarsOutlined />} onClick={() => {
						history.push(`/product/${productId}/mechanism/${record.mechanism_id}`);
					}}>
					</Button>
				</Tooltip>
			)
		},
		{
			title: 'Status',
			dataIndex: 'activate',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; default: any }) => (
				<Tooltip title="Activate">
					<Button icon={<PoweroffOutlined />} onClick={() => activateMechanism(record.mechanism_id)}>
					</Button>
				</Tooltip>
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
				<Tooltip title="View">
					<Button icon={<BarsOutlined />} onClick={() => {
						history.push(`/product/${productId}/mechanism/${record.mechanism_id}`)
					}}>
					</Button>
				</Tooltip>

			)
		},
		{
			title: 'Status',
			dataIndex: 'deactivate',
			width: '20%',
			render: (text: any, record: { mechanism_id: any; default: any }) => (
				record.default === false ?
					<Tooltip title="Deactivate">
						<Button icon={<StopOutlined />} onClick={() => deActivateMechanism(record.mechanism_id)}>
						</Button>
					</Tooltip> : <></>
			)
		}
	];

	function getMechanisms() {
		setLoading(true);
		ApiService.get(ApiUrls.mechanisms(productId))
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
			}, error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Mechanisms');
			})
	}

	useEffect(() => {
		getMechanisms();
	}, [])

	const handleOk = (object: object) => {
		setButtonLoading(true);
		ApiService.post(ApiUrls.addMechanism(productId), object)
			.then(data => {
				if (!data.errorSummary) {
					console.log(data);
					openNotification('success', 'Successfully created Mechanism');
					setIsModalVisible(false)
					setButtonLoading(false);
					getMechanisms();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
					setButtonLoading(false);
				}
			}, error => {
				console.error('Add mechanism error: ', error);
				setButtonLoading(false);
				openNotification('error', 'An Error has occured with creating Mechanism');
			})
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	function activateMechanism(uid: string) {
		ApiService.get(ApiUrls.activateMechanism(uid, productId))
			.then(data => {
				if (!data.errorSummary) {
					openNotification('success', 'Successfully activated Mechanism');
					getMechanisms();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with activating Mechanism');
			})
	}

	function deActivateMechanism(uid: string) {
		ApiService.get(ApiUrls.deActivateMechanism(uid, productId))
			.then(data => {
				if (!data.errorSummary) {
					openNotification('success', 'Successfully de-activated Mechanism');
					getMechanisms();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with de-activating Mechanism');
			})
	}

	function reOrderMechanisms(uid: string, order: number) {
		var data = {
			mechanism_id: uid,
			order: order
		}
		ApiService.post(ApiUrls.reOrderMechanisms(productId), data)
			.then(data => {
				if (!data.errorSummary) {
					console.log(data)
					getMechanisms();
				}
				else {
					openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
				}
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with re-ordering Mechanism');
			})

	}

	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
	const SortableItem = SortableElement(props => <tr {...props} />);
	const SortableBody = SortableContainer(props => <tbody {...props} />);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex && newIndex !== activeMechanisms.length - 1) {
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
			</div>

			<Skeleton loading={loading}>
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
					columns={activeColumns}
					dataSource={activeMechanisms}
					rowKey={"index"}
					components={{
						body: {
							wrapper: DraggableContainer,
							row: DraggableBodyRow,
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
					columns={inactiveColumns}
					dataSource={inactiveMechanisms}
					pagination={false}
				/>
				<Modal visible={isModalVisible} closeIcon={<Button icon={<CloseOutlined />}></Button>} footer={false} onCancel={handleCancel} width='800px'
					title={<div style={{ fontSize: '30px' }}>Add New Mechanism</div>} centered maskClosable={false}
				>
					<Mechanism handleOk={handleOk} buttonLoading={buttonLoading} handleCancel={handleCancel} />
				</Modal>

			</Skeleton>
		</>
	);
}
