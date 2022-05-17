import { Skeleton, Table, Button, Select } from "antd";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

export default function Machines() {

    const [userDetails, setUserDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
    const [machines, setMachines]: any = useState([]);
	const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);

    const columns = [{
        title: 'Machine name',
        dataIndex: 'machine_name',
        width: '30%'
    },
    {
        title: 'Mac address',
        dataIndex: 'mac_address',
        width: '30%'
    },
	{
        title: 'Last known IP Address',
        dataIndex: 'local_ip',
        width: '20%'
    },
	{
		title: 'Actions',
		dataIndex: 'actions',
		width: '20%',
		render: (text: any, record: { uid: any; }) => (
			<Button onClick={() => console.log(record.uid)}>
			  View
			</Button>
		)
	}]

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
            setLoadingDetails(false);
        })
    }


    return (
        <>
        <div className='content-header'>
				{userDetails?<span>User</span>: <span>Users</span>}
				{userDetails? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {setUserDetails(undefined)}}>Back</Button> : <></>}
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