import { Table } from "antd";
import { useState } from "react";

import AddGroup from "./AddGroup";

function TableList({ type, getGroups, columns, standardMachineGroups, getPage, getPageSize, getTotalItems}) {
    const [page, setPage] = useState(getPage);
    const [pageSize, setPageSize] = useState(getPageSize);
    const [totalItems, setTotalItems] = useState(getTotalItems);

    function onGroupsPageChange(page, pageSize) {
        const params = {
            start: page,
            limit: pageSize,
            paginated: true
        }
        getGroups(params);
    }
    return <>
        <AddGroup onGroupCreate={getGroups} type={type} />
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
