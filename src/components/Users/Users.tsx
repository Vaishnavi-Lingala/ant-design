import { Skeleton, Table, Button } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';
import { AddUser } from "./AddUser";
import { User } from "./User";

export default function Users() {
	
	const [userDetails, setUserDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
    const [arr, setArr]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);

    const columns = [{
        title: 'Username',
        dataIndex: 'user_name',
        width: '30%'
    },
	{
        title: 'Status',
        dataIndex: 'status',
        width: '30%'
    },
	{
		title: 'Actions',
		dataIndex: 'actions',
		width: '40%',
		render: (text: any, record: { uid: any; }) => (
			<Button onClick={() => getUserDetails(record.uid)}>
			  View
			</Button>
		)
	}]

    useEffect(() => {
		getUsersList(page, pageSize);
	}, [])

	function getUserDetails(uid: string) {
		setLoadingDetails(true);
		const selectedUser = arr.find(user => user.uid === uid);
		if(selectedUser) setUserDetails(selectedUser);
		setLoadingDetails(false);
	}

	const getUsersList = async (page, pageSize) => {
		setLoadingDetails(true);
		let data = await ApiService.get(ApiUrls.users, {start: page, limit: pageSize}).catch(error => {
			console.error(`Error in getting users list by page: ${JSON.stringify(error)}`);
		}).finally(() => {
			setLoadingDetails(false);
		});
		const usersWithKey = appendKeyToUsersList(data.results);
		setArr(usersWithKey);
		setTotalItems(data.total_items);
	}

	const getUpdatedUsersList = ()=> {
		getUsersList(page, pageSize);
	}

	const appendKeyToUsersList = (usersList) => {
		usersList.forEach(eachUser => {
			eachUser['key'] = eachUser.uid;
		})
		return usersList;
	}

    return (
		<>
			<div className='content-header'>
				{userDetails?<span>User</span>: <span>Users</span>}
				{userDetails? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {setUserDetails(undefined)}}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{userDetails? <User userDetails = {userDetails}></User>: <>
				<AddUser onUserCreate = {getUpdatedUsersList}></AddUser>
				 <Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}
						pagination={{
							current: page, 
							pageSize: pageSize,
							total: totalItems,
							onChange:(page, pageSize) => {
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