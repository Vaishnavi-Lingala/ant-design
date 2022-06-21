import { Table } from "antd";
import { useState } from "react";

import AddGroup from "./AddGroup";

function TableList({ tableLoading, getGroupsByFilter, groupType, getGroups, columns, standardMachineGroups, getPage, getPageSize, getTotalItems }) {
    const [page, setPage] = useState(getPage);
    const [pageSize, setPageSize] = useState(getPageSize);
    const [totalItems, setTotalItems] = useState(getTotalItems);

    const params = {
        group_type: groupType,
    }

    function onGroupsPageChange(page, pageSize) {
        getGroups({}, params);
    }

    const updateColumnTitle = () => {
        columns[1].title = groupType === 'USER' ? 'User count' : 'Machine count'
        return null;
    }

    return <>
        <AddGroup getGroupsByFilter={getGroupsByFilter} onGroupCreate={() => getGroups({}, params)} type={groupType} />
        {updateColumnTitle()}
        <Table
            loading={tableLoading}
            style={{ border: '1px solid #D7D7DC' }}
            showHeader={true}
            columns={columns}
            dataSource={standardMachineGroups}
            scroll={{ x: true }}
            pagination={false}
        />
    </>
}

export default TableList;
