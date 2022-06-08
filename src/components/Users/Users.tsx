import { Skeleton, Table, Button, Dropdown, Menu, Space, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';
import { AddUser } from "./AddUser";
import { User } from "./User";
import { MoreOutlined, BarsOutlined } from "@ant-design/icons"

import { openNotification } from "../Layout/Notification";
import SubMenu from "antd/lib/menu/SubMenu";

export default function Users() {

	const [userDetails, setUserDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(true);
	const [arr, setArr]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);
	const [statusList, setStatusList]: any = useState([]);
	const [lifeCycleTypes, setLifeCycleTypes]: any = useState(undefined);

	const columns = [{
		title: 'First Name',
		dataIndex: 'first_name'
		},{
		title: 'Last Name',
		dataIndex: 'last_name'
	},{
		title: 'Email',
		dataIndex: 'email'
	},{
		title: 'Username',
		dataIndex: 'user_name'
	},{
		title: 'Status',
		dataIndex: 'status'
	},{
		title: 'Details',
		dataIndex: 'details',
		render: (text: any, record: { uid: any; user_name: any}) => (
			<Tooltip title="View">
				<Button icon={<BarsOutlined />} onClick={() => getUserDetails(record.uid)}/>
					
			</Tooltip>
		)
	},{
		title: 'Actions',
		dataIndex: 'actions',
		render: (text: any, record: { uid: any; user_name: any}) => (
			<Dropdown overlay={
				<Menu key={"changeStatus"} title={"Change Status"} >
						{
						statusList.map(item => {
							return <Menu.Item key={item.key} onClick={({key}) => {changeUserStatus(key, record.uid, record.user_name)}}>
								{item.value}
							</Menu.Item>
						})
					}
				</Menu>
			}>
				{
					<Tooltip title="Change status">
						<Button icon={<MoreOutlined/>} onClick={e => e.preventDefault()} />

					</Tooltip>
				}
			</Dropdown>
		)
	}]

	useEffect(() => {
		const statusTypes = [{
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
		}]
		setStatusList(statusTypes);
		getLifeCycleOptions();
	}, [])

	useEffect(() => {
		if (lifeCycleTypes) {
			getUsersList(page, pageSize);
		}
	}, [lifeCycleTypes])

	function getUserDetails(uid: string) {
		setLoadingDetails(true);
		const selectedUser = arr.find(user => user.uid === uid);
		if (selectedUser) setUserDetails(selectedUser);
		setLoadingDetails(false);
	}

	const getLifeCycleOptions = async () => {
		if (lifeCycleTypes === undefined) {
			let userStatusTypes = await ApiService.get(ApiUrls.lifeCycleOptions).catch(error => {
				console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Life Cycle Types');
			});
			setLifeCycleTypes(userStatusTypes);
		}
	}

	const getUsersList = async (page, pageSize) => {
		setLoadingDetails(true);
		let data = await ApiService.get(ApiUrls.users, { start: page, limit: pageSize }).catch(error => {
			console.error('Error: ', error);
			openNotification('error', 'An Error has occured with getting User Lists by Page');
		}).finally(() => {
			setLoadingDetails(false);
		});
		const updatedUsers = updateUsersListWithStatusAndKey(data.results);
		console.log(updatedUsers);
		setArr(updatedUsers);
		setTotalItems(data.total_items);
	}

	const getUpdatedUsersList = () => {
		getUsersList(page, pageSize);
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
		let result = await ApiService.post(ApiUrls.changeUserStatus(userId), statusObj)
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

	return (
		<>
			<div className='content-header'>
				{userDetails ? <span>User</span> : <span>Users</span>}
				{userDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => { setUserDetails(undefined) }}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{userDetails ? <User userDetails={userDetails}></User> : <>
					<AddUser onUserCreate={getUpdatedUsersList}></AddUser>
					<Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}
						scroll={{x: true}}
						pagination={{
							current: page,
							pageSize: pageSize,
							total: totalItems,
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
								getUsersList(page, pageSize);
							}
						}}
					/>
				</>}
			</Skeleton>
		</>

	);
}
