import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Collapse, Skeleton, DatePicker, Table } from "antd";
import { CaretRightOutlined } from '@ant-design/icons';
import moment from "moment";

import "./ActivityLogs.css";

import FiltersModal from "./FiltersModal";
import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import {
    date_format,
    time_format,
    ts_format,
    start_date,
    start_time,
    end_date,
    end_time,
    hiddenFields,
    logFieldNames,
    date_display_format
} from '../../constants';

const { Panel } = Collapse;

const DisplayField = ({ field, value, logFieldNames }) => {
    return (
        <>
            <div>
                <b>{logFieldNames[field]}</b>
            </div>
            <div>{value}</div>
        </>
    );
};

const ExpandedRows = ({ activity, user, machine, uid }) => {
    const filteredActivity = Object.fromEntries(Object.entries(logFieldNames?.activity ? logFieldNames?.activity : {}).filter(([key]) => !hiddenFields.activity.includes(key)));;
    const filteredMachine = Object.fromEntries(Object.entries(logFieldNames?.machine ? logFieldNames?.machine : {}).filter(([key]) => !hiddenFields.machine.includes(key)));;
    const filteredUser = Object.fromEntries(Object.entries(logFieldNames?.user ? logFieldNames?.user : {}).filter(([key]) => !hiddenFields.user.includes(key)));;

    return <>
        <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className="site-collapse-custom-collapse"
        >
            {
                activity ? <Panel header="Activity" key="1">
                    <div className="log-field-container">
                        {Object.keys(filteredActivity).map((recordKey) => (
                            <DisplayField
                                field={recordKey}
                                value={activity?.[recordKey]}
                                key={recordKey}
                                logFieldNames={logFieldNames.activity}
                            />
                        ))}
                    </div>
                </Panel> : null
            }
            {
                machine ? <Panel header="Machine" key="2">
                    <div className="log-field-container">
                        {Object.keys(filteredMachine).map((recordKey) => (
                            <DisplayField
                                field={recordKey}
                                value={machine?.[recordKey]}
                                key={recordKey}
                                logFieldNames={logFieldNames.machine}
                            />
                        ))}
                    </div>
                </Panel> : null
            }
            {
                user ? <Panel header="User" key="3">
                    <div className="log-field-container">
                        {Object.keys(filteredUser).map((recordKey) => (
                            <DisplayField
                                field={recordKey}
                                value={user?.[recordKey]}
                                key={recordKey}
                                logFieldNames={logFieldNames.user}
                            />
                        ))}
                    </div>
                </Panel> : null
            }
        </Collapse>
    </>;
};

export default function ActivityLogs() {
    const [logResponse, setLogResponse] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const { productId } = useParams<any>();
    
    const initialDateTimeFilters = {
        start: {
            date: moment().startOf("day").subtract(7, "days").format(date_format),
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
            render: (text, record) => <>{moment.utc(record.activity?.created_ts).local().format(`${date_display_format} ${time_format}`)}</>
        },
        {
            title: "Actor",
            render: (text, record) => <>{record.activity?.display_name ? record.activity?.display_name : "System"}</>
        },
        {
            title: "Event Info",
            dataIndex: "event_display_message",
            render: (text, record) => <>
                <div>{record.activity?.event_display_message}</div>
                <div>{record.activity?.event_outcome}</div>
            </>
        },
        {
            title: "Machine",
            render: (text, record) => <>{record.machine?.machine_name}</>
        }
    ];

    const disabledDate = (current) => {
        return (
            (current && current > moment().endOf("day")) ||
            current < moment().endOf("day").subtract(3, "M")
        );
    };

    useEffect(() => {
        (async function () {
            setTableLoading(true);
            try {
                const data = await ApiService.post(
                    ApiUrls.activityLog(productId),
                    generateFilterPayload()
                );
                    console.log(data);
                setLogResponse(data);
            } catch (error) {
                console.error('Error: ', error);
                openNotification('error', 'An error has occured with getting Activity Logs');
            }
            setLoading(false);
            setTableLoading(false);
        })();

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [datetimeFilters, advancedFilters]);

    async function showMoreClick() {
        if (logResponse.next) {
            var url = new URL(`https://${logResponse.next}`);
            setTableLoading(true);
            try {
                var response = await ApiService.post(
                    `${ApiUrls.activityLog(productId)}${url.search}`,
                    generateFilterPayload()
                );
                setTableLoading(false);

                console.log({ response });
                setLogResponse((logRes) => {
                    response.results = logRes.results.concat(response.results);
                    return { ...response };
                });
            } catch (error) {
                console.error('Error: ', error);
                openNotification('error', 'An error has occured with getting Activity Logs');
            }
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

    // Converts Local date time to utc date time
    function convertLocaltoUtc(local_ts, format) {
        return moment.utc(moment(local_ts)).format(format);
    }

    // Generates payload for the activity logs API call
    function generateFilterPayload() {
        const payload = Object.assign(
            {
                start_time: convertLocaltoUtc(`${datetimeFilters.start.date} ${datetimeFilters.start.time}`, ts_format),
                end_time: convertLocaltoUtc(`${datetimeFilters.end.date} ${datetimeFilters.end.time}`, ts_format),
            },
            advancedFilters
        );

        return payload;
    }

    return (
        <>
            <div className="content-header">
                Activity Logs
            </div>
            <Skeleton loading={loading}>
                <div className="filter-container">
                    <div style={{ display: "inline-block" }}>
                        <div>From</div>
                        <DatePicker
                            format={date_format}
                            value={moment(datetimeFilters.start.date)}
                            picker="date"
                            disabledDate={disabledDate}
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
                            disabledDate={disabledDate}
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
                            expandedRowRender: (record) => {
                                return <ExpandedRows {...record} />
                            },
                            rowExpandable: (record) => record !== null,
                        }}
                        dataSource={logResponse.results}
                        title={() => (
                            <>
                                Activities: <b> {logResponse.total_items ? logResponse.total_items : 0} </b>{" "}
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
