import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Skeleton, Button, Divider, Table } from "antd";
import moment from "moment";

import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service"
import { date_display_format, machineFieldNames, time_format } from "../../constants";
import { MachineProducts } from "../../models/Data.models";

export function MachineDetails(props: any) {
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [machineDetails, setMachineDetails] = useState({});
    const [products, setProducts]: any = useState([]);
    const history = useHistory();

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product_sku',
            width: '30%'
        },
        {
            title: 'Version',
            dataIndex: 'product_version',
            width: '30%'
        },
        {
            title: "Installed Time",
            render: (text, record) => <>
               {moment.utc(record.created_ts).local().format(`${date_display_format} ${time_format}`)}
            </>
        }
    ]

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

    function calculateExpiryDays(expirydate) {
        const inputFormat = `DD-MM-YYYY ${time_format}` ;
        return moment(expirydate, inputFormat).diff(moment(moment().format(inputFormat), inputFormat), 'days');
    }

    useEffect(() => {
        setLoadingDetails(true);
        let machineId = window.location.pathname.split('/')[2];
        ApiService.get(ApiUrls.machineDetails(localStorage.getItem('accountId'), machineId)).then((data: any) => {
            console.log('Machine details:', data);
            let machineProducts: MachineProducts[] = [];
            Object.keys(data.products).map((product) => {
                let activeVersion = data.products[product].find(record => record.active === true)
                if (activeVersion) {
                    activeVersion.key = activeVersion.product_version
                    machineProducts.push(activeVersion)
                }
                // activeVersion ? machineProducts.push(activeVersion) : console.log('No active version for product ', product);
            })
            setProducts(machineProducts)
            setMachineDetails(data);
        }).catch(error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting machine details');
        }).finally(() => {
            setLoadingDetails(false);
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
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
                    <div style={{ fontWeight: '600', fontSize: '30px'}}>{machineDetails['machine_name']}</div>
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
                            <>
                                {Object.keys(machineFieldNames.cert_details)?.map(key =>
                                    <DisplayField
                                        displayName={machineFieldNames.cert_details[key]}
                                        value={machineDetails['cert_details'][key]}
                                        key={machineDetails['cert_details'][key]}
                                    />)}
                                <DisplayField
                                    displayName={'Expiry days'}
                                    value={calculateExpiryDays(machineDetails['cert_details']['valid_to'])}
                                    key="expiry-days"
                                />
                            </> : <></>
                    }

                    <Divider style={{ borderTop: '1px solid #d7d7dc' }} />

                    <div className="content-policy-key-header">Installed Products</div>
                    
                    <div style={{ marginTop: "10px" }}>
                        <Table
                            style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            dataSource={products}
                            pagination={{ position: [] }}
                        />
                    </div>
                   

                </div>
            </Skeleton>
        </>
    )
}
