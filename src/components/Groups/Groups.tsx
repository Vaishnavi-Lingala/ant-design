import { useContext, useEffect, useState } from "react"
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography, Tabs } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import GroupDetails from "./GroupDetails";
import AddGroup from "./AddGroup";
import { Group } from "../../models/Data.models";
import KioskGroupDetails from "./KioskGroupDetails";
import { useHistory } from "react-router-dom";

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export default function Groups() {

    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const history = useHistory();
    const [kioskMachineGroups, setKioskMachineGroups] = useState<Group[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState(undefined);
    const [kioskGroupDetails, setKioskGroupDetails] = useState(undefined);
    const [toastList, setToastList] = useContext(StoreContext);
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
                <Button onClick={() => getGroup(record.uid)}>
                    View
                </Button>
            )
        }
    ];

    function getGroup(uid: any) {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.group(uid))
            .then(data => {
                if (!data.errorSummary) {
                    console.log('GROUP_DETAILS: ', data);
                    if (data.type === 'USER') {
                        history.push('/groups/users/' + uid);
                        setGroupDetails(data);
                        setLoadingDetails(false);
                    }
                    if (data.type === 'KIOSK') {
                        history.push('/groups/kiosk/' + uid);
                        setKioskGroupDetails(data);
                        setLoadingDetails(false);
                    }
                }
                else {
                    const response = showToast('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    console.log('response: ', response);
                    setToastList([...toastList, response]);
                }
            }, error => {
                console.error('Error: ', error);
                setLoadingDetails(false);
                const response = showToast('error', 'An Error has occured with getting Group');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }

    useEffect(() => {
        if (window.location.pathname.split("/").length === 4) {
            getGroup(window.location.pathname.split('/')[3]);
        }

        if (window.location.pathname.split('/').length === 2) {
            history.push("/groups/users")
        }
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
            }, error => {
                console.error('Error: ', error);
                setLoadingDetails(false);
                const response = showToast('error', 'An Error has occured with getting Groups');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }

    function onGroupTypeChange(key) {
        history.push('/groups/' + key);
        console.log('Group type: ', key);
    }

    function clearUserGroupDetails() {
        setGroupDetails(undefined)
    }

    function clearMachineGroupDetails() {
        setKioskGroupDetails(undefined)
    }

    return (
        <>
            <div className='content-header'>
                Groups
            </div>

            <Tabs
                type="card" size={"middle"} animated={false}
                tabBarStyle={{ marginBottom: '0px' }}
                defaultActiveKey={window.location.pathname.split("/")[2]}
                onChange={onGroupTypeChange}
            // style={{border: '1px solid #d7d7dc', margin: 0}} 
            >

                <TabPane tab="User" key="user">
                    <Skeleton loading={loadingDetails}>
                        {groupDetails ? <GroupDetails groupDetails={groupDetails} clearGroupDetails={clearUserGroupDetails} /> : <>
                            <AddGroup onGroupCreate={getGroups} type='USER' />
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
                <TabPane tab="Kiosk Machine" key="kiosk">
                    <Skeleton loading={loadingDetails}>
                        {kioskGroupDetails ? <KioskGroupDetails groupDetails={kioskGroupDetails} clearGroupDetails={clearMachineGroupDetails} /> : <>
                            <AddGroup onGroupCreate={getGroups} type='KIOSK' />
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
