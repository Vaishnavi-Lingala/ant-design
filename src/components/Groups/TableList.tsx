import { Table } from "antd";
import { useState } from "react";

import AddGroup from "./AddGroup";

function TableList({ tableLoading, getGroupsByFilter, groupType, getGroups, columns, standardMachineGroups, getPage, getPageSize, getTotalItems}) {
    const [page, setPage] = useState(getPage);
    const [pageSize, setPageSize] = useState(getPageSize);
    const [totalItems, setTotalItems] = useState(getTotalItems);

    const params = {
        group_type: groupType,
        start: page,
        limit: pageSize
    }

    function onGroupsPageChange(page, pageSize) {
        const params = {
            group_type: groupType,
            start: page,
            limit: pageSize
        }
        getGroups({}, params);
    }
    return <>
        <AddGroup getGroupsByFilter={getGroupsByFilter} onGroupCreate={() => getGroups({}, params)} type={groupType} />
        <Table
            loading={tableLoading}
            style={{ border: '1px solid #D7D7DC' }}
            showHeader={true}
            columns={columns}
            dataSource={standardMachineGroups}
            pagination={{
                current: page,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                    onGroupsPageChange(page, pageSize);
                }
            }}
        />
    </>
}

export default TableList;
