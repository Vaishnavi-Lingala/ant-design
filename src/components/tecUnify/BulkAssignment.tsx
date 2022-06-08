import { useState } from 'react';
import { Button, Checkbox, List, Input, Skeleton } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import useFetchUsers from './useFetchUsers';
import { isUser, App, Page, User } from './types'; 

interface BAProps {
  activeList: App[];
}

const initialPState: Page = {
    current: 1,
    limit: 10
};

const { Search } = Input;

function PascalCase(s: string) { return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase(); }

function BulkAssignment({activeList}: BAProps) {
  const [userPage, setUserPage] = useState(initialPState);
  const [appPage, setAppPage] = useState(initialPState);
  const [selectedUid, setSelectedUid] = useState<(string)[]>([]);
  const [filteredApps, setFilteredApps] = useState(activeList);

  const { userList, resetFilter, isFetching } = useFetchUsers(userPage);

  function filterFields(searchVal: string) {
    console.log(searchVal)
  }

  function sortFields(e: any) {
    switch(e.target.outerText) {
      case 'Users':
      case 'Applications':
      default:
    }
  }

  function handleCheckboxChange(e: CheckboxChangeEvent) {
    setSelectedUid(current => [...current, e.target.id as string]);
  }

  function UserList() {
    return (
      <div className='BulkAssignment-List'>
        <div className='BulkAssignment-ListHeader'>
          <span>Selected Users - {}</span>
          {ResetButton}
        </div>
        <ListSubHeader leftText="Users" rightText="Status"/>

        <List 
          itemLayout='vertical'
          pagination={{
            onChange: pageNum => setUserPage(currPage => {return {...currPage, current: pageNum}}),
            pageSize: userPage.limit,
            total: userList.total_items, 
            size: 'small'
          }}
          dataSource={userList.results}
          renderItem={(user): React.ReactNode => ListItem(user)}
          />
      </div>
    );
  }

  function ApplicationList() {
    return (
      <div className='BulkAssignment-List'>
        <div className='BulkAssignment-ListHeader'>
          <span>Selected Applications - {}</span>
          {ResetButton}
        </div>
        <ListSubHeader leftText="Applications"/>


        <List 
          itemLayout='vertical'
          pagination={{
            onChange: pageNum => setAppPage(currPage => {return {...currPage, current: pageNum}}),
            pageSize: appPage.limit,
            total: filteredApps.length, 
            size: 'small'
          }}
          dataSource={filteredApps}
          renderItem={(app) => ListItem(app)}
          />
      </div>
    );
  }

  function ListItem(item: App | User) {
    if (isUser(item)) {
      return (
        <List.Item className='BulkAssignment-ListItems'>
          <Checkbox 
            onChange={handleCheckboxChange}
            id={item.uid}
            style={{marginLeft: '7px', alignSelf: 'center'}}
          />

          <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: 'auto'}}>
            {item.user_name}
          </h4>

          <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: '7px'}}>
            {item.status && PascalCase(item.status)}
          </h4>
        </List.Item>
      );
    }

    return (
        <List.Item className='BulkAssignment-ListItems'>
          <Checkbox 
            onChange={handleCheckboxChange}
            id={item.app_id}
            style={{marginLeft: '7px', alignSelf: 'center'}}
          />

          <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: 'auto'}}>
            {item.name}
          </h4>
        </List.Item>
    );
  }
 
  const ResetButton = <Button onClick={resetFilter} type='link' size='small'>reset</Button>;
  
  function ListSubHeader({leftText = "", rightText = ""}) {
    return(
      <>
      <Search
        onSearch={val => console.log(val)}
        style={{padding: '7px'}}
        size='small'
        width='fill'
        placeholder={`Search for ${leftText}`}
      />
      
      <div className='BulkAssignment-ListSubHeader'>
        <span className='_Pointer' onClick={sortFields}>
          {leftText}
          <CaretDownOutlined/>
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
        <Button style={{alignSelf: 'end', margin: '5px 5px 0px'}}type='primary' size='middle'>Next</Button>
        <div className='BulkAssignment-ListGroup'>
          <ApplicationList/>
          <UserList/>
        </div>
      </div>
    </Skeleton>
  );
}

export default BulkAssignment;
