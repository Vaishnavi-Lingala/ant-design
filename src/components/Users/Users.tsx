import { Skeleton, Table, Button, Dropdown, Menu, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';
import { AddUser } from "./AddUser";
import { User } from "./User";

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export default function Users() {

	const [userDetails, setUserDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(true);
	const [arr, setArr]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);
	const [statusList, setStatusList]: any = useState([]);
	const [lifeCycleTypes, setLifeCycleTypes]: any = useState(undefined);
	const [toastList, setToastList] = useContext(StoreContext);

	const columns = [{
		title: 'Username',
		dataIndex: 'user_name',
		width: '30%'
	},
	{
		title: 'Status',
		dataIndex: 'status',
		width: '20%'
	},
	{
		title: 'Details',
		dataIndex: 'details',
		width: '20%',
		render: (text: any, record: { uid: any; }) => (
			<Button onClick={() => getUserDetails(record.uid)}>
				View
			</Button>
		)
	},
	{
		title: 'Actions',
		dataIndex: 'actions',
		width: '35%',
		render: (text: any, record: { uid: any; user_name: any}) => (
			<Dropdown overlay={<Menu
				onClick={({ key }) => {
					changeUserStatus(key, record.uid, record.user_name)
				}}>
				{
					statusList.map(item => {
						return <Menu.Item key={item.key}>
							{item.value}
						</Menu.Item>
					})
				}

			</Menu>
			}>
				{<Button onClick={e => e.preventDefault()}>
					<Space>
						Change Status
					</Space>
				</Button>}
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

				const response = showToast('error', 'An Error has occured with getting Life Cycle Types');
				console.log('response: ', response);
				setToastList([...toastList, response]);
			});
			setLifeCycleTypes(userStatusTypes);
		}
	}

	const getUsersList = async (page, pageSize) => {
		setLoadingDetails(true);
		let data = await ApiService.get(ApiUrls.users, { start: page, limit: pageSize }).catch(error => {
			console.error('Error: ', error);
			const response = showToast('error', 'An Error has occured with getting User Lists by Page');
			console.log('response: ', response);
			setToastList([...toastList, response]);
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
				const response = showToast('success', `Status for ${user_name.split('@')[0]} has been updated successfully with ${status.toLowerCase()}.`);
				console.log('response: ', response);
				setToastList([...toastList, response]);
			})
			.catch(error => {
				console.error('Error: ', error);
				const response = showToast('error', 'An Error has occured with Updating User Status');
				console.log('response: ', response);
				setToastList([...toastList, response]);
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
