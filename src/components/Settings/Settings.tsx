import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import './Settings.css'

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { settingsFieldNames } from '../../constants';
import { ClientConfiguration } from '../../models/Data.models';

function Settings() {
    const domain = localStorage.getItem('domain');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const [domains, setDomains]: any = useState([]);
    const [displayDomains, setDisplayDomains]: any = useState([]);
    const [render, setRender] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const object = {
        "domains": domains
    }

    useEffect(() => {
        getSettings();
    }, []);

    function getSettings() {
        setLoading(true)
        ApiService.post(ApiUrls.client_info, { domain: domain })
            .then((data: ClientConfiguration) => {
                setSettings(data);
                setDomains(data['domains']);
                setDisplayDomains(data['domains']);
                console.log(data['domains']);
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
        ApiService.put(ApiUrls.updateDomains, object)
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
                        <b>{displayName}</b>
                    </div>
                    <div>{value}</div>
                </div>

            </>
        );
    };

    return (
        <>
            <div className='content-header'>
                Settings
            </div>
            <Skeleton loading={loading}>
                <div className="content-container rounded-grey-border">
                    {
                        Object.keys(settingsFieldNames).map(key => <DisplayField
                            displayName={settingsFieldNames[key]}
                            value={settings[key]}
                            key={key}
                        />)
                    }

                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />
                    {!isEdit ?
                        <Button style={{ float: 'right' }} onClick={handleEditClick}>
                            Edit
                        </Button> : <></>
                    }
                    <div style={{ width: "100%", display: "flex", marginBottom: "10px", paddingTop: '20px' }}>
                        <div style={{ width: "50%" }}>
                            <b>Domain(s)</b>
                        </div>
                        <div>
                            {
                                !isEdit ? domains.map(value => {
                                    return <div key={value}>
                                        {value}
                                    </div>
                                }) : domains.map((value, index) => {
                                    return <div key={value} style={{ padding: '5px' }}>
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
                                })}
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
