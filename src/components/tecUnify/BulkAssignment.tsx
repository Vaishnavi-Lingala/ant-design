import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Checkbox, List, Input, Skeleton } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import { useFetchUsers } from './hooks/useFetch';
import { useFetch } from './hooks/useUnifyFetch';
import { ConfiguredTemplate, Page, User } from './types';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

const initialPState: Page = {
  start: 1,
  limit: 10
};

const { Search } = Input;

function PascalCase(s: string) { return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase(); }

function BulkAssignment() {
  const [userPage, setUserPage] = useState(initialPState);
  const [appPage, setAppPage] = useState(initialPState);
  const [appSelection, setAppSelection] = useState<CheckboxValueType[]>([]);
  const [userSelection, setUserSelection] = useState<CheckboxValueType[]>([]);
  const history = useHistory();

  const { userList, resetFilter, isFetching } = useFetchUsers(userPage);
  const { data, isFetching: isFetchingTemplates } = useFetch<ConfiguredTemplate>({
    template: 'Configured',
    page: { start: 1, limit: 10 }
  });
  const isFetchingBoth = isFetching || isFetchingTemplates;


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

        <ListSubHeader
          leftText="Users"
          rightText="Status"
          key='users'
        />

        <Checkbox.Group
          name='user'
          value={userSelection}
          onChange={(event) => handleCheckBox(event, true)}
        >
          <List
            pagination={{
              onChange: (pageNum) => setUserPage(currPage => { return { ...currPage, current: pageNum } }),
              pageSize: userPage.limit,
              total: userList?.total_items,
              size: 'small'
            }}
            dataSource={userList?.results}
            renderItem={(user: User) => ListItem(user)}
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

        <ListSubHeader
          leftText="Applications"
          key='application'
        />

        <Checkbox.Group
          name='app'
          value={appSelection}
          onChange={(event) => handleCheckBox(event, false)}
        >
          <List
            pagination={{
              onChange: pageNum => setAppPage(currPage => { return { ...currPage, current: pageNum } }),
              pageSize: appPage.limit,
              total: data?.total_items,
              size: 'small'
            }}
            dataSource={data?.results}
            renderItem={(app) => <ListItem {...app} />}
          />
        </Checkbox.Group>
      </div>
    );
  }

  function ListItem(item: ConfiguredTemplate | User) {
    const isUser = 'idp_user_id' in item;
    return (
      <List.Item
        className='BulkAssignment-ListItems'
      >
        <Checkbox
          value={item.uid}
          style={{ marginLeft: '7px', alignSelf: 'center' }}
          checked={isUser ? userSelection.includes(item.uid) : appSelection.includes(item.uid)}
        />

        <h4 style={{ alignSelf: 'center', marginBottom: '0px', marginRight: 'auto' }}>
          {
            isUser ?
              item.first_name + ' ' + item.last_name
              :
              item.name
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

  function ListSubHeader({ leftText = "", rightText = "", }) {
    return (
      <>
        <Search
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
    <>
      <div className='content-header'>
        Bulk Assign Applications
        <Button onClick={() => history.goBack()}>Return</Button>
      </div>

      <div className='Content-HeaderContainer'>
      </div>

      <div className='Content-ComponentView'>
        <div className='BulkAssignment'>
          <Button
            className='Content-ContainerButton'
            type='primary'
            size='middle'
          >
            Next
          </Button>
          <div className='BulkAssignment-ListGroup'>
            <Skeleton loading={isFetchingBoth} className={`${isFetchingBoth && "_Padding"}`}>
              <ApplicationList />
              <UserList />
            </Skeleton>
          </div>
        </div>
      </div>
    </>
  );
}

export default BulkAssignment;
