import { useEffect, useState } from "react";
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

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });

    return (
        <>
            <div className='content-header'>
                {sessionStorage.getItem("first_name") === "null" ? "" : sessionStorage.getItem("first_name")} {sessionStorage.getItem("last_name") === "null" ? "" : sessionStorage.getItem("last_name")} <br />
                <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                    sessionStorage.clear();
                    history.push('/users');
                }}>Back</Button>
            </div>
            <div style={{ fontSize: 'medium', paddingLeft: '5px' }}>
                <b>Email:</b> {sessionStorage.getItem("email")} <br />
                <b>Username:</b> {sessionStorage.getItem("user_name")}
            </div>

            <br />
            
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
