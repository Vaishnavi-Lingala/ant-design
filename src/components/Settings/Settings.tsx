import { Skeleton } from 'antd';
import { useContext, useEffect, useState } from 'react';

import './Settings.css'

import { ClientConfiguration } from '../../models/Data.models';

import { openNotification } from '../Layout/Notification';
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';

function Settings() {
    const [result, setResult] = useState({});
    const [clientId, setClientId] = useState("");
    const [issuer, setIssuer] = useState("");
    const [accountId, setAccountId] = useState("");
    const [loading, setLoading] = useState(true);
    const domain = localStorage.getItem('domain');

    useEffect(() => {
        ApiService.post(ApiUrls.client_info, { domain: domain })
            .then((data: any) => {
                console.log(data)
                setResult(data);
                setLoading(false);
                setClientId(data.portal_oidc_client_id);
                setAccountId(data.uid);
                setIssuer(data.issuer_url);
                console.log(result);
            })
            .catch((error) => {
                console.error('Error: ', error);
				openNotification('error', 'An Error has occured with getting Settings');
            })
    }, []);

    return (
        <>
            <div className='content-header'>
                Settings
            </div>
            <Skeleton loading={loading}>
                <div className="content-container rounded-grey-border">
                    <div className="row-container">
                        <div>
                            Account_id:
                        </div>
                        <div>
                            {accountId}
                        </div>
                        <div>
                            Client_id:
                        </div>
                        <div>
                            {clientId}
                        </div>
                        <div>
                            Issuer:
                        </div>
                        <div>
                            {issuer}
                        </div>
                    </div>
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
