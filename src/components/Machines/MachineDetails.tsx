import { Skeleton, Button, Divider } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from "../../ApiUtils"
import { machineFieldNames } from "../../constants";
import { useHistory } from 'react-router-dom';

import { openNotification } from "../Layout/Notification";

export function MachineDetails(props: any) {

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [machineDetails, setMachineDetails] = useState({});
    const history = useHistory();

    const DisplayField = ({ displayName, value }) => {
        return (
            <>
                <div style={{ width: "100%", display: "flex", marginTop: "10px" }}>
                    <div style={{ width: "30%" }}>
                        <b>{typeof displayName !== 'object' ? displayName : null}</b>
                    </div>
                    <div>{typeof value !== 'object' ? value : null}</div>
                </div>

            </>
        );
    };

    useEffect(() => {
        setLoadingDetails(true);
        let machineId = window.location.pathname.split('/')[2];
        ApiService.get(ApiUrls.machineDetails(machineId)).then((data: any) => {
            console.log('Machine details:', data);
            setMachineDetails(data);
        }).catch(error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting machine details');
        }).finally(() => {
            setLoadingDetails(false);
        });
    }, []);


    return (
        <>
            <div className='content-header'>
                <span>Machines</span>
                <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                    history.push('/machines')
                }}>Back</Button>
            </div>
            <Skeleton loading={loadingDetails}>
                <div className="content-container rounded-grey-border">
                    {
                        Object.keys(machineDetails).map((machineField) => (
                            machineField !== 'products' && machineDetails[machineField] !== 'object' ?
                                <DisplayField
                                    displayName={machineFieldNames[machineField]}
                                    value={machineDetails[machineField]}
                                    key={machineField}
                                /> : <></>
                        ))
                    }

                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    <div className="content-policy-key-header">Certificate Details</div>

                    {
                        typeof machineDetails['cert_details'] === 'object' ?
                            Object.keys(machineFieldNames.cert_details)?.map(key =>
                                <DisplayField
                                    displayName={machineFieldNames.cert_details[key]}
                                    value={machineDetails['cert_details'][key]}
                                    key={machineDetails['cert_details'][key]}
                                />) : <></>
                    }

                </div>
            </Skeleton>
        </>
    )
}