import { Button, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { DatePicker, Table } from "antd";

import "./ActivityLogs.css";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import Search from "antd/lib/input/Search";
import Link from "antd/lib/typography/Link";
import FiltersModal from "./FiltersModal";

const ExpandedRowItem = ({ name, value }) => {
    return (
        <>
            <div>
                <b>{name}</b>
            </div>
            <div>{value}</div>
        </>
    );
};

const ExpandedRowContainer = ({ record }) => {
    return (
        <div className="expanded-row-container">
            {Object.keys(record).map((recordKey) => (
                <ExpandedRowItem
                    name={recordKey}
                    value={record[recordKey]}
                    key={recordKey}
                />
            ))}
        </div>
    );
};

export default function ActivityLogs() {
    const [logResponse, setLogResponse] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: "Time",
            dataIndex: "created_ts",
        },
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
    ];

    useEffect(() => {
        ApiService.post(ApiUrls.activityLog, {
            account_id: ["ooa46c499ccb"],
            sort_by: "display_name",
        })
            .then((data) => {
                setLogResponse(data);
            })
            .catch((error) => console.log({ error }));
        setLoading(false);
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
                    {/* <div style={{ display: "inline-block" }}>
                        <div>From</div>
                        <DatePicker picker="date" />
                        <DatePicker picker="time" />
                    </div>
                    <div style={{ display: "inline-block" }}>
                        <div>To</div>
                        <DatePicker picker="date" />
                        <DatePicker picker="time" />
                    </div>
                    <div>
                    </div> */}

                    <div style={{ paddingBottom: "20px" }}>
                        <label>Search</label>
                        <Search
                            placeholder="Search"
                            enterButton
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px 10px 20px'}}>
                        <FiltersModal />&nbsp;\&nbsp;<Link>Reset Filters</Link>
                    </div>
                </div>

                <div className="log-container">
                    <Table
                        columns={columns}
                        expandable={{
                            expandedRowRender: (record) => (
                                <ExpandedRowContainer record={record} />
                            ),
                            rowExpandable: (record) => record !== null,
                        }}
                        dataSource={logResponse.results}
                        title={() => (
                            <>
                                Events: <b> {logResponse.total_items} </b>{" "}
                            </>
                        )}
                        footer={() => (<><Button>Show more</Button></>)}
                        pagination={false}
                        rowKey="created_ts"
                    />
                </div>
            </Skeleton>
        </>
    );
}
