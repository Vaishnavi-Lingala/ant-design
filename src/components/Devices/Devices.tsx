import { useEffect, useState } from "react";
import { Button, Modal, Skeleton, Table, Tooltip } from "antd";
import { BarsOutlined, CloseOutlined } from "@ant-design/icons"

import { openNotification } from "../Layout/Notification";
import ApiUrls from "../../ApiUtils"
import ApiService from "../../Api.service";
import { useHistory } from "react-router-dom";
import Device from "./Device";
import DeviceFiltersModal from "./DevicesFilterModal";

function Devices() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [devices, setDevices]: any = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [advancedFilters, setAdvancedFilters] = useState({});

    const device = {
        "device_name": "",
        "serial_number": "",
        "vendor": "",
        "is_blocked": false,
        "device_type": "",
        "model": "",
        "additional_info": ""
    }

    const columns = [
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            width: '20%',
        },
        {
            title: 'Device Name',
            dataIndex: 'device_name',
            width: '20%'
        },
        {
            title: 'Device Type',
            dataIndex: 'device_type',
            width: '20%'
        },
        {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            width: '20%'
        },
        {
            title: 'Details',
            dataIndex: 'details',
            width: '10%',
            render: (text: any, record: { device_id }) => (
                <Tooltip title="View">
                    <Button icon={<BarsOutlined />} onClick={() => {
                        history.push('/devices/' + record.device_id)
                    }}>
                    </Button>
                </Tooltip>
            )
        },
        {
            title: 'Blocked',
            dataIndex: 'blocked',
            width: '10%'
        }
    ];

    function getDevicesByFilter(object = {}, param = {}) {
        setTableLoading(true);
        ApiService.post(ApiUrls.deviceFilter, object, param)
            .then((data) => {
                console.log(data);
                setPage(data.page);
                setPageSize(data.items_per_page);
                setTotalItems(data.total_items);
                var deviceArray: any = [];
                for (var i = 0; i < data.results.length; i++) {
                    var obj;
                    obj = {
                        key: i + 1,
                        vendor: data.results[i].vendor,
                        device_name: data.results[i].device_name,
                        device_type: data.results[i].device_type,
                        serial_number: data.results[i].serial_number,
                        device_id: data.results[i].uid,
                        blocked: data.results[i].is_blocked ? "true" : "false"
                    }
                    deviceArray.push(obj);
                }
                setDevices(deviceArray);
                setTableLoading(false);
            })
    }

    function getDevices(object = {}, param = {}) {
        setLoading(true);
        ApiService.post(ApiUrls.deviceFilter, object, param)
            .then((data) => {
                console.log(data);
                setPage(data.page);
                setPageSize(data.items_per_page);
                setTotalItems(data.total_items);
                var deviceArray: any = [];
                for (var i = 0; i < data.results.length; i++) {
                    var obj;
                    obj = {
                        key: i + 1,
                        vendor: data.results[i].vendor,
                        device_name: data.results[i].device_name,
                        device_type: data.results[i].device_type,
                        serial_number: data.results[i].serial_number,
                        device_id: data.results[i].uid,
                        blocked: data.results[i].is_blocked ? "true" : "false"
                    }
                    deviceArray.push(obj);
                }
                setDevices(deviceArray);
                setLoading(false);
            })
    }

    useEffect(() => {
        getDevices({}, {start: page, limit: pageSize});
    }, [])

    const handleOk = (object: object) => {
        ApiService.post(ApiUrls.addDevice, object)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data);
                    openNotification('success', 'Successfully created Device');
                    setIsModalVisible(false);
                    getDevices({}, {start: page, limit: pageSize});
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Add mechanism error: ', error);
                openNotification('error', 'An Error has occured with adding Device');
            })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onDevicesPageChange = async (page, pageSize) => {
        const params = {
            start: page,
            limit: pageSize
        }
        getDevices({}, params);
    }

    const applyAdvancedFilters = (filters) => {
        setAdvancedFilters(filters)
    };

    const resetFilters = () => {
        setAdvancedFilters({})
        getDevicesByFilter({}, { start: page, limit: pageSize});
    };

    return <>
        <div className='content-header'>
            <span>Devices</span>
        </div>

        <Skeleton loading={loading}>
            <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6', display: 'flex' }}>
                <Button type='primary' size='large' onClick={() => setIsModalVisible(true)}>
                    Add New Device
                </Button>
                <div style={{ position: "relative", left: 470, top: 13 }}>
                    <DeviceFiltersModal
                        getDevicesByFilter={getDevicesByFilter}
                        onFilterApply={applyAdvancedFilters}
                        onResetClick={resetFilters}
                    />
                </div>
            </div>
            <Table
                loading={tableLoading}
                style={{ border: '1px solid #D7D7DC' }}
                showHeader={true}
                columns={columns}
                dataSource={devices}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                        onDevicesPageChange(page, pageSize);
                    }
                }}
            />

            <Modal visible={isModalVisible} footer={false} closeIcon={<Button icon={<CloseOutlined />}></Button>} width='800px' onCancel={handleCancel}
                title={<div style={{ fontSize: '30px' }}>Add New Device</div>} centered maskClosable={false}
            >
                <Device deviceDetails={device} handleOk={handleOk} handleCancel={handleCancel} />
            </Modal>
        </Skeleton>
    </>
}

export default Devices;
