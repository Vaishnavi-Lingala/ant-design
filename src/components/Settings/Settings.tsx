import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';

import ApiService from "../../Api.service";
import { ClientConfiguration } from '../../models/Data.models';

function Settings() {
    const [clientId, setClientId] = useState("");
    const [issuer, setIssuer] = useState("");
    const [loading, setLoading] = useState(true);
    const domain = localStorage.getItem('domain');

    useEffect(() => {
        fetch('https://credenti-portal-api.credenti.xyz/client/info', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "domain": domain
                })
            })
			.then(response => response.json())
            .then((data: ClientConfiguration) => {
                setLoading(false);
                setClientId(data.portal_oidc_client_id);
                setIssuer(data.issuer_url);
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
