import { Button, Collapse, Skeleton } from "antd";
import { CaretRightOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";

import "./ActivityLogs.css";

import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";
import FiltersModal from "./FiltersModal";
import {
    date_format,
    time_format,
    ts_format,
    start_date,
    start_time,
    end_date,
    end_time,
    hiddenFields,
    logFieldNames
} from '../../constants';

const { Panel } = Collapse;

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";

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
    const filteredActivity = Object.fromEntries(Object.entries(activity).filter(([key]) => !hiddenFields.activity.includes(key)));;
    const filteredMachine = Object.fromEntries(Object.entries(machine).filter(([key]) => !hiddenFields.machine.includes(key)));;
    const filteredUser = Object.fromEntries(Object.entries(user).filter(([key]) => !hiddenFields.user.includes(key)));;

    return <>
        <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className="site-collapse-custom-collapse"
        >
            <Panel header="Activity" key="1">
                <div className="log-field-container">
                    {Object.keys(filteredActivity).map((recordKey) => (
                        <DisplayField
                            field={recordKey}
                            value={filteredActivity[recordKey]}
                            key={recordKey}
                            logFieldNames={logFieldNames.activity}
                        />
                    ))}
                </div>
            </Panel>
            <Panel header="Machine" key="2">
                <div className="log-field-container">
                    {Object.keys(filteredMachine).map((recordKey) => (
                        <DisplayField
                            field={recordKey}
                            value={filteredMachine[recordKey]}
                            key={recordKey}
                            logFieldNames={logFieldNames.machine}
                        />
                    ))}
                </div>
            </Panel>
            <Panel header="User" key="3">
                <div className="log-field-container">
                    {Object.keys(filteredUser).map((recordKey) => (
                        <DisplayField
                            field={recordKey}
                            value={filteredUser[recordKey]}
                            key={recordKey}
                            logFieldNames={logFieldNames.user}
                        />
                    ))}
                </div>
            </Panel>
        </Collapse>
    </>;
};

export default function ActivityLogs() {
    const [logResponse, setLogResponse] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [toastList, setToastList] = useContext(StoreContext);

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
            render: (text, record) => <>{moment.utc(record.activity?.created_ts).local().format(`${date_format} ${time_format}`)}</>
        },
        {
            title: "Actor",
            render: (text, record) => <>{record.activity?.display_name}</>
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
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with getting Activity Logs');
                console.log('response: ', response);
                setToastList([...toastList, response]);
            }
            setLoading(false);
            setTableLoading(false);
        })();
    }, [datetimeFilters, advancedFilters]);

    async function showMoreClick() {
        if (logResponse.next) {
            var url = new URL(`https://${logResponse.next}`);
            setTableLoading(true);
            try {
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
            } catch (error) {
                console.error('Error: ', error);

                const response = showToast('error', 'An Error has occured with getting Activity Logs');
                console.log('response: ', response);
                setToastList([...toastList, response]);
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

    // convert Local date time to utc date time
    function convertLocaltoUtc(local_ts, format) {
        return moment.utc(moment(local_ts)).format(format);
    }

    function generateFilterPayload() {
        const payload = Object.assign(
            {
                start_time: convertLocaltoUtc(`${datetimeFilters.start.date} ${datetimeFilters.start.time}`, ts_format),
                end_time: convertLocaltoUtc(`${datetimeFilters.end.date} ${datetimeFilters.end.time}`, ts_format),
            },
            advancedFilters
        );

        console.log("Activitylog Payload: ", payload);
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
                            expandedRowRender: (record) => {
                                return <ExpandedRows {...record} />
                            },
                            rowExpandable: (record) => record !== null,
                        }}
                        dataSource={logResponse.results}
                        title={() => (
                            <>
                                Events: <b> {logResponse.total_items ? logResponse.total_items : 0} </b>{" "}
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
