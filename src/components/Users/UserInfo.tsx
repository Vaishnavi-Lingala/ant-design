import { Button, Input, Skeleton } from "antd";
import { useEffect, useState } from "react"
import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { openNotification } from "../Layout/Notification";
import { editableFields, userFieldNames } from "../../constants";

export function UserInfo() {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [userDetails, setUserDetails]: any = useState({});
    const accountId = localStorage.getItem('accountId');
    const [isEdit, setIsEdit] = useState(false);
    const [editUserData, setEditUserData]: any = useState();

    useEffect(() => {
        const uid = window.location.pathname.split('/')[2];
        console.log(uid);
        ApiService.get(ApiUrls.userInfo(accountId, window.location.pathname.split('/')[2])).then((userInfo: any) => {
            console.log(userInfo);
            setUserDetails(userInfo);
            setEditUserData(userInfo);
            setLoadingDetails(false);
        }).catch(error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting userInfo');
        }).finally(() => {
            setLoadingDetails(false);
        });
    }, [])

    function handleEditClick() {
        setIsEdit(!isEdit);
        setEditUserData({ ...userDetails });
    }

    function handleCancelClick() {
        setEditUserData({ ...userDetails });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateUserInfo();
    }

    function updateUserInfo() {
        ApiService.put(ApiUrls.updateUserInfo(accountId, window.location.pathname.split('/')[2]), editUserData)
            .then(data => {
                setUserDetails(data);
                openNotification('success', `Successfull updated ${data.first_name}'s information.`);
                setIsEdit(false);
            })
    }

    return <>
        <Skeleton loading={loadingDetails}>
            <div className="content-container-policy">
                <div style={{ paddingBottom: '50px' }}>
                    {
                        userDetails['sourced_by'] === "SELF" ?
                            < Button style={{ float: 'right' }} onClick={handleEditClick}>
                                {!isEdit ? 'Edit' : 'Cancel'}
                            </Button> : <></>
                    }
                </div>
                <div>
                    {
                        Object.keys(userFieldNames).map((eachKey) => {
                            return <div key={eachKey} style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}><b>{userFieldNames[eachKey]}</b></div>
                                {isEdit ?
                                    !editableFields.includes(eachKey) ?
                                        <div>{userDetails[eachKey]}</div> :
                                        <Input defaultValue={userDetails[eachKey]}
                                            onChange={(e) => {
                                                setEditUserData((prevState) => ({
                                                    ...prevState,
                                                    [eachKey]: e.target.value
                                                }))
                                            }}
                                            style={{ width: '275px' }}
                                        />
                                    : <div>{userDetails[eachKey]}</div>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            {
                isEdit ? <div style={{ paddingTop: '10px', paddingRight: '45px' }}>
                    <Button style={{ float: 'right', marginLeft: '10px' }}
                        onClick={handleCancelClick}>Cancel</Button>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={handleSaveClick}>Save</Button>
                </div> : <></>
            }
        </Skeleton>
    </>
}
