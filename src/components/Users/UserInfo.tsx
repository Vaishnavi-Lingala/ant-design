import { Button, Skeleton } from "antd";
import { useEffect, useState } from "react"
import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import { useHistory} from "react-router-dom";

export function UserInfo() {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [userDetails, setUserDetails]: any = useState(undefined);
    const history = useHistory();
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
        email: "Email",
        last_invite_sent: "Last Invite Sent",
        login_domain: "Login Domain",
        is_portal_admin: "Is Portal Admin",
        sam: "SAM",
        key: "Key"
    }

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
    }, [])

    return <>
        <Skeleton loading={loadingDetails}>
            <div className="content-container-policy">
            {/* <div>
                <div className='content-header'>
                    <span>User</span>
                    <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => { history.push('/users') }}>Back</Button>
                </div>
            </div> */}
                {
                    Object.keys(userDetails ? userDetails : {}).map((eachKey) => {
                        return <div key={eachKey} style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                            <div style={{ width: "50%" }}><b>{userObj[eachKey]}</b></div>
                            <div>{(typeof userDetails[eachKey] === "boolean") ? ((userDetails[eachKey] === true) ? "Yes" : "No") : userDetails[eachKey]}</div>
                        </div>
                    })
                }
            </div>
        </Skeleton>
    </>
}
