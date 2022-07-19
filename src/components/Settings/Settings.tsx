import { useEffect, useState } from 'react';
import { Button, Divider, Input, Radio, Select, Skeleton, Tooltip } from 'antd';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

import './Settings.css'

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { Account, accountBillingContact, accountTechnicalContact, settingsFieldNames, settingsIdpFields, settingsLDAPFields, settingsTokenNames, usernameFormatOptions } from '../../constants';

function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        getSettings();
    }, []);

    function getSettings() {
        setLoading(true)
        ApiService.get(ApiUrls.info(localStorage.getItem('accountId')))
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

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });

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
                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                        <div style={{ width: "50%" }}>
                            <b>
                                LDAP Host:
                            </b>
                        </div>
                        <div>
                            <Input defaultValue={"IP or DNS Name"} style={{ width: "275px" }} />
                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>

                        <div style={{ width: "50%" }}>
                            <b>
                                LDAP Port:
                            </b>
                        </div>
                        <div>
                            <Radio.Group defaultValue={636}
                            // onChange={}
                            >
                                <Radio key={636} value={636}>
                                    636
                                </Radio>
                                <br />
                                <Radio key={389} value={389}>
                                    389
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                        <div style={{ width: "50%" }}>
                            <b>
                                Base DN:
                            </b>
                        </div>
                        <div>
                            <Input defaultValue={"dc=lab,dc=tld"} style={{ width: "275px" }} />
                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                        <div style={{ width: "50%" }}>
                            <b>
                                User Base DN:
                            </b>
                        </div>
                        <div>
                            <Input defaultValue={"ou=user,dc=lab,dc=tld"} style={{ width: "275px" }} />
                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                        <div style={{ width: "50%" }}>
                            <b>
                                Username Format:
                            </b>
                        </div>
                        <div>
                            <Select
                                size={"large"}
                                placeholder="Please select username format"
                                defaultValue={"SAMACCOUNTNAME"}
                                style={{ width: '275px' }}
                            >
                                {
                                    Object.keys(usernameFormatOptions).map(nameFormat => {
                                        return <Select.Option key={nameFormat} value={nameFormat}>
                                            {usernameFormatOptions[nameFormat]}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

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
