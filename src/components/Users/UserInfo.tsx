import { useEffect, useState } from "react"
import { Button, Input, Modal, Select, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import { editableFields, userFieldNames } from "../../constants";
import { openNotification } from "../Layout/Notification";

export function UserInfo() {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [userDetails, setUserDetails]: any = useState({});
    const accountId = localStorage.getItem('accountId');
    const [isEdit, setIsEdit] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [editUserData, setEditUserData]: any = useState();
    const [domains, setDomains]: any = useState([]);

    useEffect(() => {
        const uid = window.location.pathname.split('/')[2];
        console.log(uid);
        Promise.all([
            ApiService.get(ApiUrls.domains(accountId)),
            ApiService.get(ApiUrls.userInfo(accountId, window.location.pathname.split('/')[2]))
        ])
            .then((data: any) => {
                console.log(data[0]);
                setDomains(data[0]);

                console.log(data[1]);
                setUserDetails(data[1]);
                setEditUserData(data[1]);
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
        setIsModal(true);
    }

    function updateUserInfo() {
        ApiService.put(ApiUrls.updateUserInfo(accountId, window.location.pathname.split('/')[2]), editUserData)
            .then(data => {
                if(!data.errorSummary){
                    setUserDetails(data);
                    openNotification('success', `Successfull updated ${data.first_name}'s Information.`);
                }
                else{
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with updating User Information.');
            }).finally(() => {
                setIsModal(false);
                setIsEdit(false);
            });
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
                                        eachKey === "login_domain" ?
                                            <Select defaultValue={userDetails[eachKey]}
                                                style={{ width: '275px' }}
                                                onChange={(value) => {
                                                    setEditUserData((prevState) => ({
                                                        ...prevState,
                                                        [eachKey]: value
                                                    }))
                                                }}
                                            >
                                                {
                                                    domains.map(eachDomain => {
                                                        return <Select.Option value={eachDomain} key={eachDomain}> {eachDomain} </Select.Option>
                                                    })
                                                }

                                            </Select> :
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

                <Modal visible={isModal} title={<b>Warning</b>} closeIcon={<Button icon={<CloseOutlined />} />} onOk={updateUserInfo}
                    onCancel={() => setIsModal(false)}
                >
                    <b>SAM</b> account name is created based on <b>Local User Provisioning policy</b>, Any change made here will over ride the default value.
                    If you still want to update the user details then click <b>Ok</b>. 
                </Modal>
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
