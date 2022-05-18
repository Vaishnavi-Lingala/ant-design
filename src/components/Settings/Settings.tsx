import { Skeleton } from 'antd';
import { useContext, useEffect, useState } from 'react';

import './Settings.css'

import { ClientConfiguration } from '../../models/Data.models';

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

function Settings() {
    const [clientId, setClientId] = useState("");
    const [issuer, setIssuer] = useState("");
    const [accountId, setAccountId] = useState("");
    const [loading, setLoading] = useState(true);
    const [toastList, setToastList] = useContext(StoreContext);
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
                setAccountId(data.uid);
                setIssuer(data.issuer_url);
            }).catch((error) => {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with getting Settings');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }, []);

    return (
        <>
            <div><h2>Settings</h2></div>
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
