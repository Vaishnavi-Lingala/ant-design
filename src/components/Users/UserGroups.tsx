import { Skeleton, Table } from "antd";
import { useEffect, useState } from "react";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";

export function UserGroups() {
    const [groups, setGroups]: any = useState([]);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const columns = [{ title: "Group Name", dataIndex: "name", width: "40%" },
    { title: "Status", dataIndex: "status", width: "40%" }
    ];

    useEffect(() => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.userGroups(window.location.pathname.split('/')[2])).then((groupsResponse: any) => {
            let userGroups = appendKeyToGivenList(groupsResponse);
            console.log(userGroups);
            setGroups(userGroups);
        }).catch(error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Groups');
        }).finally(() => {
            setLoadingDetails(false);
        });
    }, []);

    const appendKeyToGivenList = (inputList) => {
        inputList.forEach(each => {
            each['key'] = each.uid;
        })
        return inputList;
    }


    return <>
        <Skeleton loading={loadingDetails}>
            <Table style={{ border: '1px solid #D7D7DC' }}
                showHeader={true}
                columns={columns}
                dataSource={groups}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }
                }}></Table>
        </Skeleton>
    </>
}
