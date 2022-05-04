import { useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import GroupDetails from "./GroupDetails";
import AddGroup from "./AddGroup";

export default function Groups() {

    const [groups, setGroups] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken


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

    function getGroup(uid: any) {
		setLoadingDetails(true);
        ApiService.get(ApiUrls.group(uid))
            .then(data => {
                console.log('GROUP_DETAILS: ', data);
                setGroupDetails(data);
                setLoadingDetails(false);
            })
	}

    useEffect(() => {
		getGroups();
	}, [])

    function getGroups() {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groups)
		.then(data => {
			console.log('Groups: ', data);
            data.forEach((group: { key: any; uid: any; }) => {
                group.key = group.uid;
            })
            setGroups(data);
			setLoadingDetails(false);
		})
    }

    return(
        <>
            <div className='content-header'>
				Groups
				{groupDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setGroupDetails(undefined)}>Back</Button> : <></>}
			</div>
            <Skeleton loading={loadingDetails}>
                {groupDetails ? <GroupDetails groupDetails={groupDetails}/> : <>
                    <AddGroup onGroupCreate={getGroups}/>
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