import { useEffect } from "react";
import { Button, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { Enrollments } from "./Enrollments";
import { UserGroups } from "./UserGroups";
import { UserInfo } from "./UserInfo";

export function User() {
    const urlParams = window.location.pathname.split('/');
    const { TabPane } = Tabs;
    const history = useHistory();

    useEffect(() => {
        if (window.location.pathname.split('/').length === 3) {
            history.push(`users/${window.location.pathname.split('/')[2]}/profile`)
        }
    }, []);

    return (
        <>
            <div className='content-header'>
                User
                <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => { history.push('/users') }}>Back</Button>
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
        </>
    )
}
