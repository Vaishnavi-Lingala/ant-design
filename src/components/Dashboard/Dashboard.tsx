import { Card, notification, Skeleton, Statistic } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

import { openNotification } from "../Layout/Notification";

import './Dashboard.css'

export default function Dashboard() {

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [statsData, setStatsData] = useState({});
    const titles = {
        users: 'Users',
        groups: 'Groups',
        machines: 'Machines'
    }

    useEffect(() => {
        ApiService.get(ApiUrls.stats)
            .then(data => {
                console.log('Stats data: ', data);
                setStatsData(data);
                openNotification('success', 'Successfully Obtained Dashboard Data');
                setLoadingDetails(false);
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An error has occured with getting Dashboard Info');
                setLoadingDetails(false);
            })
    }, [])

    const dateAndTime = new Date().toLocaleString('en-US', {
        timeZone: 'CST',
    });

    return (
        <>
            <div className='content-header'>
                Dashboard
                <br />
            </div>

            <Skeleton loading={loadingDetails}>
                {Object.keys(statsData).map(type => {
                    return <div key={statsData[type].count}>
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
