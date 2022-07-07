import { Menu, Dropdown, Input } from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import useFilter from './hooks/useFilter';
import AppListItem from './AppBanner';

import type { App, AppList } from './types';

const { Search } = Input;
 
interface AIProps {
  appList: AppList;
}

function AccountIntegrations({appList} : AIProps): JSX.Element {
  const {
    filter,
    filteredData,
    updateFilter
  } = useFilter<AppList>({
    list: appList,
    filterOn: 'display_name'
  });

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
          <Menu.Item key='active'>Active - ({filteredData.active.length})</Menu.Item>
          <Menu.Item key='inactive'>Inactive - ({filteredData.inactive.length})</Menu.Item>
        </Menu>
      </div>

      <ul className='AppList _FlexColumn'>
        { 
          filteredData[filter.activity!]
            .map((app: App) => 
              <AppListItem
                key={app.config_id} 
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
