import { Card, Skeleton, Statistic } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

import './Dashboard.css'

export default function Dashboard() {

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [statsData, setStatsData] = useState({});
    const [toastList, setToastList] = useContext(StoreContext);
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
                setLoadingDetails(false);

                // const response = showToast('success', 'Successfully got Dashboard Data');
                // console.log('response: ', response);
                // setToastList([...toastList, response]);
            }, error => {
                console.error('Error: ', error);
                setLoadingDetails(false);

                const response = showToast('error', 'An Error has occured with getting Dashboard Data');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            })
    }, [])

    const dateAndTime = new Date().toLocaleString('en-US', {
        timeZone: 'CST',
    });

    return (
        <>
            <div>
                <h2>Dashboard</h2>
                <br />
            </div>

            <Skeleton loading={loadingDetails}>
                {Object.keys(statsData).map(type => {
                    return <div key={statsData[type].count}>
                        <Card key={type} style={{ border: '1px solid #d7d7dc', width: '550px' }}>
                            <Statistic key={titles[type]}
                                title={<h5>{titles[type]}</h5>} value={statsData[type].count}
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
