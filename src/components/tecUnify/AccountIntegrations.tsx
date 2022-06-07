import { useEffect, useState } from 'react';
import { Menu, Dropdown, Input } from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import AppBanner from './AppBanner';

import type { App, FilterType, AppList } from './types';

const { Search } = Input;

// NOTE: Maybe move updated field outside of the filter state
const defaultFilter: FilterType = {
  activity: 'active',
  search: '',
  updated: false
};
 
interface AIProps {
  appList: AppList;
}

function AccountIntegrations({appList} : AIProps): JSX.Element {
  const [filter, setFilter] = useState<FilterType>(defaultFilter);
  const [filteredAppList, setFilteredAppList] = useState<AppList>(appList);

  useEffect(() => {
    console.log("rerendering filters");
    filterList();
    
    setFilter((curr) => {
      return {
        ...curr,
        updated: false
      }
    });
  }, [filter.activity, filter.search]);

  const options = (
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
    <Dropdown placement='bottomRight' overlay={options} trigger={['click']}>
      <BarsOutlined className='_Pointer'/>
    </Dropdown>
  )

  function filterList() {
    if (filter.search === '') {
      setFilteredAppList(appList);
      return
    }

    if (filter.updated) {
      const filteredApps: App[] = appList[filter.activity]
        .filter(
          (app: App): boolean =>
            app.name.toLowerCase().includes(filter.search));

      setFilteredAppList({
        ...appList,
        [filter.activity]: filteredApps
      });
    }
  }

  function updateFilter(event: any) { 
    setFilter((curr) => {
      if (event.key) {
        return {
          search: '',
          activity: event.key,
          updated: true
        }
      } else {
        return {
          ...curr,
          search: event.toLowerCase(),
          updated: true
        }
      }
    });
  }

  return (
    <>
      <div className='Sidebar'>
        <Search onSearch={updateFilter}/>
        <Menu className='_NoBorder' onClick={updateFilter}>
          <Menu.Item key='active'>Active - ({filteredAppList.active.length})</Menu.Item>
          <Menu.Item key='inactive'>Inactive - ({filteredAppList.inactive.length})</Menu.Item>
        </Menu>
      </div>
      <ul className='AppList _FlexColumn'>
        { 
          filteredAppList[filter.activity]
            .map((app: App) => 
              <AppBanner
                key={app.xref_id} 
                app={app}
                optionsMenu={OptionsMenu}
              />
            )
        }
      </ul>
    </>
  );
}

export default AccountIntegrations;
