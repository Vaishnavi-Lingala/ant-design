import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

  const history = useHistory();

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

  const OptionsMenu = (
    <Dropdown placement='bottomRight' overlay={menuOptions} trigger={['click']}>
      <BarsOutlined className='_Pointer'/>
    </Dropdown>
  )

  function fetchApps(): void {
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

  function filterApps(): void {
    if (filter.search === '') {
      setFilteredAppList(appList);
      return
    }

    const filteredApps = appList?.[filter.page].filter(
      (app: mockType): boolean | undefined =>
        app.app_name?.toLowerCase().includes(filter.search));

    setFilteredAppList({
      ...appList,
      [filter.page]: filteredApps
    });
  }

  function updateFilter(value: any): void { 
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
      <div className='Sidebar'>
        <Search onSearch={updateFilter}/>
        <Menu className='_NoBorder' onClick={updateFilter}>
          <Menu.Item key='active'>Active - ({filteredAppList?.active?.length})</Menu.Item>
          <Menu.Item key='inactive'>Inactive - ({filteredAppList?.inactive?.length})</Menu.Item>
        </Menu>
      </div>
         
      <ul className='AppList _FlexColumn'>
        { (appList) &&
          filteredAppList?.[filter.page].map((app: mockType): JSX.Element => (
            <li className='AppList-Item AppList-Banner' key={app.app_id}>
              <Link to={{
                pathname: `/apps/${app.app_id}/${app.app_name}`,
                state: app
              }}>
                <img src={app.logo} width={50} height={50}/>
                {app.app_name}
              </Link>
              {OptionsMenu}
            </li>
          ))
        }
      </ul>
    </>
  );
}

export default AccountIntegrations;
