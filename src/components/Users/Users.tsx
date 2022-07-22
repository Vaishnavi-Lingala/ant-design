import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Skeleton, Table, Tooltip, Modal, Typography } from "antd";
import { MoreOutlined, BarsOutlined, CloseOutlined } from "@ant-design/icons"

import { AddUser } from "./AddUser";
import { User } from "./User";
import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import { useHistory } from "react-router-dom";
import DisplayDateTimeFormat from "../Controls/DateTimeHelper";
import { deactivateConfirmMsg } from "../../constants";

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
	const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
	const [deactivateUserId, setDeactivateUserId]: any = useState(null);
	const [deactivateUsername, setDeactivateUsername]: any = useState(null);
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
		{
			title: 'Username',
			dataIndex: 'idp_user_name',
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
			title: 'Details',
			dataIndex: 'details',
			width: '10%',
			render: (text: any, record: { uid: any; idp_user_name: any, first_name: any, last_name: any, email: any, status: string }) => (

				<Tooltip title="View">
					<Button icon={<BarsOutlined />} onClick={() => {
						sessionStorage.setItem("email", record.email);
						sessionStorage.setItem("first_name", record?.first_name ? record.first_name.slice(0, 1).toUpperCase() + record.first_name.slice(1) : '');
						sessionStorage.setItem("last_name", record?.last_name ? record.last_name.slice(0, 1).toUpperCase() + record.last_name.slice(1) : '');
						sessionStorage.setItem("user_name", record.idp_user_name);
						localStorage.setItem("usersPageParams", JSON.stringify({ 'page': page, 'pageSize': pageSize }));
						history.push(`/user/${record.uid}/profile`)
					}}
					/>
				</Tooltip>
			)
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '10%',
			render: (text: any, record: { uid: any; idp_user_name: any, first_name: any, last_name: any, email: any, status: string }) => (
				<Dropdown overlay={
					<Menu key={"changeStatus"} title={"Change Status"} >
						{
							statusList.map(item => {
								return <Menu.Item key={item.key} disabled={disableStatus(item.key, record.status)} onClick={({ key }) => { changeStatusConfirmation(key, record.uid, record.idp_user_name) }}>
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
			getUpdatedUsersList();
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
			start: null,
			limit: null
		}
		const pageDetails: any = localStorage.getItem('usersPageParams');
		console.log(JSON.parse(pageDetails));
		if (pageDetails && JSON.parse(pageDetails)) {
			setPage(JSON.parse(pageDetails).page);
			setPageSize(JSON.parse(pageDetails).pageSize);
			params.start = JSON.parse(pageDetails).page;
			params.limit = JSON.parse(pageDetails).pageSize;
			localStorage.removeItem('usersPageParams');
		} else {
			params.start = page;
			params.limit = pageSize;
		}
		console.log(`pagination params: ${JSON.stringify(params)}`);
		getUsersList({}, params);
	}

	const updateUsersListWithStatusAndKey = (usersList) => {
		usersList.forEach(eachUser => {
			eachUser['key'] = eachUser.uid;
			eachUser.status = lifeCycleTypes[eachUser.status];
		})
		return usersList;
	}

	const changeStatusConfirmation = (status, userId: string, user_name: string) => {
		if (status.toLowerCase() === 'DEACTIVATED'.toLowerCase()) {
			setIsDeactivateModalVisible(true);
			setDeactivateUserId(userId);
			setDeactivateUsername(user_name);
		} else {
			changeUserStatus(status, userId, user_name);
		}
	} 

	const changeUserStatus = async (status, userId: string, user_name: string) => {
		setLoadingDetails(true);
		console.log(status);
		
			let statusObj = {
				status: status
			}
			let result = await ApiService.post(ApiUrls.changeUserStatus(accountId, userId), statusObj)
				.then(data => {
					console.log(data);
					if (data.errorSummary) {
						openNotification('error', data.errorSummary);
					} else {
						console.log(user_name);
						openNotification('success', `Status for ${user_name.split('@')[0]} has been updated successfully with ${status.toLowerCase()}.`);
					}
				})
				.catch(error => {
					console.error('Error: ', error);
					openNotification('error', 'An Error has occured with Updating User Status');
				}).finally(() => {
					setLoadingDetails(false);
					if (status.toLowerCase() === 'deactivated') {
						setDeactivateUserId(null);
						setDeactivateUsername(null);
						setIsDeactivateModalVisible(false);
					}
				});
			getUpdatedUsersList();
	}

	const disableStatus = (key, currentStatus) => {
		const currentStatusKey = Object.keys(lifeCycleTypes).find(eachItem => lifeCycleTypes[eachItem] === currentStatus);
		return (key === currentStatusKey) ? true : false;
	}

	const handleOnStatusCancel = () => {
		setIsDeactivateModalVisible(false);
		setDeactivateUserId(null);
		setDeactivateUsername(null);
	}

	const handleOnStatusOk = () => {
		console.log(deactivateUserId);
		console.log(deactivateUsername);
		changeUserStatus('DEACTIVATED', deactivateUserId, deactivateUsername);
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
			<Modal closeIcon={<Button icon={<CloseOutlined />}></Button>} title={<b>Warning</b>} visible={isDeactivateModalVisible} onOk={handleOnStatusOk} onCancel={handleOnStatusCancel} width='500px'
            footer={[
                <Button key="cancel" onClick={handleOnStatusCancel}>
                    No
                </Button>,
                <Button key="submit" type="primary" loading={loadingDetails} onClick={handleOnStatusOk}>
                    Yes
                </Button>
            ]}
        >
            <div>
               {deactivateConfirmMsg}
            </div>
        </Modal>
		</>
	);
}
