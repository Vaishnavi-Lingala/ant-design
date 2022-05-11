import {Button, Table} from 'antd';
import { useEffect, useState } from "react"

export default function GroupsList(props: any) {

    const [groups, setGroups] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { uid: any; }) => (
				<Button onClick={()=> getGroup(record.uid)}>
				  View
				</Button>
			)
		}
	];

    function getGroup(uid: any) {
		
	}
    
    return(
        <>
            <Table
                style={{ border: '1px solid #D7D7DC' }}
                showHeader={true}
                columns={columns}
                dataSource={groups}   
                // bordered={true}
                pagination={{ position: [] }}
            />
        </>
    )
}