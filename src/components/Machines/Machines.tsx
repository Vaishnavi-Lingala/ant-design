import { Skeleton, Table, Button, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

import { showToast } from "../Layout/Toast/Toast";
import { StoreContext } from "../../helpers/Store";
import { useHistory } from 'react-router-dom';


export default function Machines() {

	const [loadingDetails, setLoadingDetails] = useState(false);
    const [machines, setMachines]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);
    const [toastList, setToastList] = useContext(StoreContext);
    const history = useHistory();

    const columns = [{
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
    }
    ,
    {
        title: 'Type',
        dataIndex: 'group_type',
        width: '20%'
    }
    ,
	{
		title: 'Actions',
		dataIndex: 'actions',
		width: '20%',
		render: (text: any, record: { uid: any; }) => (
			<Button onClick={() => history.push('/machines/' + record.uid)}>
			  View
			</Button>
		)
	}
    ]

    useEffect(() => {
        getMachines();
    }, [])

    const onMachinesPageChange = async (page, pageSize) => {
        const params = {
            start: page, 
            limit: pageSize
        }
        getMachines(params);
	}

    function getMachines(param={}){
        setLoadingDetails(true);
        ApiService.get(ApiUrls.machines).then(data => {
            console.log('Machines: ', data);
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setMachines(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            console.error('Error: ', error);
            setLoadingDetails(false);
            const response = showToast('error', 'An Error has occured with getting Machines');
            console.log('response: ', response);
            setToastList([...toastList, response]);
        })
    }


    return (
        <>
            <div className='content-header'>
				<span>Machines</span>
			</div>

			<Skeleton loading={loadingDetails}>
				 <Table
						style={{ border: '1px solid #D7D7DC' }}
						showHeader={true}
						columns={columns}
						dataSource={machines}
						pagination={{
							current: page, 
							pageSize: pageSize,
							total: totalItems,
							onChange:(page, pageSize) => {
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
