import { Skeleton, Table, Tabs } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from "../../ApiUtils"

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

export function User(props: any) {
    let userDetails = props.userDetails;
    const {TabPane} = Tabs;
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [groups, setGroups]: any = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [toastList, setToastList] = useContext(StoreContext);
    const [pageSize, setPageSize]: any = useState(10);
    const columns = [{title: "Group Name", dataIndex: "name", width:"40%" },
    {title: "Status", dataIndex: "status", width:"40%" }];

    useEffect(()=> {
        setLoadingDetails(true);
        let userId = props.userDetails.uid;
        ApiService.get(ApiUrls.userGroups(userId)).then((groupsResponse:any) => {
            let userGroups = appendKeyToGivenList(groupsResponse);
            setGroups(userGroups);
        }).catch(error => {
            console.error('Error: ', error);

            const response = showToast('error', 'An Error has occured with getting Groups');
            console.log('response: ', response);
            setToastList([...toastList, response]);
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

    return (
            <Tabs defaultActiveKey="profile" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}>
                <TabPane tab="Profile" key="profile">
                    <Skeleton loading={loadingDetails}>
                        <div className="content-container-policy">
                            <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}><b>Username</b></div>
                                <div>{userDetails.user_name}</div>
                            </div>
                            <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}><b>Email</b></div>
                                <div>{userDetails.email}</div>
                            </div>
                            <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}><b>Status</b></div>
                                <div>{userDetails.status}</div>
                            </div>    
                        </div>
                    </Skeleton>
                </TabPane>
                <TabPane tab="Groups" key="groups">
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
                </TabPane>
            </Tabs>
        
    )
}