import { Skeleton, Table, Button } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';
import { User } from "./User";

export default function Users() {
	
	const [userDetails, setUserDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
    const [arr, setArr]: any = useState([]);

    const columns = [{
        title: 'Username',
        dataIndex: 'user_name',
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
		setLoadingDetails(true);
        ApiService.get(ApiUrls.users)
		.then(data => {
			let usersList = data?.results;
			for(var i = 0; i < usersList.length; i++) {	
				var obj = {
					key: i+1,
					user_name: usersList[i].user_name,
					uid: usersList[i].uid,
					email: usersList[i].email,
					status: usersList[i].status
				}
				arr.push(obj);
			}
			setLoadingDetails(false);
		}).catch(error => {
			console.error(`Error in getting users list: ${error}`);
		})
	}, [])

	function getUserDetails(uid: string) {
		setLoadingDetails(true);
		const selectedUser = arr.find(user => user.uid === uid);
		if(selectedUser) setUserDetails(selectedUser);
		setLoadingDetails(false);
	}

    return (
		<>
			<div className='content-header'>
				{userDetails?<span>User</span>: <span>Users</span>}
				{userDetails? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {setUserDetails(undefined)}}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{userDetails? <User userDetails = {userDetails}></User>: <>
				 <Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}   
						pagination={{ position: [] }}
					/>
				</>}
			</Skeleton>
		</>
	);
}