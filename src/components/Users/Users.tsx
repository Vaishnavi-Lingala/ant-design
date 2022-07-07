import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Skeleton, Table, Tooltip, Row, Col } from "antd";
import { MoreOutlined, BarsOutlined } from "@ant-design/icons"

import { AddUser } from "./AddUser";
import { User } from "./User";
import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import { useHistory } from "react-router-dom";
import DisplayDateTimeFormat from "../Controls/DateTimeHelper";

export default function Users() {
	const [userDetails, setUserDetails]: any = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(true);
	const [tableLoading, setTableLoading] = useState(false);
	const [arr, setArr]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);
	const [statusList, setStatusList]: any = useState([]);
	const [lifeCycleTypes, setLifeCycleTypes]: any = useState(undefined);
	const history = useHistory();
	const [object, setObject] = useState({});
	const accountId = localStorage.getItem('accountId');

	const columns = [
		{
			title: 'First Name',
			dataIndex: 'first_name',
			width: '10%'
		},
		{
			title: 'Last Name',
			dataIndex: 'last_name',
			width: '10%'
		},
		// {
		// 	title: 'Email',
		// 	dataIndex: 'email',
		// 	width: '15%'
		// },
		{
			title: 'Username',
			dataIndex: 'user_name',
			width: '10%'
		},
		{
			title: 'Enrolled',
			dataIndex: 'is_user_enrolled',
			width: '10%'
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: '10%'
		},
		{
			title: 'Last Login Time',
			width: '20%',
			render: (text, record) => <>{record.last_login_ts !== null ? DisplayDateTimeFormat(record.last_login_ts) : null}</>
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '25%',
			render: (text: any, record: { uid: any; user_name: any, first_name: any, last_name: any, email: any, status: string }) => (
				<Row>
					<Col span={12}>
						<Tooltip title="View">
							<Button icon={<BarsOutlined />} onClick={() => {
								sessionStorage.setItem("email", record.email);
								sessionStorage.setItem("first_name", record.first_name);
								sessionStorage.setItem("last_name", record.last_name);
								sessionStorage.setItem("user_name", record.user_name);
								history.push(`/user/${record.uid}/profile`)
							}}
							/>

						</Tooltip>
					</Col>
					<Col span={12}>
						<Dropdown overlay={
							<Menu key={"changeStatus"} title={"Change Status"} >
								{
									statusList.map(item => {
										return <Menu.Item key={item.key} disabled={disableStatus(item.key, record.status)} onClick={({ key }) => { changeUserStatus(key, record.uid, record.user_name) }}>
											{item.value}
										</Menu.Item>
									})
								}
							</Menu>
						}>
							{
								<Tooltip title="Change status">
									<Button icon={<MoreOutlined />} onClick={e => e.preventDefault()} />

								</Tooltip>
							}
						</Dropdown>
					</Col>

				</Row>


			)
		}
	];

	useEffect(() => {
		const statusTypes = [
			{
				key: 'ACTIVE',
				value: 'Activate'
			},
			{
				key: 'DEACTIVATED',
				value: 'Deactivate'
			},
			{
				key: 'STAGED',
				value: 'Stage'
			},
			{
				key: 'SUSPENDED',
				value: 'Suspend'
			},
			{
				key: 'LOCKED_OUT',
				value: 'Lock'
			}
		];
		setStatusList(statusTypes);
		getLifeCycleOptions();
	}, [])

	useEffect(() => {
		if (lifeCycleTypes) {
			getUsersList({}, { start: page, limit: pageSize });
		}
	}, [lifeCycleTypes])

	const getLifeCycleOptions = async () => {
		if (lifeCycleTypes === undefined) {
			let userStatusTypes = await ApiService.get(ApiUrls.lifeCycleOptions(accountId)).catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Life Cycle Types');
			});
			setLifeCycleTypes(userStatusTypes);
		}
	}

	const getUsersByFilter = async (objectData = {}, params = {}) => {
		setTableLoading(true);
		setObject(objectData);
		console.log(objectData)
		let data = await ApiService.post(ApiUrls.userFilter(accountId), objectData, params).catch(error => {
			console.error('Error: ', error);
			openNotification('error', 'An Error has occured with getting User Lists by Page');
		}).finally(() => {
			setTableLoading(false);
		});
		data.results.map((value) => {
			value['is_user_enrolled'] === true ? value['is_user_enrolled'] = 'True' : value['is_user_enrolled'] = 'False'
		})
		const updatedUsers = updateUsersListWithStatusAndKey(data.results);

		console.log(updatedUsers);
		setArr(updatedUsers);
		setTotalItems(data.total_items);
	}

	window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });

	const getUsersList = async (object: {}, params = {}) => {
		setLoadingDetails(true);
		let data = await ApiService.post(ApiUrls.userFilter(accountId), object, params).catch(error => {
			console.error('Error: ', error);
			openNotification('error', 'An Error has occured with getting User Lists by Page');
		}).finally(() => {
			setLoadingDetails(false);
		});
		data.results.map((value) => {
			value['is_user_enrolled'] === true ? value['is_user_enrolled'] = 'True' : value['is_user_enrolled'] = 'False'
		})
		const updatedUsers = updateUsersListWithStatusAndKey(data.results);
		console.log(updatedUsers);
		setArr(updatedUsers);
		setTotalItems(data.total_items);
	}

	const getUpdatedUsersList = () => {
		const params = {
			start: page,
			limit: pageSize
		}

		getUsersList({}, params);
	}

	const updateUsersListWithStatusAndKey = (usersList) => {
		usersList.forEach(eachUser => {
			eachUser['key'] = eachUser.uid;
			eachUser.status = lifeCycleTypes[eachUser.status];
		})
		return usersList;
	}

	const changeUserStatus = async (status, userId: string, user_name: string) => {
		setLoadingDetails(true);
		let statusObj = {
			status: status
		}
		let result = await ApiService.post(ApiUrls.changeUserStatus(accountId, userId), statusObj)
			.then(data => {
				openNotification('success', `Status for ${user_name.split('@')[0]} has been updated successfully with ${status.toLowerCase()}.`);
			})
			.catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with Updating User Status');
			}).finally(() => {
				setLoadingDetails(false);
			});
		console.log(`Status for ${user_name} is updated successfully with ${status}.`);
		getUpdatedUsersList();
	}

	const disableStatus = (key, currentStatus) => {
        const currentStatusKey = Object.keys(lifeCycleTypes).find(eachItem => lifeCycleTypes[eachItem] === currentStatus );
        return (key === currentStatusKey)? true: false;
    }

	return (
		<>
			<div className='content-header'>
				{window.location.pathname.split('/').length === 2 ? <span>Users</span> : <></>}
				{window.location.pathname.split('/').length !== 2 ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => { setUserDetails(undefined) }}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{window.location.pathname.split('/').length !== 2 ? <User></User> : <>
					<AddUser getUsersByFilter={getUsersByFilter} onUserCreate={getUpdatedUsersList}></AddUser>
					<Table
						loading={tableLoading}
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}
						scroll={{ x: true }}
						pagination={{
							current: page,
							pageSize: pageSize,
							total: totalItems,
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
								getUsersByFilter(object, { start: page, limit: pageSize });
							}
						}}
					/>
				</>}
			</Skeleton>
		</>

	);
}
