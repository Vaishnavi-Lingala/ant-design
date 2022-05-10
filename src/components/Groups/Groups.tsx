import { useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography, Tabs } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import GroupDetails from "./GroupDetails";
import AddGroup from "./AddGroup";
import { Group } from "../../models/Data.models";
import KioskGroupDetails from "./KioskGroupDetails";

export default function Groups() {

    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [kioskMachineGroups, setKioskMachineGroups] = useState<Group[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);
    const [kioskGroupDetails, setKioskGroupDetails] = useState(undefined);
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
                if (data.type === 'USER') {
                    setGroupDetails(data);
                    setLoadingDetails(false);
                }
                if (data.type === 'KIOSK') {
                    setKioskGroupDetails(data);
                    setLoadingDetails(false);
                }
                
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
            let userGroupsList: Group[] = [];
            let kioskGroupsList: Group[] = [];
            data.forEach((group: Group) => {
                group.key = group.uid;
                if (group.type === 'USER') {
                    userGroupsList.push(group);
                }
                if (group.type === 'KIOSK') {
                    kioskGroupsList.push(group);
                }
            })
            setUserGroups(userGroupsList);
            setKioskMachineGroups(kioskGroupsList);
			setLoadingDetails(false);
		})
    }

    function onGroupTypeChange(key) {
        console.log('Group type: ', key);
    }

    function clearUserGroupDetails() {
        setGroupDetails(undefined)
    }

    function clearMachineGroupDetails() {
        setKioskGroupDetails(undefined)
    }

    return(
        <>
            <div className='content-header'>
				Groups
			</div>
            
            <Tabs defaultActiveKey='USER'
				type="card" size={"middle"} animated={false}
				tabBarStyle={{ marginBottom: '0px' }}
				onChange={onGroupTypeChange}
			// style={{border: '1px solid #d7d7dc', margin: 0}} 
			>

                <TabPane tab="User" key="USER">
                    <Skeleton loading={loadingDetails}>
                        {groupDetails ? <GroupDetails groupDetails={groupDetails} clearGroupDetails={clearUserGroupDetails}/> : <>
                            <AddGroup onGroupCreate={getGroups}/>
                            <Table
                                style={{ border: '1px solid #D7D7DC' }}
                                showHeader={true}
                                columns={columns}
                                dataSource={userGroups}   
                                // bordered={true}
                                pagination={{ position: [] }}
                            />
                        </>
                        }
                    </Skeleton>
                </TabPane>
                <TabPane tab="Kiosk Machine" key="KIOSK">
                    <Skeleton loading={loadingDetails}>
                    {kioskGroupDetails ? <KioskGroupDetails groupDetails={kioskGroupDetails} clearGroupDetails={clearMachineGroupDetails}/> : <>
                        <Table
                            style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            dataSource={kioskMachineGroups}   
                            // bordered={true}
                            pagination={{ position: [] }}
                        />
                    </>
                    }
                    </Skeleton>
                </TabPane>
            </Tabs>
            
        </>
    ) 
}
