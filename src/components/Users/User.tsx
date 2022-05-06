import { Skeleton, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

import ApiService from "../../Api.service"
import ApiUrls from "../../ApiUtils"

export function User(props: any) {
    let userDetails = props.userDetails;
    const {TabPane} = Tabs;
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [groups, setGroups]: any = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
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
            console.error(`Error in getting groups: ${JSON.stringify(error)}`);
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
        <Skeleton loading={loadingDetails}>
            <Tabs defaultActiveKey="profile" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}>
                <TabPane tab="Profile" key="profile">
                    <div className="row" style={{paddingTop: "20px"}}>
                        <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}>Username</div>
                            <div>{userDetails.user_name}</div>
                        </div>
                        <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}>Email</div>
                            <div>{userDetails.email}</div>
                        </div>
                        <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}>Status</div>
                            <div>{userDetails.status}</div>
                        </div>    
                    </div>
                </TabPane>
                <TabPane tab="Groups" key="groups">
                    <div className="row" style={{paddingTop: "20px"}}>
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
                    </div>
                </TabPane>
            </Tabs>
        </Skeleton>
    )
}