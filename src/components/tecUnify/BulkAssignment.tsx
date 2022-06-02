// TODO: Call API to get list of all Applications
// TODO: Virtual List, grab items as we scroll down the list

import { useState, useEffect } from 'react';
import { Button, Checkbox, List, Input } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

import type { ApiResponse, User } from './types'; 
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface PageState {
  current: number;
  limit: number;
}

const initialPState: PageState = {
  current: 1,
  limit: 10
};

const { Search } = Input;

function ProperCase(s: string) { return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase(); }

function BulkAssignment() {
  const [page, setPage] = useState<PageState>(initialPState);
  const [selectedUid, setSelectedUid] = useState<(string | undefined)[]>([]);
  const [userList, setUserList] = useState<ApiResponse>();
  const [filteredUsers, setFilteredUsers] = useState<ApiResponse>();

	async function getUsersList({ current, limit }: { current: number; limit: number; }) {
		let data = await ApiService
      .get(ApiUrls.users, { start: current, limit: limit })
      .catch(error => console.error('Error: ', error));

		setUserList(data);
    setFilteredUsers(data);
	}

  useEffect(() => { 
    getUsersList(page); 
  },[page]);

  function handleReset() {
    setFilteredUsers(userList);
  }


  function filterUsers(searchVal: string) {
    console.log(searchVal)
  }

  function sortUsers(e: any) {
    switch(e.target.outerText) {
      case 'Users':
      case 'Applications':
      default:
    }
  }

  function handleCheckboxChange(e: CheckboxChangeEvent) {
    setSelectedUid(current => [...current, e.target.id]);
  }

  function UserListComponent(user: User) {
  }

  function ListItem(user: User) {
    return (
    <List.Item className='user-select-list'>
      <Checkbox onChange={handleCheckboxChange} id={user.uid} style={{alignSelf: 'center'}}/>
      <h4 style={{alignSelf: 'center', marginBottom: '0px', marginRight: 'auto'}}>{user.user_name}</h4>
      <h4 style={{alignSelf: 'center', marginBottom: '0px'}}>{ProperCase(user.status)}</h4>
    </List.Item>
    );
  }
 
  const ResetButton = <Button onClick={handleReset} type='link' size='small'>reset</Button>;
  
  function ListHeader({leftText = "", rightText = ""}) {
    return(
      <>
      <Search
        onSearch={val => console.log(val)}
        style={{padding: '5px'}}
        size='small'
        width='fill'
        placeholder='Search for Users'
      />
      
      <div className='list-header-container'>
        <span style={{cursor: 'pointer'}} onClick={sortUsers}>
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
    <div className='bulk-component'>
      <Button style={{alignSelf: 'end', margin: '5px 5px 0px'}}type='primary' size='middle'>Next</Button>
      <div className='list-container-group'>
        <div className='list-container'>
          <div className='sub-header border-bottom'>
            <span>Applications()</span>
            {ResetButton}
          </div>
          <ListHeader leftText="Applications"/>


          {/*
          <List 
            itemLayout='vertical'
            pagination={{
              onChange: page => setPage(currPage => {return {...currPage, current: page}}),
              pageSize: page.limit,
              total: filteredUsers?.total_items, 
              size: 'small'
            }}
            header={SearchBar}
            dataSource={filteredUsers?.results}
            renderItem={user => <UserListComponent {...user}/>}
            />
          */}
        </div>

        <div className='list-container'>
          <div className='sub-header border-bottom'>
            <span>Users()</span>
            {ResetButton}
          </div>
          <ListHeader leftText="Users" rightText="Status"/>

          <List 
            itemLayout='vertical'
            pagination={{
              onChange: page => setPage(currPage => {return {...currPage, current: page}}),
              pageSize: page.limit,
              total: filteredUsers?.total_items, 
              size: 'small'
            }}
            dataSource={filteredUsers?.results}
            renderItem={(user): React.ReactNode => ListItem(user)}
            />
        </div>
      </div>
    </div>
  );
}

export default BulkAssignment;
