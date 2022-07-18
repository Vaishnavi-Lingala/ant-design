import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, List, Empty } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

import { useFetch } from './hooks/useFetch';
import useFormSwitch from './hooks/useFormSwitch';
import AppFormRenderer from './newappforms';
import ApiUrls from '../../ApiUtils';

import type { MasterTemplate } from './types';
import type { PaginationConfig } from 'antd/lib/pagination';

const { Search } = Input;

function SupportedIntegrations(): JSX.Element {
  const accountId = localStorage.getItem('accountId') as string;
  const [modalVisible, toggleModal] = useState(false);
  const [appUID, setAppUID] = useState('');
  const history = useHistory();

  const { data, status } = useFetch<MasterTemplate[]>({
    url: ApiUrls.availableTemplates(accountId)
  });

  const { formArgs, setTemplateType } = useFormSwitch();

  if (data === undefined) {
    return <></>;
  }

  const paginationConfig: PaginationConfig = {
    position: 'bottom',
    total: 'total_items' in data ? data.total_items : 0,
    pageSize: 5
  };

  function handleClick(e) {
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
      </div>


      <div className='Content-ComponentView'>
        <div className='Sidebar'>
          <Search />
          <div>
            filters
          </div>
        </div>

        {
          status === 'error' ?
            <Empty className='_CenterInParent' />
            :
            <>
              {
                'results' in data &&
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
                      //@ts-ignore
                      extra={
                        <Button
                          icon={<BarsOutlined />}
                          onClick={handleClick}
                          id={app.template_type}
                          value={app.uid}
                        />
                      }
                    >
                      <List.Item.Meta
                        avatar={<img alt='app logo' src='https://placeholder.pics/svg/50' />}
                        title={app.name}
                      />
                    </List.Item>
                  )}
                />
              }

              <AppFormRenderer
                showModal={modalVisible}
                toggleModal={() => {
                  toggleModal(false);
                  setTemplateType('');
                }}
                formArgs={formArgs}
                appUID={appUID}
              />
            </>
        }
      </div>
    </>
  );
}

export default SupportedIntegrations;
