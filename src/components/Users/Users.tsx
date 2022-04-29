import { Skeleton, Table, Button } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

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
			<Button>
			  View
			</Button>
		)
	}]

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.get(ApiUrls.users)
		.then(data => {
			console.log(`users data: ${JSON.stringify(data)}`)
			let usersList = data?.results;
			for(var i = 0; i < usersList.length; i++) {	
				var obj = {
					key: i+1,
					user_name: usersList[i].user_name,
					uid: usersList[i].uid
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
        ApiService.get(ApiUrls.user(uid))
            .then(data => {
                setUserDetails(data);
                setLoadingDetails(false);
            }).catch(error => {
				console.error(`Error in getting user data: ${error}`);
			})
	}


    return (
		<>
			<div className='content-header'>
				Users
				{userDetails? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {setUserDetails(undefined)}}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				 <Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={arr}   
                        // bordered={true}
						pagination={{ position: [] }}
					/>
			</Skeleton>
		</>
	);
}