import { Button, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";

import "./ActivityLogs.css";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import Search from "antd/lib/input/Search";
import FiltersModal from "./FiltersModal";

const { RangePicker } = DatePicker;

// constants
const date_format = "YYYY-MM-DD";
const time_format = "HH:mm:ss";
const start_date = "start_date";
const start_time = "start_time";
const end_date = "end_date";
const end_time = "end_time";

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
    const [datetimeFilters, setDateTimeFilters] = useState({
        start: { date: moment().startOf("day").subtract(1, "M").format(date_format), time: moment().startOf("day").format(time_format) },
        end: { date: moment().endOf("day").format(date_format), time: moment().format(time_format) },
    });

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
            start_time: `${datetimeFilters.start.date} ${datetimeFilters.start.time}`,
            end_time: `${datetimeFilters.end.date} ${datetimeFilters.end.time}`
        })
            .then((data) => {
                setLogResponse(data);
            })
            .catch((error) => console.log({ error }));
        setLoading(false);
    }, [datetimeFilters]);

    // useEffect(() => {
    //     console.log({ datetimeFilters });
    // }, [datetimeFilters]);

    async function showMoreClick() {
        if (logResponse.next) {
            var url = new URL(`https://${logResponse.next}`);
            var response = await ApiService.post(
                `${url.pathname}${url.search}`,
                {
                    start_time: `${datetimeFilters.start.date} ${datetimeFilters.start.time}`,
                    end_time: `${datetimeFilters.end.date} ${datetimeFilters.end.time}`
                }
            );

            console.log({ response });
            setLogResponse((logRes) => {
                response.results = logRes.results.concat(response.results);
                return { ...response };
            });
        }
    }

    function onDateFilterChange(date, dateString, type) {
        switch (type) {
            case start_date:
                setDateTimeFilters((state) => {
                    state.start.date = dateString;
                    return { ...state };
                });
                break;
            case start_time:
                setDateTimeFilters((state) => {
                    state.start.time = dateString;
                    return { ...state };
                });
                break;
            case end_date:
                setDateTimeFilters((state) => {
                    state.end.date = dateString;
                    return { ...state };
                });
                break;
            case end_time:
                setDateTimeFilters((state) => {
                    state.end.time = dateString;
                    return { ...state };
                });
                break;
            default:
                setDateTimeFilters(datetimeFilters);
        }
    }

    return (
        <>
            <div>
                <h2>Activity Logs</h2>
            </div>
            <Skeleton loading={loading}>
                <div className="filter-container">
                    <div style={{ display: "inline-block" }}>
                        <div>From</div>
                        <DatePicker
                            format={date_format}
                            defaultValue={moment(datetimeFilters.start.date)}
                            picker="date"
                            disabledDate={(current) =>
                                current > moment().endOf("day")
                            }
                            onChange={(date, dateString) =>
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    start_date
                                )
                            }
                        />
                        <DatePicker
                            format={time_format}
                            defaultValue={moment(datetimeFilters.start.time, time_format)}
                            picker="time"
                            onChange={(date, dateString) =>
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    start_time
                                )
                            }
                        />
                    </div>
                    <div style={{ display: "inline-block" }}>
                        <div>To</div>
                        <DatePicker
                            format={date_format}
                            defaultValue={moment(datetimeFilters.end.date)}
                            picker="date"
                            disabledDate={(current) =>
                                current > moment().endOf("day")
                            }
                            onChange={(date, dateString) =>
                                onDateFilterChange(date, dateString, end_date)
                            }
                        />
                        <DatePicker
                            format={time_format}
                            defaultValue={moment(datetimeFilters.end.time, time_format)}
                            picker="time"
                            onChange={(date, dateString) =>
                                onDateFilterChange(date, dateString, end_time)
                            }
                        />
                    </div>

                    <div style={{ paddingBottom: "0" }}>
                        <label>Search</label>
                        <Search placeholder="Search" enterButton />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "10px 20px 10px 20px",
                        }}
                    >
                        <FiltersModal />
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
                        footer={() =>
                            logResponse.next ? (
                                <Button onClick={showMoreClick}>
                                    Show more
                                </Button>
                            ) : (
                                false
                            )
                        }
                        pagination={false}
                        rowKey="uid"
                    />
                </div>
            </Skeleton>
        </>
    );
}
