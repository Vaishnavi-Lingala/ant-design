import { Menu, Dropdown, Input } from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import useFilter from './useFilter';
import AppListItem from './AppBanner';

import type { App, AppList } from './types';

const { Search } = Input;
 
interface AIProps {
  appList: AppList;
}

function AccountIntegrations({appList} : AIProps): JSX.Element {
  const {filter, filteredAppList, updateFilter} = useFilter({appList});

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
  );

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
              <AppListItem
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
