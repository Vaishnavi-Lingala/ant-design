import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Skeleton, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

import './Settings.css'

import Hint from '../Controls/Hint';
import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { Account, settingsFieldNames, settingsTokenNames } from '../../constants';

function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const [domains, setDomains]: any = useState([]);
    const [displayDomains, setDisplayDomains]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    useEffect(() => {
        getSettings();
    }, []);

    function getSettings() {
        setLoading(true)
        Promise.all([
            ApiService.get(ApiUrls.info),
            ApiService.get(ApiUrls.domains)
        ])
            .then((data) => {
                console.log(data[0]);
                setSettings(data[0]);

                console.log(data[1]);
                setDomains(data[1]);
                setDisplayDomains(data[1]);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Settings');
            })
    }

    function handleEditClick() {
        setIsEdit(true);
    }

    function handleCancel() {
        console.log(displayDomains);
        setDomains(displayDomains);
        setIsEdit(false);
    }

    function handleSave() {
        const list: any = [];
        domains.map(value => {
            if (value !== '') {
                list.push(value);
            }
        })

        console.log(list);

        const object = {
            "domains": list
        }

        ApiService.put(ApiUrls.domains, object)
            .then(data => {
                if (!data.errorSummary) {
                    setIsEdit(false);
                    getSettings();
                    openNotification('success', 'Successfully updated Domains');
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
    }

    const DisplayField = ({ displayName, value }) => {
        return (
            <>

                <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                    <div style={{ width: "50%" }}>
                        <b>
                            {//@ts-ignore
                                !["Portal OIDC Client ID", "App OIDC Client ID"].includes(displayName) ?
                                    <>
                                        {displayName}:
                                    </> : <>
                                        {displayName}<Tooltip placement="right" title={displayName === "Portal OIDC Client ID" ? "Public identifier for the Admin portal login flow." : "Public identifier for App enrollment flows."}>
                                            <InfoCircleOutlined style={{ padding: '0 4px 0 4px' }} />
                                        </Tooltip>:
                                    </>
                            }
                        </b>
                    </div>
                    <div>{value}</div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className='content-header'>
                {Account}
            </div>

            <Skeleton loading={loading}>
                <div className="content-container rounded-grey-border">
                    {
                        Object.keys(settingsFieldNames).map(key =>
                            <DisplayField
                                displayName={settingsFieldNames[key]}
                                value={settings[key]}
                                key={key}
                            />
                        )
                    }

                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    {
                        Object.keys(settingsTokenNames).map(key => {
                            return <div key={key} style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}>
                                    <b>{settingsTokenNames[key]}:</b>
                                </div>
                                <div style={{ width: "30%", display: "flex", marginBottom: "10px" }}>
                                    <Input.Password readOnly
                                        value={settings[key]}
                                    />
                                    &nbsp;
                                    <Button icon={<CopyOutlined />} onClick={() => {
                                        navigator.clipboard.writeText(settings[key])
                                        openNotification('success', `${settingsTokenNames[key]} copied`)
                                    }} />
                                </div>
                            </div>
                        })
                    }


                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    {!isEdit ?
                        <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            Edit
                        </Button> : <></>
                    }
                    <div style={{ width: "100%", display: "flex", marginBottom: "10px", paddingTop: '20px' }}>
                        <div style={{ width: "50%" }}>
                            <b>Domain(s):</b>
                        </div>
                        <div>
                            {
                                !isEdit ? domains.map((value, index) => {
                                    return <div key={index}>
                                        {value}
                                    </div>
                                }) : domains.map((value, index) => {
                                    return <div key={index} style={{ padding: '5px' }}>
                                        <Input className="form-control"
                                            defaultValue={value} onChange={(e) => {
                                                domains[index] = e.target.value
                                                setDomains(domains);
                                            }} style={{ width: '200px' }}
                                        /> &nbsp;
                                        <Button onClick={() => {
                                            const list = [...domains];
                                            let index = domains.indexOf(value);
                                            list.splice(index, 1);
                                            console.log(list);
                                            setDomains(list);
                                        }}>
                                            <DeleteOutlined />
                                        </Button>
                                    </div>
                                })
                            }

                            {
                                isEdit ? <div style={{ padding: '5px' }}>
                                    <Button onClick={() => {
                                        setDomains([...domains, ''])
                                    }}>
                                        Add Domain
                                    </Button>
                                </div> : <></>
                            }
                        </div>
                    </div>
                    {
                        isEdit ? <div style={{ paddingTop: '10px' }}>
                            <Button style={{ float: 'right', marginLeft: '10px' }}
                                onClick={handleCancel}>Cancel</Button>
                            <Button type='primary' style={{ float: 'right' }}
                                onClick={handleSave}>Save</Button>
                        </div> : <></>
                    }
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
