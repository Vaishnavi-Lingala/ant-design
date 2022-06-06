// TODO: Call API to get list of all Applications
// TODO: Virtual List, grab items as we scroll down the list

import { useState, useEffect } from 'react';
import { Button, Checkbox, List, Input } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

import type { paginationApiRes, User } from './types'; 
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Page {
  current: number;
  limit: number;
}

const initialPState: Page = {
    current: 1,
    limit: 10
};

const { Search } = Input;

function ProperCase(s: string) { return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase(); }

async function getUsersList({ current, limit }: { current: number; limit: number; }): Promise<paginationApiRes> {
  return await ApiService
    .get(ApiUrls.users, { start: current, limit: limit });
}

function BulkAssignment() {
  const [userPage, setUserPage] = useState<Page>(initialPState);
  const [appPage, setAppPage] = useState<Page>(initialPState);
  const [track, setTrack] = useState();

  const [selectedUid, setSelectedUid] = useState<(string | undefined)[]>([]);

  const [userList, setUserList] = useState<paginationApiRes>();
  const [filteredUsers, setFilteredUsers] = useState<paginationApiRes>();

  const [appList, setAppList] = useState();
  const [filteredApps, setFilteredApps] = useState();

  useEffect(() => { 
    getUsersList(userPage)
      .then((data: paginationApiRes) => {
        setUserList(data);
        setFilteredUsers(data);
      }) 
      .catch(error => console.error('Error: ', error));
  },[userPage, appPage]);

  function handleReset() {
    setFilteredUsers(userList);
  }


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
    setSelectedUid(current => [...current, e.target.id]);
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
            total: filteredUsers?.total_items, 
            size: 'small'
          }}
          dataSource={filteredUsers?.results}
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


        {/*
        <List 
          itemLayout='vertical'
          pagination={{
            onChange: pageNum => setAppPage(currPage => {return {...currPage, current: pageNum}}),
            pageSize: page.limit,
            total: filteredApps?.total_items, 
            size: 'small'
          }}
          header={SearchBar}
          dataSource={filteredApps?.results}
          renderItem={(app): React.ReactNode => ListItem(app)}
          />
        */}
      </div>
    );
  }

  function ListItem(user: User) {
    return (
    <List.Item className='BulkAssignment-ListItems'>
      <Checkbox onChange={handleCheckboxChange} id={user.uid} style={{marginLeft: '7px', alignSelf: 'center'}}/>
      <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: 'auto'}}>{user.user_name}</h4>
      <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: '7px'}}>{ProperCase(user.status)}</h4>
    </List.Item>
    );
  }
 
  const ResetButton = <Button onClick={handleReset} type='link' size='small'>reset</Button>;
  
  function ListSubHeader({leftText = "", rightText = ""}) {
    return(
      <>
      <Search
        onSearch={val => console.log(val)}
        style={{padding: '7px'}}
        size='small'
        width='fill'
        placeholder='Search for Users'
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
    <div className='BulkAssignment'>
      <Button style={{alignSelf: 'end', margin: '5px 5px 0px'}}type='primary' size='middle'>Next</Button>
      <div className='BulkAssignment-ListGroup'>
        <ApplicationList/>
        <UserList/>
      </div>
    </div>
  );
}

export default BulkAssignment;
