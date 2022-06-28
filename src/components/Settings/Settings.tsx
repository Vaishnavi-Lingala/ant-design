import { useEffect, useState } from 'react';
import { Button, Divider, Input, Skeleton, Tooltip } from 'antd';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

import './Settings.css'

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { Account, accountBillingContact, accountTechnicalContact, settingsFieldNames, settingsIdpFields, settingsTokenNames } from '../../constants';

function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        getSettings();
    }, []);

    function getSettings() {
        setLoading(true)
        ApiService.get(ApiUrls.info)
            .then((data) => {
                console.log(data);
                setSettings(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Account Info');
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
                    <div style={{ width: "50%", display: "flex", marginBottom: "10px" }}>
                        <b>
                            Billing Contact
                        </b>
                    </div>

                    {
                        Object.keys(accountBillingContact).map(key =>
                            <DisplayField
                                displayName={accountBillingContact[key]}
                                value={settings[key]}
                                key={key}
                            />
                        )
                    }


                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    <div style={{ width: "50%", display: "flex", marginBottom: "10px" }}>
                        <b>
                            Technical Contact
                        </b>
                    </div>

                    {
                        Object.keys(accountTechnicalContact).map(key =>
                            <DisplayField
                                displayName={accountTechnicalContact[key]}
                                value={settings[key]}
                                key={key}
                            />
                        )
                    }

                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    {
                        Object.keys(settingsIdpFields).map(key =>
                            <DisplayField
                                displayName={settingsIdpFields[key]}
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
                                        openNotification('success', `${settingsTokenNames[key]} Copied`)
                                    }} />
                                </div>
                            </div>
                        })
                    }
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
