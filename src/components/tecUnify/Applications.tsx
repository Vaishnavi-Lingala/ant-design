import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Menu, List, Input, Dropdown, Empty } from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import './tecUnify.css';

import ApiUrls from '../../ApiUtils';
import { useFetch, State } from './hooks/useFetch';
import { ConfiguredTemplate } from './types';
import { PaginationConfig } from 'antd/lib/pagination';

const { Search } = Input;

const options = (
  <Menu
    items={
      [
        {
          key: '1',
          label: <span><UserAddOutlined /> Assign to User</span>,
        },
        {
          key: '2',
          label: <span><UsergroupAddOutlined /> Assign to Group</span>
        },
        {
          key: '3',
          label: <span><PoweroffOutlined /> Move to Inactive</span>
        },
      ]
    } />
);

function Applications() {
  const accountId = localStorage.getItem('accountId') as string;
  const match = useRouteMatch();

  const { data, status } = useFetch<ConfiguredTemplate[]>({
    url: ApiUrls.configuredTemplates(accountId)
  });

  //TODO(CODY): Better method of type narrowing
  if (Array.isArray(data))
    return <></>

  const OptionsMenu = (
    <Dropdown placement='bottomRight' overlay={options} trigger={['click']}>
      <Button icon={<BarsOutlined />} />
    </Dropdown>
  );

  const paginationConfig: PaginationConfig = {
    position: 'bottom',
    total: data.total_items,
    pageSize: 5,
  };

  // TODO(Cody): Cleaner function to count active/inactive templates.
  // Possibly move to useFilter Hook
  function activityCount(data: State<ConfiguredTemplate[]>, activityType: string) {
    let count: number = 0; 

    if (activityType === 'active')
      count = data.results?.filter(template => template.active === true).length as number

    if (activityType === 'inactive')
      count = data.results?.filter(template => template.active === false).length as number

    return count
  }

  return (
    <>
      <div className='content-header'>
        Configured Applications
      </div>

      <div className='Content-HeaderContainer'>
        <Button value='supported' size='large' type='primary'>
          <Link to={{ pathname: `${match.url}/supported`, }}>
            Browse Supported Apps
          </Link>
        </Button>

        <Button value='bulk' size='large' type='primary'>
          <Link to={{ pathname: `${match.url}/assign` }}>
            Bulk Assign Apps
          </Link>
        </Button>
      </div>

      <div className='Content-ComponentView'>
        <div className='Sidebar'>
          <Search />
          <Menu className='_NoBorder'>
            <Menu.Item key='active'>Active - ({activityCount(data, 'active')})</Menu.Item>
            <Menu.Item key='inactive'>Inactive - ({activityCount(data, 'inactive')})</Menu.Item>
          </Menu>
        </div>
        {
          status === 'error' || data === undefined ?
            <Empty className='_CenterInParent' />
            :
            <List
              className='AppList'
              itemLayout='horizontal'
              size='small'
              loading={status === 'fetching'}
              dataSource={data.results}
              pagination={paginationConfig}
              renderItem={app => (
                <List.Item
                  key={app.uid}
                  extra={OptionsMenu}
                >
                  <List.Item.Meta
                    avatar={<img alt='app logo' src='https://placeholder.pics/svg/50' />}
                    title={app.name}
                  />
                </List.Item>
              )}
            />
        }
      </div>
    </>
  );
}

export default Applications;
