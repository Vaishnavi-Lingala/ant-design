import { useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography, Tabs } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import GroupDetails from "./GroupDetails";
import AddGroup from "./AddGroup";

export default function Groups() {

    const [groups, setGroups] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);
    const { TabPane } = Tabs;
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

    function onGroupTypeChange(key) {
        console.log('Group type: ', key);
    }

    return(
        <>
            <div className='content-header'>
				Groups
				{groupDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => setGroupDetails(undefined)}>Back</Button> : <></>}
			</div>
            <Tabs defaultActiveKey='USER'
				type="card" size={"middle"} animated={false}
				tabBarStyle={{ marginBottom: '0px' }}
				onChange={onGroupTypeChange}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>
                <TabPane tab="User" key="USER">
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
                </TabPane>
                <TabPane tab="Kiosk Machine" key="KIOSK"></TabPane>
            </Tabs>
            
        </>
    ) 
}
