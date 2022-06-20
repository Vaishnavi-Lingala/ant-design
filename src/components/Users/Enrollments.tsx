import { Button, Dropdown, Menu, Skeleton, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import ApiUrls from "../../ApiUtils";
import ApiService from "../../Api.service";
import { openNotification } from "../Layout/Notification";
import { date_display_format, time_format } from "../../constants";
import moment from "moment";
import './Users.css';
import { MoreOutlined } from "@ant-design/icons"

export function Enrollments() {
    const [enrollments, setEnrollments]: any = useState(undefined);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [definedStatusList, setDefinedStatusList]: any = useState([]);
    const [statusList, setStatusList]: any = useState([]);
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
            title: "Actions", dataIndex: "activate", width: "10%", render: (text, record) => (
                <Dropdown overlay={
                    <Menu key={"changeStatus"} title={"Change Status"} >
                        {
                            definedStatusList.map(item => {
                                return <Menu.Item key={item.key} onClick={({ key }) => { changeEnrollmentStatus(key, window.location.pathname.split('/')[2], record.uid) }}>
                                    {item.value}
                                </Menu.Item>
                            })
                        }
                    </Menu>}>
                    {
						<Tooltip title="Change status">
							<Button icon={<MoreOutlined/>} onClick={e => e.preventDefault()} />

						</Tooltip>
					}

                </Dropdown>
            )
        }
    ]

    useEffect(() => {
        const statusTypes = [
			{
				key: 'ACTIVE',
				value: 'Activate'
			},
			{
				key: 'BLOCK',
				value: 'Block'
			},
			{
				key: 'UNENROLLED',
				value: 'Unenroll'
			}
        ]
        setDefinedStatusList(statusTypes);
        getEnrollmentStatusOptions();
    }, []);

    useEffect(() => {
        getEnrollments();
        console.log( `status list: ${JSON.stringify(statusList)}`)
    }, [statusList]);

    const getEnrollmentStatusOptions = async () => {
        if (statusList === undefined || statusList.length <= 0) {
            let enrollmentStatusTypes = await ApiService.get(ApiUrls.getEnrollmentStatusOptions).catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting enrollment status list');
            });
            console.log(`enrollment list: ${JSON.stringify(enrollmentStatusTypes)}`);
            setStatusList(enrollmentStatusTypes);
        }
    }

    const getEnrollments = () => {
        setLoadingDetails(true);
        ApiService.get(ApiUrls.enrollments(window.location.pathname.split('/')[2])).then(result => {
            console.log(`enrollments: ${JSON.stringify(result)}`)
            setEnrollments(result);
        }).catch(error => {
            console.error(`Error in getting user enrollments: ${error}`);
            openNotification('error', 'Error in getting user enrollments')
        }).finally(() => {
            setLoadingDetails(false);
        })
    }

    const updateColumnTitle = (eachProduct) => {
        columns[0].title = eachProduct.toLowerCase() === 'tectango' ? 'Card' : (eachProduct.toLowerCase() === 'tecbio' ? 'Finger' : 'Instrument Id')
        return null;
    }

    const changeEnrollmentStatus = async (status, userId: string, enrollmentId: string) => {
        setLoadingDetails(true);
        let statusObj = {
            status: status
        }
        let result = await ApiService.put(ApiUrls.changeEnrollmentStatus(userId, enrollmentId), statusObj)
            .then(data => {
                if (!data.errorSummary) {
                    openNotification('success', `Status  has been updated successfully with ${status.toLowerCase()}.`);
                    setEnrollments(data);
                } else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
                
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with Updating User Status');
            }).finally(() => {
                setLoadingDetails(false);
            });
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
