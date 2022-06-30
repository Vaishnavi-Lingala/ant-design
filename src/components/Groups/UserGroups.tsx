import { useContext, useEffect, useState } from "react"
import { Group } from "../../models/Data.models";
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography, Tabs } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import AddGroup from "./AddGroup";

import { openNotification } from "../Layout/Notification";

export default function UserGroups() {
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
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
                <Button onClick={() => console.log(record.uid)}>
                    View
                </Button>
            )
        }
    ];

    function getGroups() {
        // setLoadingDetails(true);
        ApiService.get(ApiUrls.groups(localStorage.getItem('accountId')), { type: 'USER' })
            .then(data => {
                console.log('Groups: ', data);
                // let userGroupsList: Group[] = [];
                // let kioskGroupsList: Group[] = [];
                data.forEach((group: Group) => {
                    group.key = group.uid;
                    // if (group.type === 'USER') {
                    //     userGroupsList.push(group);
                    // }
                    // if (group.type === 'KIOSK') {
                    //     kioskGroupsList.push(group);
                    // }
                })
                setUserGroups(data);
                // setKioskMachineGroups(kioskGroupsList);
                // setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Groups');
                setLoadingDetails(false);
            })
    }

    useEffect(() => {
        getGroups();
    }, [])

    return (
        <>
            <Skeleton loading={loadingDetails}>
                <AddGroup onGroupCreate={getGroups} type='USER' />
                <Table
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={userGroups}
                    // bordered={true}
                    pagination={{ position: [] }}
                />
            </Skeleton>

        </>
    )
}