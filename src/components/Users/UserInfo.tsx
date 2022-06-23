import { Button, Skeleton } from "antd";
import { useEffect, useState } from "react"
import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import { userFieldNames } from "../../constants";

export function UserInfo() {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [userDetails, setUserDetails]: any = useState({});

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
                <div>
                    {
                        Object.keys(userFieldNames).map((eachKey) => {
                            return <div key={eachKey} style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}><b>{userFieldNames[eachKey]}</b></div>
                                <div>{userDetails[eachKey]}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </Skeleton>
    </>
}
