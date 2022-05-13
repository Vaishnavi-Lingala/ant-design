import { Card, Skeleton, Statistic } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';

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
                setLoadingDetails(false);
            }, error => {
                console.error('Stats error: ', error);
                setLoadingDetails(false);
            })
    }, [])

    return (
        <Skeleton loading={loadingDetails}>
            <Card title="Overview" style={{ width: 400, border: '1px solid #d7d7dc' }}>
                <div className="overview-stat-container">
                    {Object.keys(statsData).map(type => {
                        return <div key={type}>
                            <Statistic className="overview-item"
                                title={<a className="stat-header-link" href={type === "machines" ? "/groups/kiosk" : "/" + type}>{titles[type]}</a>} value={statsData[type].count}
                            />
                        </div>
                    })}
                </div>
                    <div style={{textAlign: 'right'}}>Updated at {Date().slice(4, 21)} IST</div>
            </Card>
        </Skeleton>
    );
} 
