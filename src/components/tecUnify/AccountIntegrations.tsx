import { useEffect, useState } from 'react';
import { Menu, Dropdown, Input} from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Search } = Input;

import { mockType, mockApiRes } from './mockApiCall';

interface AppList {
  active?: mockType[];
  inactive?: mockType[];
}

interface FilterType {
  page: string;
  search: string;
}

const defaultFilter: FilterType = {
  page: 'active',
  search: ''
};

function AccountIntegrations(): JSX.Element {
  const [appList, setAppList] = useState<AppList>();
  const [filteredAppList, setFilteredAppList] = useState<AppList>();
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  const fetchApps = () => {
    // NOTE: make api for app templates, joining with xref table. in order to get the templates
    // linked to the current account
    if (appList === undefined) {
      let activeApps = mockApiRes.filter((app): boolean | undefined => app.active);
      let inactiveApps = mockApiRes.filter((app): boolean | undefined => !app.active);

      setAppList({
        active: activeApps,
        inactive: inactiveApps
      });

      setFilteredAppList(appList);
    }
  }

  const filterApps = () => {
    if (filter.search !== '') {
      const filteredApps = appList?.[filter.page].filter((app): boolean | undefined => {
          return app.app_name?.toLowerCase().includes(filter.search);
      });

      setFilteredAppList({
        ...appList,
        [filter.page]: filteredApps
      });
    } else {
      setFilteredAppList(appList);
    }
  }
  console.log(appList);

  useEffect(() => {
    fetchApps();
    filterApps();
  },[filter, appList]);

  const menuOptions = (
    <Menu
      items={
    [
      {
        key: '1',
        label: <span><UserAddOutlined/> Assign to User</span>,
      },
      {
        key: '2',
        label: <span><UsergroupAddOutlined/> Assign to Group</span>
      },
      {
        key: '3',
        label: <span><PoweroffOutlined/> Move to Inactive</span>
      },
    ]
    }/>
  );

  const OptionsMenu = (): JSX.Element => (
      <Dropdown placement='bottomRight' overlay={menuOptions} trigger={['click']}>
          <BarsOutlined style={{ cursor: 'pointer' }} />
      </Dropdown>
  )

  const handleAppClick = (app: mockType) => { 
    console.log(app)
  }

  const updateFilter = (value: any) => {
    setFilter(() => {
      if (value.key) {
        return {
          search: '',
          page: value.key
        }
      } else {
        return {
          ...filter,
          search: value.toLowerCase()
        }
      }
    });
  }

  return (
    <>
      <div className='sidebar-container'>
        <Search style={{width: '200px'}} onSearch={updateFilter}/>
        <Menu className='no-border' onClick={updateFilter}>
          <Menu.Item key='active'>Active - ({filteredAppList?.active?.length})</Menu.Item>
          <Menu.Item key='inactive'>Inactive - ({filteredAppList?.inactive?.length})</Menu.Item>
        </Menu>
      </div>
         
      <ul className='app-list flex-adjust'>
        { (appList) &&
          filteredAppList?.[filter.page].map((app: mockType) => {
            return (
              <li className='app-item' key={app.app_id}>
                <img src={app.logo}/>
                <p onClick={() => handleAppClick(app)} >{app.app_name}</p>
                <OptionsMenu/>
              </li>
            );
          })
        }
      </ul>
    </>
  );
}

export default AccountIntegrations;
