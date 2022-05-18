import { Skeleton, Table, Button, Select } from "antd";
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
		title: 'Actions',
		dataIndex: 'actions',
		width: '20%',
		render: (text: any, record: { uid: any; }) => (
			<Button onClick={() => getUserDetails(record.uid)}>
				View
			</Button>
		)
	},
	{
		title: 'Change Status',
		dataIndex: 'change_status',
		width: '35%',
		render: (text: any, record: { uid: any; }) => (
			<Select onChange={(value) => {
				changeUserStatus(value, record.uid)
			}}
				placeholder="Select status"
				style={{ width: "100%" }}>
				{statusList.map((eachStatus) => {
					return <Select.Option key={eachStatus.key} value={eachStatus.key}>{eachStatus.value}</Select.Option>
				})}
			</Select>
		)
	}]

	useEffect(() => {
		console.log(`useEffect called:`);
		const statusTypes = [{
			key: 'ACTIVE',
			value: 'Activate'
		}, {
			key: 'INACTIVE',
			value: 'Inactivate'
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

	const changeUserStatus = async (status, userId: string) => {
		setLoadingDetails(true);
		let statusObj = {
			status: status
		}
		let result = await ApiService.post(ApiUrls.changeUserStatus(userId), statusObj).catch(error => {
			console.error('Error: ', error);

			const response = showToast('error', 'An Error has occured with Updating User Status');
			console.log('response: ', response);
			setToastList([...toastList, response]);
		}).finally(() => {
			setLoadingDetails(false);
		});
		console.log(`Status for ${userId} is updated successfully with ${status}.`);
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