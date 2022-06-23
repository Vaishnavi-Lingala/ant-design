import { useEffect, useState } from "react";
import { Button, Skeleton, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { Enrollments } from "./Enrollments";
import { UserGroups } from "./UserGroups";
import { UserInfo } from "./UserInfo";
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';

export function User() {
    const urlParams = window.location.pathname.split('/');
    const { TabPane } = Tabs;
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(true);

    useEffect(() => {
        const uid = window.location.pathname.split('/')[2];
        console.log(uid);
        ApiService.get(ApiUrls.userInfo(window.location.pathname.split('/')[2])).then((userInfo: any) => {
            console.log(userInfo);
            setUserDetails(userInfo);
            setLoadingDetails(false);
        }).catch(error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting userInfo');
        }).finally(() => {
            setLoadingDetails(false);
        });

        if (window.location.pathname.split('/').length === 3) {
            history.push(`users/${window.location.pathname.split('/')[2]}/profile`)
        }
    }, []);

    return (
        <Skeleton loading={loadingDetails}>
            <div className='content-header'>
                {userDetails['first_name']} {userDetails['last_name']} <br />
                <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => { history.push('/users') }}>Back</Button>
            </div>
            <div style={{fontSize: 'medium', fontWeight: 600, paddingLeft: '5px'}}>
                Email: {userDetails['email']} <br />
                Username: {userDetails['user_name']}
            </div>
            <Tabs activeKey={window.location.pathname.split("/")[3]}
                type="card"
                size={"middle"}
                animated={false}
                onChange={(key) => {
                    history.push("/user/" + urlParams[2] + "/" + key);
                }}
                tabBarStyle={{ marginBottom: '0px' }}>
                <TabPane tab="Profile" key="profile">
                    <UserInfo></UserInfo>
                </TabPane>
                <TabPane tab="Groups" key="groups">
                    <UserGroups></UserGroups>
                </TabPane>
                <TabPane tab="Enrollments" key="enrollments">

                    <Enrollments></Enrollments>
                </TabPane>
            </Tabs>
        </Skeleton >
    )
}
