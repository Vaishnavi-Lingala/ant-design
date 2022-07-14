import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Skeleton, Menu, List, Input, Dropdown } from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import './tecUnify.css';

import { useFetch } from './hooks/useUnifyFetch';
import { ConfiguredTemplate } from './types';

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

const gridList = {
  gutter: 10,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 3,
};

function Applications() {
  const match = useRouteMatch();

  const { data, isFetching } = useFetch<ConfiguredTemplate>({
    template: 'Configured',
    page: { start: 1, limit: 10 }
  });

  if (data === undefined) {
    return <></>;
  }

  const OptionsMenu = (
    <Dropdown placement='bottomRight' overlay={options} trigger={['click']}>
      <Button icon={<BarsOutlined />} />
    </Dropdown>
  );

  return (
    <>
      <div className='content-header'>
        Configured Applications
      </div>

      <Skeleton
        loading={isFetching}
        active={true}
        className={`${isFetching ? '_Padding' : ''}`}
      >
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
              <Menu.Item key='active'>Active - ()</Menu.Item>
              <Menu.Item key='inactive'>Inactive - ()</Menu.Item>
            </Menu>
          </div>

          <List
            className='AppList'
            itemLayout='horizontal'
            dataSource={data.results}
            pagination={{ position: 'bottom' }}
            grid={gridList}
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
        </div>
      </Skeleton>
    </>
  );
}

export default Applications;
