import { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';

import AccountIntegrations from './AccountIntegrations';
import { useFetch } from './hooks/useUnifyFetch';
import AppFormRenderer from './newappforms';
import { AppList } from './types';

const initAppList: AppList = {
  active: [],
  inactive: []
};

function Applications() {
  const [modalVisible, toggleModal] = useState(false);
  const { data, isFetching } = useFetch(48, initAppList);
  const match = useRouteMatch();

  return (
    <>
      <div className='content-header'>
        Configured Applications
      </div>

      <Skeleton
        loading={isFetching}
        active={true}
        className={`${isFetching ? '_Padding' : ''}`}
      >
        <div className='Content-HeaderContainer'>
          <Button value='supported' size='large' type='primary'>
            <Link
              to={{
                pathname: `${match.url}/supported`,
              }}
            >
              Browse Supported Apps
            </Link>
          </Button>

          <Button value='bulk' size='large' type='primary'>
            <Link
              to={{
                pathname: `${match.url}/assign`,
                state: { activeList: data.active },
              }}
            >
              Bulk Assign Apps
            </Link>
          </Button>

          <Button size='large' type='primary' onClick={() => toggleModal(curr => !curr)}>
            {/* NOTE: Temporary until we get supported app page displaying integrations */}
            Configure New Citrix VDI
          </Button>
        </div>

        <div className='Content-ComponentView'>
          <AccountIntegrations appList={data} />
        </div>
      </Skeleton>
      <AppFormRenderer showModal={modalVisible} toggleModal={() => toggleModal(curr => !curr)} />
    </>
  );
}

export default Applications;
