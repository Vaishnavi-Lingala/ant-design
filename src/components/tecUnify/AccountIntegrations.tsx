import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Input} from 'antd';
import { BarsOutlined, UserAddOutlined, UsergroupAddOutlined, PoweroffOutlined } from '@ant-design/icons';

import { openNotification } from "../Layout/Notification";
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';
import { AccountConfig, Template } from './types';

const { Search } = Input;

interface AppList {
  active?: AccountConfig[];
  inactive?: AccountConfig[];
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
  const [templatesRef, setTemplatesRef] = useState<Template[]>();
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

  async function fetchApps() {
    if (appList === undefined) {
      const configs: AccountConfig[] = await ApiService
        .get(ApiUrls.allAccountConfigs(48), undefined, true)
        .catch((error) => {
          console.error('Error: ', error);
          openNotification('error', 'An Error has occured getting the application list.');
        });

      let activeApps = configs.filter((app): boolean | undefined => app.active);
      let inactiveApps = configs.filter((app): boolean | undefined => !app.active);

      setAppList({
        active: activeApps,
        inactive: inactiveApps
      });

      setFilteredAppList(appList);

      const templateIds = configs
        .map(config => config.template_id)
        .filter((value, index, self) => self.indexOf(value) === index);

      const templatePromises = templateIds
        .map((id) => {
          return ApiService.get(ApiUrls.templateById(id), undefined, true); 
        });

      console.log(templatePromises);

      await Promise.all(templatePromises)
        .then((result: Template[]) => {setTemplatesRef(result)})
        .catch((error) => {
          console.error('Error: ', error);
          openNotification('error', 'An Error has occured getting the reference templates.');
        });
    }
  }

  function filterApps() {
    if (filter.search === '') {
      setFilteredAppList(appList);
      return
    }

    // const filteredApps = appList?.[filter.page].filter(
    //   (app: mockType): boolean | undefined =>
    //     app.app_name?.toLowerCase().includes(filter.search));

    // setFilteredAppList({
    //   ...appList,
    //   [filter.page]: filteredApps
    // });
  }

  function updateFilter(value: any) { 
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

  function lookupRef(template_id: number): Template {
    return templatesRef?.filter((template) => template.id === template_id);
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
          filteredAppList?.[filter.page].map((app: AccountConfig): JSX.Element => (
            <li className='AppList-Item AppList-Banner' key={app.config_id}>
              <Link to={{
                pathname: `/apps/${app.config_id}/${lookupRef(app.template_id).name}`,
                state: app
              }}>
                <img src={lookupRef(app.template_id).logo} width={50} height={50}/>
                {lookupRef(app.template_id).name}
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
