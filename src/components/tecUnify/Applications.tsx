import { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Menu, List, Input, Tooltip, Empty, Divider } from 'antd';
import { BarsOutlined, PoweroffOutlined } from '@ant-design/icons';

import './tecUnify.css';

import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';
import { useFetch, useFilter } from './hooks';
import AppFormRenderer from './newappforms';

import type { ConfiguredTemplate } from './types';
import type { PaginationConfig } from 'antd/lib/pagination';

const { Search } = Input;

function Applications() {
  const [activity, setActivity] = useState('active');
  const [modalVisible, toggleModal] = useState(false);
  const [template, setTemplate] = useState<ConfiguredTemplate>();
  const accountId = localStorage.getItem('accountId') as string;
  const match = useRouteMatch();

  const templateSelected = template !== undefined;

  const { data, status } = useFetch<ConfiguredTemplate>({
    url: ApiUrls.configuredTemplates(accountId)
  });

  const { filteredData, updateFilter } = useFilter({
    list: data.results,
    searchOn: 'name',
  })

  const templatesByActivity = {
    active: filteredData.filter(item => item.active),
    inactive: filteredData.filter(item => !item.active)
  };

  async function changeActivity(appUID: string, values: { "active": boolean }) {
    const res = await ApiService
      .put(ApiUrls.updateTemplate(accountId, appUID), values)

    if ('errorSummary' in res)
      throw res;

    return res;
  }

  function handleActivityChange(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    console.log(e.currentTarget.value);
    const selectedTemplate = filteredData.filter(item =>
      item.uid === e.currentTarget.value)[0];

    // Change sortedByActivity to state
    // update state here so we can trigger a rerender
    changeActivity(e.currentTarget.value, { "active": !selectedTemplate.active })
      .then()
      .catch(err => console.error(err))
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setTemplate(filteredData.filter(item =>
      item.uid === e.currentTarget.value)[0]);
    toggleModal(true);
  }

  useEffect(() => {
    if (template === undefined)
      toggleModal(curr => !curr)
  }, [template]);

  const OptionsMenu = ({ uid, active }) => (
    <span>
      <Tooltip
        placement='left'
        title='View'
        destroyTooltipOnHide
      >
        <Button
          type='default'
          icon={<BarsOutlined />}
          value={uid}
          onClick={handleClick}
        />
      </Tooltip>

      <Tooltip
        placement='right'
        title={active ? 'Set Inactive' : 'Set Active'}
        destroyTooltipOnHide
      >
        <Button
          type='primary'
          danger={active}
          icon={<PoweroffOutlined />}
          value={uid}
          onClick={handleActivityChange}
        />
      </Tooltip>
    </span>
  );

  const paginationConfig: PaginationConfig = {
    position: 'bottom',
    total: templatesByActivity[activity].length,
    pageSize: 10,
  };

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
          <Search
            onSearch={updateFilter}
            placeholder='Search'
          />
          <Divider />
          <Menu className='_NoBorder' onClick={e => setActivity(e.key)} defaultSelectedKeys={['active']}>
            <Menu.Item key='active'>
              Active - ({templatesByActivity.active.length})
            </Menu.Item>

            <Menu.Item key='inactive'>
              Inactive - ({templatesByActivity.inactive.length})
            </Menu.Item>
          </Menu>
        </div>

        {
          status === 'error' ?
            <Empty className='_CenterInParent' />
            :
            <List
              className='AppList'
              itemLayout='horizontal'
              size='small'
              loading={status === 'fetching'}
              dataSource={templatesByActivity[activity]}
              pagination={paginationConfig}
              renderItem={(template: ConfiguredTemplate) => (
                <List.Item
                  key={template.uid}
                  //@ts-ignore
                  extra={<OptionsMenu uid={template.uid} active={template.active} />}
                >
                  <List.Item.Meta
                    title={template.name}
                    avatar={<img
                      alt='App logo'
                      width={100}
                      src={template.app_img_url}
                    />
                    }
                  />
                </List.Item>
              )}
            />
        }
      </div>

      {
        templateSelected &&
        <AppFormRenderer
          showModal={modalVisible}
          toggleModal={() => {
            setTemplate(undefined);
            toggleModal(false);
          }}
          defaultValues={template}
          templateType={template.template_type}
          appUID={template.uid}
        />
      }
    </>
  );
}

export default Applications;
