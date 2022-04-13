import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';

import Apis from "../Api.service";
import { ClientConfiguration } from '../models/Data.models';

function Settings() {
    const [clientId, setClientId] = useState("");
    const [issuer, setIssuer] = useState("");
    const [loading, setLoading] = useState(true);
    const domain = localStorage.getItem('domain');

    useEffect(() => {
        Apis.getClientConfig(domain ? domain : '')
            .then((data: ClientConfiguration) => {
                setLoading(false);
                setClientId(data.portal_oidc_client_id);
                setIssuer(data.base_url_oauth2);
            }).catch((error) => {
                console.log(error);
            })
    }, []);
    
    return (
        <>
            <div><h2>Settings</h2></div>
            <Skeleton loading={loading}>
                <div>
                    Client_id: {clientId}
                </div>
                <div>
                    Issuer: {issuer}
                </div>
            </Skeleton>
        </>
    )
}

export default Settings;
