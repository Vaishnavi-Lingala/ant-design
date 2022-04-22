import { useEffect, useState } from "react"
import { Button, Skeleton, Table } from 'antd';
import ApiService from "../../Api.service";
import GroupDetails from "./groupDetails";

export default function Groups() {

    const [groups, setGroups] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);

    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { uid: any; }) => (
				<Button onClick={()=> getGroup(record.uid)}>
				  View
				</Button>
			)
		}
	];

    var requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json', 
			//@ts-ignore
			'X-CREDENTI-ACCESS-TOKEN': JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
		}
	}

    function getGroup(uid: any) {
		setLoadingDetails(true);
        ApiService.getGroupDetails(uid, requestOptions)
            .then(data => {
                setGroupDetails(data);
                setLoadingDetails(false);
            })
	}

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.getGroups(requestOptions)
		.then(data => {
			console.log('Groups: ', data);
            data.forEach(group => {
                group.key = group.uid;
            })
            setGroups(data);
			setLoadingDetails(false);
		})
	}, [])

    return(
        <>
            <div className='content-header'>
				Groups
				{groupDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setGroupDetails(undefined)}>Back</Button> : <></>}
			</div>
            <Skeleton loading={loadingDetails}>
                {groupDetails ? <GroupDetails groupDetails={groupDetails}/> : <>
                    <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
						<Button type='primary' size='large'>Add New Group</Button>
					</div>
                    <Table
                        style={{ border: '1px solid #D7D7DC' }}
                        showHeader={true}
                        columns={columns}
                        dataSource={groups}   
                        // bordered={true}
                        pagination={{ position: [] }}
                    />
                </>
                }
            </Skeleton>
        </>
    ) 
}