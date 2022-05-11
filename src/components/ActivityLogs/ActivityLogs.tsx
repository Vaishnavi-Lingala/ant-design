import { Button, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";

import "./ActivityLogs.css";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import FiltersModal from "./FiltersModal";

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
    const [tableLoading, setTableLoading] = useState(false);

    const initialDateTimeFilters = {
        start: {
            date: moment().startOf("day").subtract(1, "M").format(date_format),
            time: moment().startOf("day").format(time_format),
        },
        end: {
            date: moment().endOf("day").format(date_format),
            time: moment().format(time_format),
        },
    };

    const [datetimeFilters, setDateTimeFilters] = useState(
        initialDateTimeFilters
    );

    const [advancedFilters, setAdvancedFilters] = useState({});

    const applyAdvancedFilters = (filters) => {
        setAdvancedFilters(filters);
    };

    const resetFilters = () => {
        setDateTimeFilters(initialDateTimeFilters);
        setAdvancedFilters({});
    };

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
        (async function () {
            setTableLoading(true);
            try {
                const data = await ApiService.post(
                    ApiUrls.activityLog,
                    generateFilterPayload()
                );
                setLogResponse(data);
            } catch (error) {
                console.log({ error });
            }
            setLoading(false);
            setTableLoading(false);
        })();
    }, [datetimeFilters, advancedFilters]);

    async function showMoreClick() {
        if (logResponse.next) {
            var url = new URL(`https://${logResponse.next}`);
            setTableLoading(true);
            var response = await ApiService.post(
                `${url.pathname}${url.search}`,
                generateFilterPayload()
            );
            setTableLoading(false);

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
                setDateTimeFilters(initialDateTimeFilters);
        }
    }

    function generateFilterPayload() {
        const payload = Object.assign(
            {
                start_time: `${datetimeFilters.start.date} ${datetimeFilters.start.time}`,
                end_time: `${datetimeFilters.end.date} ${datetimeFilters.end.time}`,
            },
            advancedFilters
        );
        return payload;
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
                            value={moment(datetimeFilters.start.date)}
                            picker="date"
                            disabledDate={(current) =>
                                current > moment().endOf("day")
                            }
                            onChange={(date, dateString) => 
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    date && dateString ? start_date : null
                                )
                            }
                        />
                        <DatePicker
                            format={time_format}
                            value={moment(
                                datetimeFilters.start.time,
                                time_format
                            )}
                            picker="time"
                            onChange={(date, dateString) =>
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    date && dateString ? start_time : null
                                )
                            }
                        />
                    </div>
                    <div style={{ display: "inline-block" }}>
                        <div>To</div>
                        <DatePicker
                            format={date_format}
                            value={moment(datetimeFilters.end.date)}
                            picker="date"
                            disabledDate={(current) =>
                                current > moment().endOf("day")
                            }
                            onChange={(date, dateString) =>
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    date && dateString ? end_date : null
                                )
                            }
                        />
                        <DatePicker
                            format={time_format}
                            value={moment(
                                datetimeFilters.end.time,
                                time_format
                            )}
                            picker="time"
                            onChange={(date, dateString) =>
                                onDateFilterChange(
                                    date,
                                    dateString,
                                    date && dateString ? end_time : null
                                )
                            }
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "10px 20px 10px 20px",
                        }}
                    >
                        <FiltersModal
                            onFilterApply={applyAdvancedFilters}
                            onResetClick={resetFilters}
                        />
                    </div>
                </div>

                <div className="log-container">
                    <Table
                        loading={tableLoading}
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
