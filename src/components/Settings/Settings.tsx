import { useEffect, useState } from 'react';
import { Skeleton } from 'antd';

import './Settings.css'

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { settingsFieldNames } from '../../constants';
import { ClientConfiguration } from '../../models/Data.models';

function Settings() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const domain = localStorage.getItem('domain');

    useEffect(() => {
        ApiService.post(ApiUrls.client_info, { domain: domain })
            .then((data: ClientConfiguration) => {
                setLoading(false);
                setSettings(data);
            })
            .catch((error) => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Settings');
            })
    }, []);

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
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
