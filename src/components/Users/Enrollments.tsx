import { Button, Skeleton, Table } from "antd";
import { useEffect, useState } from "react";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";
import { date_display_format, time_format } from "../../constants";
import moment from "moment";
import './Users.css';

export function Enrollments() {
    const [enrollments, setEnrollments]: any = useState(undefined);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const columns = [
        { title: "Instrument Id", dataIndex: "instrument_id", width: "25%" },
        {
            title: "Enrollment Time",
            render: (text, record) => <>{moment.utc(record.enrollment_time).local().format(`${date_display_format} ${time_format}`)}</>,
            width: "20%"
        },
        {
            title: "Last Login Time",
            render: (text, record) => <>{moment.utc(record.last_login_ts).local().format(`${date_display_format} ${time_format}`)}</>,
            width: "20%"
        },
        { title: "Product Version", dataIndex: "product_version", width: "15%" },
        { title: "Status", dataIndex: "status", width: "10%" },
        {
            title: "Actions", dataIndex: "activate", width: "10%", render: () => (
                <Button >Activate</Button>
            )
        }
    ]
    useEffect(() => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.enrollments(window.location.pathname.split('/')[2])).then(result => {
            setEnrollments(result);
        }).catch(error => {
            console.error(`Error in getting user enrollments: ${error}`);
            openNotification('error', 'Error in getting user enrollments')
        }).finally(() => {
            setLoadingDetails(false);
        })
    }, []);

    const updateColumnTitle = (eachProduct) => {
        columns[0].title = eachProduct.toLowerCase() === 'tectango' ? 'Card' : (eachProduct.toLowerCase() === 'tecbio' ? 'Finger' : 'Instrument Id')
        return null;
    }

    return <>
        <Skeleton loading={loadingDetails}>
            {
                Object.keys(enrollments?.products ? enrollments.products : {}).length > 0 ? Object.keys(enrollments.products).map((eachProduct) => {
                    return <div key={eachProduct}>
                        {updateColumnTitle(eachProduct)}
                        <Table style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            scroll={{ x: true }}
                            rowKey="uid"
                            dataSource={enrollments.products[eachProduct]}
                            title={() => <b>{eachProduct}</b>}
                            pagination={{
                                current: page,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setPage(page);
                                    setPageSize(pageSize);
                                }
                            }}
                        />
                    </div>
                }) : <><div className="message-header">No enrollments available for the user.</div></>
            }
        </Skeleton>
    </>
}
