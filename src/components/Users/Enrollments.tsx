import { Button, Skeleton, Table } from "antd";
import { useEffect, useState } from "react";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";

export function Enrollments() {
    const [enrollments, setEnrollments]: any = useState(undefined);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const columns = [{ title: "Status", dataIndex: "status", width: "30%" },
    { title: "Instrument Id", dataIndex: "instrument_id", width: "30%" },
    { title: "Enrollment Time", dataIndex: "enrollment_time", width: "30%" },
    { title: "Product Version", dataIndex: "product_version", width: "30%" },
    { title: "Last Login TS", dataIndex: "last_login_ts", width: "30%" },
    {
        title: "Actions", dataIndex: "activate", width: "30%", render: () => (
            <Button >Activate</Button>
        )
    },
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

    return <>
        <Skeleton loading={loadingDetails}>
            {
                Object.keys(enrollments?.products ? enrollments.products : {})?.map((eachProduct) => {
                    return <div key={eachProduct}>
                        <div style={{
                            fontWeight: 600, fontSize: 'x-large',
                            width: '100%', border: '1px solid #D7D7DC',
                            borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
                        }}>{eachProduct}</div>
                        <Table style={{ border: '1px solid #D7D7DC' }}
                            showHeader={true}
                            columns={columns}
                            rowKey="uid"
                            dataSource={enrollments.products[eachProduct]}
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
                })
            }
        </Skeleton>
    </>
}
