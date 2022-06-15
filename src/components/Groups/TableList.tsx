import { Table } from "antd";
import { useEffect, useState } from "react";

import AddGroup from "./AddGroup";

function TableList({ groupType, getGroups, columns, standardMachineGroups, getPage, getPageSize, getTotalItems}) {
    const [page, setPage] = useState(getPage);
    const [pageSize, setPageSize] = useState(getPageSize);
    const [totalItems, setTotalItems] = useState(getTotalItems);

    function onGroupsPageChange(page, pageSize) {
        const params = {
            type: groupType,
            paginated: true,
            start: page,
            limit: pageSize
        }
        getGroups(params);
    }
    return <>
        <AddGroup onGroupCreate={getGroups} type={groupType} />
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
