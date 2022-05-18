import { Card, Statistic } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';
import { showToast } from "../Layout/Toast/Toast";

import './Dashboard.css'

export default function Dashboard() {

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [statsData, setStatsData] = useState({});
    const titles = {
        users: 'Users',
        groups: 'Groups',
        machines:'Machines'

    }

    useEffect(() => {
		setLoadingDetails(true);
        ApiService.get(ApiUrls.stats)
		.then(data => {
            console.log('Stats data: ', data);
            setStatsData(data);
			setLoadingDetails(false);
            showToast('success');
		}, error => {
            console.error('Stats error: ', error);
            setLoadingDetails(false);
        })
	}, [])

    return (
        <Card title="Overview" style={{ width: 400, border: '1px solid #d7d7dc' }}>
            <div className="overview-stat-container">
                {Object.keys(statsData).map(type => {
                    return <div key={type}> 
                        <Statistic loading={loadingDetails} className="overview-item"
                            title={<a className="stat-header-link" href="">{titles[type]}</a>} value={statsData[type].count}
                        /> 
                    </div>
                })}
            </div>
            
        </Card>
    );
} 
