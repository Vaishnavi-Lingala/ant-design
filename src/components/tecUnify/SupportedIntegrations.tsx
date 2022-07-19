import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, List, Empty, Tooltip } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

import { useFetch, useFilter } from './hooks';
import AppFormRenderer from './newappforms';
import ApiUrls from '../../ApiUtils';

import type { MasterTemplate } from './types';
import type { PaginationConfig } from 'antd/lib/pagination';

const { Search } = Input;

function SupportedIntegrations() {
  const accountId = localStorage.getItem('accountId') as string;
  const [modalVisible, toggleModal] = useState(false);
  const [appUID, setAppUID] = useState('');
  const [templateType, setTemplateType] = useState<string>();
  const history = useHistory();

  const { data, status } = useFetch<MasterTemplate>({
    url: ApiUrls.availableTemplates(accountId)
  });

  const { filteredData, updateFilter } = useFilter({
    list: data.results,
    searchOn: 'name',
  });

  const activeOnly = filteredData.filter(item => item.active);

  const paginationConfig: PaginationConfig = {
    position: 'bottom',
    total: activeOnly.length,
    pageSize: 5
  };

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAppUID(e.currentTarget.value)
    setTemplateType(e.currentTarget.id);
    toggleModal(true)
  }

  return (
    <>
      <div className='content-header'>
        Supported Applications
        <Button onClick={() => history.goBack()}>Return</Button>
      </div>

      <div className='Content-HeaderContainer'>
        <Search
          onSearch={updateFilter}
          style={{ width: '25%' }}
          placeholder='Search'
        />
      </div>

      <div className='Content-ComponentView'>
        {
          status === 'error' ?
            <Empty className='_CenterInParent' />
            :
            <>
              <List
                className='AppList'
                itemLayout='horizontal'
                size='small'
                loading={status === 'fetching'}
                dataSource={activeOnly}
                pagination={paginationConfig}
                renderItem={app => (
                  <List.Item
                    key={app.uid}
                    extra={
                      <Tooltip
                        placement='left'
                        title='Add'
                        destroyTooltipOnHide
                      >
                        <Button
                          icon={<BarsOutlined />}
                          onClick={handleClick}
                          id={app.template_type}
                          value={app.uid}
                        />
                      </Tooltip>
                    }
                  >
                    <List.Item.Meta
                    title={app.name}
                    avatar={<img
                      alt='app logo'
                      width={100}
                      height={75}
                      src='https://placeholder.pics/svg/50'
                    />
                    }
                    />
                  </List.Item>
                )}
              />

              <AppFormRenderer
                showModal={modalVisible}
                toggleModal={() => {
                  toggleModal(false);
                  setTemplateType(undefined);
                }}
                appUID={appUID}
                templateType={templateType}
              />
            </>
        }
      </div>
    </>
  );
}

export default SupportedIntegrations;
