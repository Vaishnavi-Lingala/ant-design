import { Skeleton } from "antd";
import {
    useEffect,
    useState,
} from "react";
import { DatePicker, Table } from "antd";

import "./ActivityLogs.css";

import ApiService from "../Api.service";
import ApiUrls from "../ApiUtils";
import Search from "antd/lib/input/Search";

export default function ActivityLogs() {
    const [logResponse, setLogResponse] = useState<any>({});
    const [loading, setLoading] = useState(true);
    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken;

    const columns = [
        {
            title: "Actor",
            dataIndex: "display_name",
        },
        {
            title: "Event Info",
            dataIndex: "event_display_message",
        },
        {
            title: "Event Status",
            dataIndex: "event_outcome",
        },
        {
            title: "Target Product",
            dataIndex: "product_name",
        },
    ];

    useEffect(() => {
        ApiService.post(ApiUrls.activityLog, { account_id: ['ooa46c499ccb'], sort_by: "display_name" })
        .then(data => {
            setLogResponse(data);
        })
        .catch(error =>
            console.log({ error })
        );
        setLoading(false);
        // console.log({ accessToken });
        // Apis.PostAPI(accessToken);
        // var user = { name: 'Rama' };
    //     axios.post(`https://jsonplaceholder.typicode.com/users`, { user }, { headers: { 'Content-Type': 'applicaiton/json'}})
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   })
    }, []);

    useEffect(() => {
        console.log({ logResponse });
    }, [logResponse]);

    return (
        <>
            <div>
                <h2>Activity Logs</h2>
            </div>
            <Skeleton loading={loading}>
                <div className="filter-container">
                    <div style={{ display: "inline-block" }}>
                        <div>From</div>
                        <DatePicker picker="date" />
                        <DatePicker picker="time" />
                    </div>
                    <div style={{ display: "inline-block" }}>
                        <div>To</div>
                        <DatePicker picker="date" />
                        <DatePicker picker="time" />
                    </div>

                    <div style={{ paddingBottom: "20px" }}>
                        <label>Search</label>
                        <Search
                            placeholder="input search with enterButton"
                            enterButton
                        />
                    </div>
                </div>

                <div className="log-container">
                    <Table
                        columns={columns}
                        expandable={{
                            expandedRowRender: record => <p>{record.event_display_message}</p>,
                            rowExpandable: record => record !== null,
                        }}
                        dataSource={logResponse.results}
                        title={() => <>Events: <b> {logResponse.total_items} </b> </>}
                        pagination={false}
                        // rowKey={()}
                    />
                </div>
            </Skeleton>
        </>
    );
}
