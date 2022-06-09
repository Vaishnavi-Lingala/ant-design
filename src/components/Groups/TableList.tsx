import { Table } from "antd";

import AddGroup from "./AddGroup";

function TableList({type, getGroups, columns, standardMachineGroups, }) {
    return <>
        <AddGroup onGroupCreate={getGroups} type={type} />
        <Table
            style={{ border: '1px solid #D7D7DC' }}
            showHeader={true}
            columns={columns}
            dataSource={standardMachineGroups}
            pagination={{ position: [] }}
        />
    </>
}

export default TableList;
