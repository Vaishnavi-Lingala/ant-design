import { useEffect, useState } from 'react';
import { Button, Input, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { openNotification } from '../Layout/Notification';
import ApiUrls from '../../ApiUtils';
import ApiService from '../../Api.service';
import { Domain } from '../../constants';

function Domains() {
    const [loading, setLoading] = useState(false);
    const [domains, setDomains]: any = useState([]);
    const [displayDomains, setDisplayDomains]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const accountId = localStorage.getItem('accountId');
 
    useEffect(() => {
        getDomains();
    }, []);

    function getDomains() {
        setLoading(true)
        ApiService.get(ApiUrls.domains(accountId))
            .then((data) => {
                console.log(data);
                setDomains(data);
                setDisplayDomains(data);
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
        const list: any = [];
        domains.map(value => {
            if (value !== '') {
                list.push(value);
            }
        })

        console.log(list);

        const object = {
            "domains": list
        }

        ApiService.put(ApiUrls.domains(accountId), object)
            .then(data => {
                if (!data.errorSummary) {
                    setIsEdit(false);
                    getDomains();
                    openNotification('success', 'Successfully updated Domains');
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
    }

    return (
        <>
            <div className='content-header'>
                {Domain}
            </div>

            <Skeleton loading={loading}>
                {!isEdit ?
                    <Button style={{ marginTop:'-75px', float: 'right' }} onClick={handleEditClick}>
                        Edit
                    </Button> : <></>
                }
                <div className="content-container rounded-grey-border">
                    <div style={{ width: "100%", display: "flex", marginBottom: "10px" }}>
                        <div style={{ width: "50%" }}>
                            <b>Domain(s) that users can login to:</b>
                        </div>
                        <div>
                            {
                                !isEdit ? domains.map((value, index) => {
                                    return <div key={index}>
                                        {value}
                                    </div>
                                }) : domains.map((value, index) => {
                                    return <div key={index} style={{ padding: '5px' }}>
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
                                })
                            }

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
                </div>
                {
                    isEdit ? <div style={{ paddingTop: '10px' }}>
                        <Button style={{ float: 'right', marginLeft: '10px' }}
                            onClick={handleCancel}>Cancel</Button>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={handleSave}>Save</Button>
                    </div> : <></>
                }
            </Skeleton>
        </>
    )
}

export default Domains;
