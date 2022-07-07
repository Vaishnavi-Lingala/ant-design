import { useState } from 'react';
import { Button, Checkbox, List, Input, Skeleton } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';


import { useFetchUsers } from './hooks/useFetch';
import useFilter from './hooks/useFilter';
import { App, Page, User } from './types';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface BulkAssignmentProps {
  activeList: App[];
}

const initialPState: Page = {
  current: 1,
  limit: 10
};

const { Search } = Input;

function PascalCase(s: string) { return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase(); }

// TODO: list styling better
function BulkAssignment({ activeList }: BulkAssignmentProps) {
  const [userPage, setUserPage] = useState(initialPState);
  const [appPage, setAppPage] = useState(initialPState);
  const [appSelection, setAppSelection] = useState<CheckboxValueType[]>([]);
  const [userSelection, setUserSelection] = useState<CheckboxValueType[]>([]);

  const { userList, resetFilter, isFetching } = useFetchUsers(userPage);

  const {
    filteredData: filteredApps,
    updateFilter: updateAppFilter
  } = useFilter<App[]>({
    list: activeList,
    filterOn: 'display_name'
  });

  function handleCheckBox(id: CheckboxValueType[], isUser: boolean) {
    console.log(id);
    isUser ? setUserSelection(id) : setAppSelection(id);
  }

  function sortFields(e: any) {
    switch (e.target.outerText) {
      case 'Users':
      case 'Applications':
      default:
    }
  }

  function UserList() {
    return (
      <div className='BulkAssignment-List'>
        <div className='BulkAssignment-ListHeader'>
          <span>Selected Users - {userSelection.length}</span>
          {ResetButton}
        </div>
        <ListSubHeader leftText="Users" rightText="Status" />

        <Checkbox.Group
          name='user'
          value={userSelection}
          onChange={(event) => handleCheckBox(event, true)}
        >
          <List
            pagination={{
              onChange: (pageNum) => setUserPage(currPage => { return { ...currPage, current: pageNum } }),
              pageSize: userPage.limit,
              total: userList.total_items,
              size: 'small'
            }}
            dataSource={userList.results}
            renderItem={(user) => ListItem(user)}
          />
        </Checkbox.Group>
      </div>
    );
  }

  function ApplicationList() {
    return (
      <div className='BulkAssignment-List'>
        <div className='BulkAssignment-ListHeader'>
          <span>Selected Applications - {appSelection.length}</span>
          {ResetButton}
        </div>
        <ListSubHeader leftText="Applications" />

        <Checkbox.Group
          name='app'
          value={appSelection}
          onChange={(event) => handleCheckBox(event, false)}
        >
          <List
            pagination={{
              onChange: pageNum => setAppPage(currPage => { return { ...currPage, current: pageNum } }),
              pageSize: appPage.limit,
              total: filteredApps.length,
              size: 'small'
            }}
            dataSource={filteredApps}
            renderItem={(app) => <ListItem {...app} />}
          />
        </Checkbox.Group>
      </div>
    );
  }

  function ListItem(item: App | User) {
    const isUser = 'idp_user_id' in item;
    return (
      <List.Item
        className='BulkAssignment-ListItems'
      >
        <Checkbox
          value={isUser ? item.uid : item.app_id}
          style={{ marginLeft: '7px', alignSelf: 'center' }}
          checked={isUser ? userSelection.includes(item.uid) : appSelection.includes(item.app_id)}
        />

        <h4 style={{ alignSelf: 'center', marginBottom: '0px', marginRight: 'auto' }}>
          {
            isUser ?
              item.first_name + ' ' + item.last_name
              :
              item.display_name
          }
        </h4>

        {
          isUser &&
          <h4 style={{ alignSelf: 'center', marginBottom: '0px', marginRight: '7px' }}>
            {item.status && PascalCase(item.status)}
          </h4>
        }
      </List.Item>
    );
  }

  const ResetButton = <Button onClick={resetFilter} type='link' size='small'>reset</Button>;

  function ListSubHeader({ leftText = "", rightText = "" }) {
    return (
      <>
        <Search
          onSearch={updateAppFilter}
          style={{ padding: '7px' }}
          size='small'
          width='fill'
          placeholder={`Search for ${leftText}`}
        />

        <div className='BulkAssignment-ListSubHeader'>
          <span className='_Pointer' onClick={sortFields}>
            {leftText}
            <CaretDownOutlined />
          </span>
          <span>
            {rightText}
          </span>
        </div>
      </>
    );
  };


  return (
    <Skeleton loading={isFetching} className={`${isFetching && "_Padding"}`}>
      <div className='BulkAssignment'>
        <Button style={{ alignSelf: 'end', margin: '5px 5px 0px' }} type='primary' size='middle'>Next</Button>
        <div className='BulkAssignment-ListGroup'>
          <ApplicationList />
          <UserList />
        </div>
      </div>
    </Skeleton>
  );
}

export default BulkAssignment;
