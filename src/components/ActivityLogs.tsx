import { Skeleton } from 'antd';
import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { DatePicker, Space, Table } from 'antd';

import './ActivityLogs.css';

import Apis from "../Api.service";
import Search from 'antd/lib/input/Search';

function ActivityLogs() {

    const [clientId, setClientId] = useState("");
    const [issuer, setIssuer] = useState("");
    const [loading, setLoading] = useState(true);
    const domain = localStorage.getItem('domain');

    const columns = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          render: (text: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined) => <a>{text}</a>
        },
        {
          title: "Age",
          dataIndex: "age",
          key: "age"
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address"
        },
        {
          title: "Action",
          key: "action",
          render: (text: any, record: { name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }) => (
            <Space size="middle">
              <a>Invite {record.name}</a>
              <a>Delete</a>
            </Space>
          )
        }
      ];
      
      const data = [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park"
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park"
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No. 1 Lake Park"
        }
      ];

    useEffect(() => {
        Apis.getClientConfig(domain ? domain : '')
            .then((data) => {
                setLoading(false);
                setClientId(data.auth_cleint_id);
                setIssuer(data.cust_issuer_url);
            }).catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <>
            <div><h2>Activity Logs</h2></div>
            <Skeleton loading={loading}>
                <div className='filter-container'>
                    <div style={{ display:'inline-block'}}>
                        <div>From</div>
                    <DatePicker picker='date'/>
                    <DatePicker picker='time'/>
                    </div>
                    <div style={{ display:'inline-block'}}>
                        <div>To</div>
                    <DatePicker picker='date'/>
                    <DatePicker picker='time'/>
                    </div>

                    <div style={{paddingBottom: '20px'}}>
                        <label>Search</label>
                        <Search placeholder="input search with enterButton" enterButton />
                    </div>
                </div>

                <div className='log-container'>
                <Table columns={columns} dataSource={data} title={() => 'Header'} pagination={false}/>
                </div>
            </Skeleton>
        </>
    )
}

export default ActivityLogs;
