import { Skeleton, Table, Tabs } from "antd";
import { useEffect, useState } from "react";

import ApiService from "../../Api.service"
import ApiUrls from "../../ApiUtils"

export function User(props: any) {
    let userDetails = props.userDetails;
    const {TabPane} = Tabs;
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;
    const [groups, setGroups]: any = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const columns = [{title: "Group Name", dataIndex: "name", width:"40%" },
    {title: "Status", dataIndex: "status", width:"40%" }];

    useEffect(()=> {
        setLoadingDetails(true);
        let userId = props.userDetails.uid;
        ApiService.get(ApiUrls.userGroups(userId)).then((groupsResponse:any) => {
            let userGroups = groupsResponse;
            for(var i = 0; i < userGroups.length; i++) {	
				let obj = {
					key: i+1,
					name: userGroups[i].name,
					uid: userGroups[i].uid,
					status: userGroups[i].status
				}
				groups.push(obj);
			}
        });
        setLoadingDetails(false);
    }, []);

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
						pagination={{ position: [] }}></Table>
                    </div>
                </TabPane>
            </Tabs>
        </Skeleton>
    )
}