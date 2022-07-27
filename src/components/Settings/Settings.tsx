import { useEffect, useState } from 'react';
import { Button, Divider, Input, Radio, Select, Skeleton, Tooltip } from 'antd';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

import './Settings.css'

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { account, Account, accountBillingContact, accountTechnicalContact, settingsFieldNames, settingsIdpFields, settingsLDAPFields, settingsTokenNames } from '../../constants';

function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const [ldapDisplayDetails, setLDAPDisplayDetails] = useState({});
    const [ldapEditDetails, setLDAPEditDetails]: any = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [usernameFormatOptions, setUsernameFormatOptions] = useState({});
    const accountId = localStorage.getItem('accountId');

    useEffect(() => {
        getSettings();
    }, []);

    function getSettings() {
        setLoading(true)
        Promise.all([
            ApiService.get(ApiUrls.ldapConfig(accountId)),
            ApiService.get(ApiUrls.loginOptions(accountId)),
            ApiService.get(ApiUrls.info(accountId)),
        ])
            .then((data) => {
                console.log(data[0]);
                setLDAPDisplayDetails(data[0]);
                setLDAPEditDetails(data[0]);

                console.log(data[1]);
                setUsernameFormatOptions(data[1]);

                console.log(data[2]);
                setSettings(data[2]);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Account Info');
            })

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function handleEditClick() {
        setLDAPEditDetails({ ...ldapDisplayDetails });
        setIsEdit(!isEdit);
    }

    function handleCancelClick() {
        setLDAPEditDetails({ ...ldapDisplayDetails });
        setIsEdit(false);
    }

    function handleSaveClick() {
        updateLDAPConfig();
    }

    function updateLDAPConfig() {
        ApiService.put(ApiUrls.ldapConfig(accountId), ldapEditDetails)
            .then(data => {
                if (!data.errorSummary) {
                    setLDAPDisplayDetails({ ...ldapEditDetails });
                    setIsEdit(false);
                    openNotification('success', 'Successfully updated LDAP Details');
                }
                else{
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

                    {process.env.REACT_APP_ENV === 'dev' && 
                        <div>
                            <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                            <div style={{ paddingRight: '30px', paddingBottom: '10px' }}>
                                {
                                    !isEdit ?
                                        <Button style={{ float: 'right' }} onClick={handleEditClick}>
                                            Edit
                                        </Button> :
                                        <></>
                                }
                            </div>

                            <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}>
                                    <b>
                                        LDAP Host:
                                    </b>
                                </div>
                                <div>
                                    {
                                        isEdit ?
                                            <Input value={ldapEditDetails?.host}
                                                onChange={(e) => {
                                                    setLDAPEditDetails({
                                                        ...ldapEditDetails,
                                                        host: e.target.value
                                                    })
                                                }}
                                                style={{ width: "275px" }}
                                            /> : ldapDisplayDetails['host']
                                    }
                                </div>
                            </div>

                            <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>

                                <div style={{ width: "50%" }}>
                                    <b>
                                        LDAP Port:
                                    </b>
                                </div>
                                <div>
                                    <Radio.Group value={ldapEditDetails?.port}
                                        disabled={!isEdit}
                                        onChange={(e) => {
                                            setLDAPEditDetails({
                                                ...ldapEditDetails,
                                                port: e.target.value
                                            })
                                        }}
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
                                    {
                                        isEdit ?
                                            <Input defaultValue={ldapEditDetails?.base_dn}
                                                style={{ width: "275px" }}
                                                onChange={(e) => {
                                                    setLDAPEditDetails({
                                                        ...ldapEditDetails,
                                                        base_dn: e.target.value
                                                    })
                                                }}
                                            /> : ldapDisplayDetails['base_dn']
                                    }
                                </div>
                            </div>

                            <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}>
                                    <b>
                                        User Base DN:
                                    </b>
                                </div>
                                <div>
                                    {
                                        isEdit ?
                                            <Input value={ldapEditDetails?.user_base_dn}
                                                onChange={(e) => {
                                                    setLDAPEditDetails({
                                                        ...ldapEditDetails,
                                                        user_base_dn: e.target.value
                                                    })
                                                }}
                                                style={{ width: "275px" }}
                                            /> : ldapDisplayDetails['user_base_dn']
                                    }
                                </div>
                            </div>

                            <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                                <div style={{ width: "50%" }}>
                                    <b>
                                        Username Format:
                                    </b>
                                </div>
                                <div>
                                    {
                                        isEdit ?
                                            <Select
                                                size={"large"}
                                                placeholder="Please select username format"
                                                value={usernameFormatOptions[ldapEditDetails?.user_name_format]}
                                                onChange={(value) => {
                                                    setLDAPEditDetails({
                                                        ...ldapEditDetails,
                                                        user_name_format: value
                                                    })
                                                }}
                                                style={{ width: '275px' }}
                                            >
                                                {
                                                    Object.keys(usernameFormatOptions).map(nameFormat => {
                                                        return <Select.Option key={nameFormat} value={nameFormat}>
                                                            {usernameFormatOptions[nameFormat]}
                                                        </Select.Option>
                                                    })
                                                }
                                            </Select> : usernameFormatOptions[ldapDisplayDetails['user_name_format']]
                                    }
                                </div>
                            </div>

                            {
                                isEdit ? <div style={{ paddingTop: '20px', paddingRight: '30px' }}>
                                    <Button style={{ float: 'right', marginLeft: '10px' }}
                                        onClick={handleCancelClick}>Cancel</Button>
                                    <Button type='primary' style={{ float: 'right' }}
                                        onClick={handleSaveClick}>Save</Button>
                                </div> : <></>
                            }
                        </div>
                    }
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
