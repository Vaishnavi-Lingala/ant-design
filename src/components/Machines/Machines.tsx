import { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Skeleton, Table, Button, Tooltip } from "antd";
import { BarsOutlined } from "@ant-design/icons"

import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service"
import MachinesFiltersModal from "./MachinesFilterModal";

export default function Machines() {
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [machines, setMachines]: any = useState([]);
    const [page, setPage]: any = useState(1);
    const [pageSize, setPageSize]: any = useState(10);
    const [totalItems, setTotalItems]: any = useState(0);
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [object, setObject] = useState({});
    const history = useHistory();
    const accountId = localStorage.getItem('accountId');

    const columns = [
        {
            title: 'Machine name',
            dataIndex: 'machine_name',
            width: '20%'
        },
        {
            title: 'MAC',
            dataIndex: 'mac_address',
            width: '20%'
        },
        {
            title: 'Last known IP',
            dataIndex: 'local_ip',
            width: '20%'
        },
        {
            title: 'Type',
            dataIndex: 'group_type',
            width: '20%'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: '20%',
            render: (text: any, record: { uid: any; }) => (
                <Tooltip title="View">
                    <Button icon={<BarsOutlined />} onClick={() => history.push('/machines/' + record.uid)}>
                    </Button>
                </Tooltip>
            )
        }
    ];

    useEffect(() => {
        getMachines({}, { start: page, limit: pageSize });
    }, [])

    const onMachinesPageChange = async (page, pageSize) => {
        const params = {
            start: page,
            limit: pageSize
        }
        getMachinesByFilter(object, params);
    }

    function getMachinesByFilter(objectData = {}, params = {}) {
        setTableLoading(true);
        setObject(objectData);
        ApiService.post(ApiUrls.machineFilter(accountId), objectData, params).then(data => {
            console.log('Machines: ', data);
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setPage(data.page);
            setPageSize(data.items_per_page);
            setMachines(data.results);
            setTotalItems(data.total_items);
            setTableLoading(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Machines');
            setTableLoading(false);
        })
    }

    function getMachines(object = {}, params = {}) {
        setLoadingDetails(true);
        ApiService.post(ApiUrls.machineFilter(accountId), object, params).then(data => {
            console.log('Machines: ', data);
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setPage(data.page);
            setPageSize(data.items_per_page);
            setMachines(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            openNotification('error', 'An Error has occured with getting Machines');
            setLoadingDetails(false);
        })
    }

    const applyAdvancedFilters = (filters) => {
        setAdvancedFilters(filters)
    };

    const resetFilters = () => {
        setAdvancedFilters({})
        getMachinesByFilter();
    };

    return (
        <>
            <div style={{display: 'flex'}}>
                <div className='content-header' style={{width: '75%'}}>
                    <span>Machines</span>
                </div>
                <div style={{paddingTop: '22px'}}>
                    <MachinesFiltersModal
                        getMachinesByFilter={getMachinesByFilter}
                        onFilterApply={applyAdvancedFilters}
                        onResetClick={resetFilters}
                    />
                </div>
            </div>
            <Skeleton loading={loadingDetails}>
                <Table loading={tableLoading}
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={machines}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalItems,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                            onMachinesPageChange(page, pageSize);
                        }
                    }}
                />
            </Skeleton>
        </>
    )
}
