import { Table } from "antd";
import { useEffect, useState } from "react";

import AddGroup from "./AddGroup";

function TableList({ groupType, getGroups, columns, standardMachineGroups, getPage, getPageSize, getTotalItems}) {
    const [page, setPage] = useState(getPage);
    const [pageSize, setPageSize] = useState(getPageSize);
    const [totalItems, setTotalItems] = useState(getTotalItems);

    const params = {
        type: groupType,
        paginated: true,
        start: page,
        limit: pageSize
    }

    function onGroupsPageChange(page, pageSize) {
        const params = {
            type: groupType,
            paginated: true,
            start: page,
            limit: pageSize
        }
        getGroups(params);
    }

    const updateColumnTitle = () => {
        columns[1].title = groupType === 'USER' ? 'Users count' : 'Machines count'
        return null;
    }

    return <>
        <AddGroup onGroupCreate={() => getGroups(params)} type={groupType} />
        {updateColumnTitle()}
        <Table
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
