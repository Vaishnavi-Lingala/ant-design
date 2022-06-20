import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button, Skeleton, Tabs, Tooltip } from 'antd';
import { BarsOutlined } from "@ant-design/icons"

import GroupDetails from "./GroupDetails";
import MachineGroupDetails from "./MachineGroupDetails";
import TableList from "./TableList";
import { openNotification } from "../Layout/Notification";
import ProtectedRoute from "../ProtectedRoute";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import { Group } from "../../models/Data.models";

export default function Groups() {
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const history = useHistory();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [kioskMachineGroups, setKioskMachineGroups] = useState<Group[]>([]);
    const [standardMachineGroups, setStandardMachineGroups] = useState<Group[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
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
                <Tooltip title="View">
                    <Button icon={<BarsOutlined />} onClick={() =>
                        history.push('/groups/' + window.location.pathname.split('/')[2] + '/' + record.uid)
                    }
                    />
                </Tooltip>
            )
        }
    ];

    var type: any = [];
    type.push(window.location.pathname.split('/').length === 2 ? "USER" : window.location.pathname.split('/')[2].toUpperCase()); 

    const params = {
        group_type: type, 
        start: page,
        limit: pageSize
    }

    useEffect(() => {
        if (window.location.pathname.split('/').length === 2) {
            history.push("/groups/user")
        }

        getGroups({}, params);
    }, [])

    function getGroupsByFilter(object = {}, param = {}){
        setTableLoading(true);
        ApiService.post(ApiUrls.groupFilter, object, param)
            .then(data => {
                setPage(data.page);
                setPageSize(data.items_per_page);
                setTotalItems(data.total_items);
                console.log('Groups: ', data);
                let userGroupsList: Group[] = [];
                let kioskGroupsList: Group[] = [];
                let standardGroupsList: Group[] = [];
                data['results'].forEach((group: Group) => {
                    group.key = group.uid;
                    if (group.type === 'USER') {
                        userGroupsList.push(group);
                    }
                    if (group.type === 'KIOSK') {
                        kioskGroupsList.push(group);
                    }
                    if (group.type === 'STANDARD') {
                        standardGroupsList.push(group);
                    }
                })
                setUserGroups(userGroupsList);
                setKioskMachineGroups(kioskGroupsList);
                setStandardMachineGroups(standardGroupsList);
                setTableLoading(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setTableLoading(false);
            })
    }

    function getGroups(object = {}, param = {}) {
        setLoadingDetails(true);
        ApiService.post(ApiUrls.groupFilter, object, param)
            .then(data => {
                setPage(data.page);
                setPageSize(data.items_per_page);
                setTotalItems(data.total_items);
                console.log('Groups: ', data);
                let userGroupsList: Group[] = [];
                let kioskGroupsList: Group[] = [];
                let standardGroupsList: Group[] = [];
                data['results'].forEach((group: Group) => {
                    group.key = group.uid;
                    if (group.type === 'USER') {
                        userGroupsList.push(group);
                    }
                    if (group.type === 'KIOSK') {
                        kioskGroupsList.push(group);
                    }
                    if (group.type === 'STANDARD') {
                        standardGroupsList.push(group);
                    }
                })
                setUserGroups(userGroupsList);
                setKioskMachineGroups(kioskGroupsList);
                setStandardMachineGroups(standardGroupsList);
                setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoadingDetails(false);
            })
    }

    function onGroupTypeChange(key) {
        var type: any = [];
        type.push(key.toUpperCase());
        const param = {
            group_type: type, 
            start: page,
            limit: pageSize
        }
        getGroups({}, param);
        history.push('/groups/' + key);
        console.log('Group type: ', key);
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
            >
                <TabPane tab="User" key="user">
                    <Skeleton loading={loadingDetails}>
                        {window.location.pathname.split('/').length === 4 ?
                            <ProtectedRoute path={`/groups/user/:id`} component={GroupDetails} /> :
                            <TableList tableLoading={tableLoading} getGroupsByFilter={getGroupsByFilter} getPage={page} getPageSize={pageSize} getTotalItems={totalItems} groupType={'USER'} getGroups={getGroups} columns={columns} standardMachineGroups={userGroups} />
                        }
                    </Skeleton>
                </TabPane>
                <TabPane tab="Kiosk Machine" key="kiosk">
                    <Skeleton loading={loadingDetails}>
                        {window.location.pathname.split('/').length === 4 ?
                            <ProtectedRoute path={`/groups/kiosk/:id`} component={MachineGroupDetails} /> :
                            <TableList tableLoading={tableLoading} getGroupsByFilter={getGroupsByFilter} getPage={page} getPageSize={pageSize} getTotalItems={totalItems} groupType={'KIOSK'} getGroups={getGroups} columns={columns} standardMachineGroups={kioskMachineGroups} />
                        }
                    </Skeleton>
                </TabPane>
                <TabPane tab="Standard Machine" key="standard">
                    <Skeleton loading={loadingDetails}>
                        {window.location.pathname.split('/').length === 4 ?
                            <ProtectedRoute path={`/groups/standard/:id`} component={MachineGroupDetails} /> :
                            <TableList tableLoading={tableLoading} getGroupsByFilter={getGroupsByFilter} getPage={page} getPageSize={pageSize} getTotalItems={totalItems} groupType={'STANDARD'} getGroups={getGroups} columns={columns} standardMachineGroups={standardMachineGroups} />
                        }
                    </Skeleton>
                </TabPane>
            </Tabs>
        </>
    )
}
