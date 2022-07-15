import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Skeleton, Button, List } from 'antd';

import { useFetch } from './hooks/useFetch';
import useFormSwitch from './hooks/useFormSwitch';
import AppFormRenderer from './newappforms';
import ApiUrls from '../../ApiUtils';

import type { MasterTemplate, PaginationApiRes } from './types';

const { Search } = Input;

function SupportedIntegrations(): JSX.Element {
  const accountId = localStorage.getItem('accountId') as string;
  const [modalVisible, toggleModal] = useState(false);
  const [appUID, setAppUID] = useState('');
  const history = useHistory();

  const { data, status } = useFetch<PaginationApiRes<MasterTemplate>>({
    url: ApiUrls.availableTemplates(accountId),
    page: { start: 1, limit: 10 }
  });

  const { formArgs, setTemplateType } = useFormSwitch();

  if (data === undefined) {
    return <></>;
  }

  function handleClick(e) {
    setAppUID(e.currentTarget.value)
    setTemplateType(e.currentTarget.id);
    toggleModal(true)
  }

  const ActionButton = ({ uid, template_type }) => (
    <Button
      id={template_type}
      value={uid}
      size='middle'
      type='primary'
      onClick={handleClick}
    >
      Configure
    </Button>
  );

  return (
    <>
      <div className='content-header'>
        Supported Applications
        <Button onClick={() => history.goBack()}>Return</Button>
      </div>

      <Skeleton
        loading={status === 'fetching'}
        active={true}
        className={`${status === 'fetching' ? '_Padding' : ''}`}
      >
        <div className='Content-HeaderContainer'>
        </div>


        <div className='Content-ComponentView'>
          <div className='Sidebar'>
            <Search />
            <div>
              filters
            </div>
          </div>

          <List
            className='AppList'
            itemLayout='vertical'
            dataSource={data.results}
            pagination={{ position: 'bottom' }}
            size='small'
            renderItem={app => (
              <List.Item key={app.uid} extra={<ActionButton {...app} />}>
                <List.Item.Meta
                  avatar={<img alt='app logo' src='https://placeholder.pics/svg/75' />}
                  title={app.name}
                  description='Short blurb'
                />
              </List.Item>
            )}
          />

        </div>
        <AppFormRenderer
          showModal={modalVisible}
          toggleModal={() => {
            toggleModal(false);
            setTemplateType('');
          }}
          formArgs={formArgs}
          appUID={appUID}
        />
      </Skeleton>
    </>
  );
}

export default SupportedIntegrations;
