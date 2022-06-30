import { useEffect, useState } from "react";
import { Card, Skeleton, Statistic } from "antd";

import './Dashboard.css'

import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";

export default function Dashboard() {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [statsData, setStatsData] = useState({});
    const titles = {
        users: 'Users',
        groups: 'Groups',
        machines: 'Machines',
        enrollment: 'Enrollments'
    }

    useEffect(() => {
        ApiService.get(ApiUrls.account_info, { domain: localStorage.getItem('domain')})
            .then(data => {
                ApiService.get(ApiUrls.stats(data.uid))
                    .then(data => {
                        console.log('Stats data: ', data);
                        setStatsData(data);
                        setLoadingDetails(false);
                    }, error => {
                        console.error('Error: ', error);
                        openNotification('error', 'An error has occured with getting Dashboard details');
                        setLoadingDetails(false);
                    })
            });

    }, [])

    const dateAndTime = new Date().toLocaleString('en-US', {
        timeZone: 'CST',
    });

    return (
        <>
            <div className='content-header'>
                Dashboard
            </div>

            <Skeleton loading={loadingDetails}>
                {Object.keys(statsData).map(type => {
                    return <div key={type.slice(0, type.length - 1)}>
                        <Card key={type} style={{ border: '1px solid #d7d7dc', width: '550px' }}>
                            <Statistic key={titles[type]}
                                title={<div className="content-dashboard-key-header">{titles[type]}</div>} value={statsData[type].count}
                            />

                            <br />

                            <div className="overview-stat-container">
                                {Object.keys(statsData[type].stats).map(key => {
                                    return <div key={key}>
                                        <div>{key.slice(0, 1) + key.slice(1).toLowerCase()}&nbsp;&nbsp;&nbsp;</div>
                                        <div>{statsData[type].stats[key]}</div>
                                    </div>
                                })}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                Updated at {dateAndTime.slice(0, 15) + dateAndTime.slice(18)}
                            </div>
                        </Card>
                        <br />
                    </div>
                })}
            </Skeleton>
        </>
    );
} 
