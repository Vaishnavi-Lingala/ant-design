import { Card, Statistic } from "antd";

import './Dashboard.css'

export default function Dashboard() {
    return (
        <Card title="Overview" style={{ width: 400, border: '1px solid #d7d7dc' }}>
            <div className="overview-stat-container">
                {/* <div className="overview-item">
                    <div><a className="stat-header-link" href="">Users</a></div>
                    <div className="stat-item">215</div>
                </div> */}

                <Statistic loading={false} className="overview-item"
                    title={
                        <a className="stat-header-link" href="/users">
                            Users
                        </a>
                    } value='215'
                />

                <Statistic className="overview-item"
                    title={
                        <a className="stat-header-link" href="/groups">
                            Groups
                        </a>
                    }
                    value='25'
                />
                {/* <div>
                    <div><a className="stat-header-link" href="">Groups</a></div>
                    <div className="stat-item">38</div>
                </div> */}
            </div>
            <div className="overview-refresh-timestamp-item">
                Updated at 9 Feb, 09:38
            </div>
        </Card>
    );
} 
