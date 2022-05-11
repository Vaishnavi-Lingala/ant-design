import { useEffect, useState } from "react";
import {Table,  Button, Modal, Typography, Input } from "antd";
import ApiService from "../../Api.service";
import ApiUrls from '../../ApiUtils';


export default function MachinesSelection(props: any) {

    const { Title } = Typography;
    const { Search } = Input;

    const columns = [
		{
			title: 'Machine name',
			dataIndex: 'machine_name',
			width: '30%'
		},
        {
			title: 'Mac Address',
			dataIndex: 'mac_address',
			width: '40%'
		},
        {
			title: 'Operating System',
			dataIndex: 'os',
			width: '40%'
		}
		
	];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [machinesList, setMachinesList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage]: any = useState(1);
	const [pageSize, setPageSize]: any = useState(10);
	const [totalItems, setTotalItems]: any = useState(0);

    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
      };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleOk = () => {
        props.handleOk(selectedRowKeys, props.action);
        setSelectedRowKeys([]);
        setTotalItems(0);
        setSearchText('');
    };

    const handleCancel = () => {
        setSelectedRowKeys([]);
        setMachinesList([]);
        setTotalItems(0);
        setSearchText('');
        props.handleCancel(props.action);
    };

    const onSearch = text => {
        console.log('Search action: ', props.action);
        setSearchText(text)
        setPage(1);
        const params = {
            q : text
        }
        getMachinesNotInGroup(props.groupId, params);
    }

    function getMachinesNotInGroup(groupId, params={}){
        setLoadingDetails(true);
        ApiService.get(ApiUrls.machinesNotInGroup(groupId), params).then(data => {
            data.results.forEach(machine => {
                machine.key = machine.uid;
            })
            setMachinesList(data.results);
            setTotalItems(data.total_items);
            setLoadingDetails(false);
        }, error => {
            setLoadingDetails(false);
        })
    }



    useEffect(() => {
       getMachinesNotInGroup(props.groupId);
	}, [])

    const onMachinesPageChange = async (page, pageSize) => {
        const params = {
            q : searchText,
            start: page, 
            limit: pageSize
        }
        getMachinesNotInGroup(props.groupId, params);
	}


    return(
        <>
            <Modal title={<Title level={2}>{props.action} Users</Title>} visible={true} onOk={handleOk} onCancel={handleCancel} width={1000}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                       {props.action}
                    </Button>
                ]}>
                <div style={{ width: '100%', border: '1px solid #D7D7DC', borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6' }}>
                    <Search placeholder="Search for users by name or email" allowClear style={{ width: 400 }} 
                    onSearch={onSearch}
                    size="large"
                    enterButton/>
                </div>
                <Table
                    loading={loadingDetails}
                    style={{ border: '1px solid #D7D7DC' }}
                    showHeader={true}
                    columns={columns}
                    dataSource={machinesList}   
                    rowSelection={rowSelection}
                    // bordered={true}
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
                    
            </Modal>
        </>
    )
}