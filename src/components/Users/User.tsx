import { useEffect, useState } from "react";
import { Skeleton, Table, Tabs } from "antd";

import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service"

export function User(props: any) {
    let userDetails = props.userDetails;
    const [groups, setGroups]: any = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const {TabPane} = Tabs;
    
    const columns = [{title: "Group Name", dataIndex: "name", width:"40%" }, 
        {title: "Status", dataIndex: "status", width:"40%" }
    ];

    const userObj = {
        last_invite_accepted: "Last Invite Accepted",
        sourced_by: "Sourced By",
        uid: "User Id",
        login_user_name: "Login Username",
        is_shipping_contact: "Is Shipping Contact",
        last_name: "Last Name",
        idp_user_id: "IDP User Id",
        display_name: "Display Name",
        account_id: "Account Id",
        first_name: "First Name",
        user_name: "Username",
        eula_accepted_date: "Eula Accepted Date",
        is_technical_contact: "Is Technical Contact",
        is_billing_contact: "Is Billing Contact",
        last_portal_login: "Last Portal Login",
        status: "Status",
        upn: "UPN",
        email:"Email",
        last_invite_sent: "Last Invite Sent",
        login_domain: "Login Domain",
        is_portal_admin: "Is Portal Admin",
        sam: "SAM",
        key: "Key"
    }

    useEffect(()=> {
        setLoadingDetails(true);
        let userId = props.userDetails.uid;
        ApiService.get(ApiUrls.userGroups(userId)).then((groupsResponse:any) => {
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

    return (
            <Tabs defaultActiveKey="profile" type="card" size={"middle"} animated={false} tabBarStyle={{ marginBottom: '0px' }}>
                <TabPane tab="Profile" key="profile">
                    <Skeleton loading={loadingDetails}>
                        <div className="content-container-policy">
                        {
                        Object.keys(userDetails).map((eachKey) => {
                            return <div style={{width: "100%", display: "flex", marginBottom: "10px"}}>
                            <div style={{width: "50%"}}><b>{userObj[eachKey]}</b></div>
                                <div>{(typeof userDetails[eachKey] === "boolean") ? ((userDetails[eachKey] === true) ? "Yes" : "No") : userDetails[eachKey]}</div>
                            </div>
                        })
                       } 
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
