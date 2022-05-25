import { useContext, useEffect, useState } from "react"
import { Group } from "../../models/Data.models";
import { Button, Skeleton, Table, Modal, Input, Row, Col, Typography, Tabs } from 'antd';
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import AddGroup from "./AddGroup";
import { useHistory } from 'react-router-dom';

import { openNotification } from "../Layout/Notification";

export default function KioskGroups() {
    const [kioskMachineGroups, setKioskMachineGroups] = useState<Group[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const history = useHistory();

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
                <Button onClick={() => history.push('/groups/kiosk/' + record.uid)}>
                    View
                </Button>
            )
        }
    ];

    function getGroups() {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.groups, { type: 'KIOSK' })
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
                setKioskMachineGroups(data);
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
                <AddGroup onGroupCreate={getGroups} type='KIOSK' />
                <Table
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={kioskMachineGroups}
                    // bordered={true}
                    pagination={{ position: [] }}
                />
            </Skeleton>

        </>
    )
}