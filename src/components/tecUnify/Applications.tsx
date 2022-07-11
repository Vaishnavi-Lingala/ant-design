import { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';

import AccountIntegrations from './AccountIntegrations';
// import AppSettings from './AppSettings';
import { useFetch } from './hooks/useUnifyFetch';
import { AppList } from './types';
import NewAppForm from './newappforms/CitrixForm';

interface PageType {
  name: string;
  isLoading: boolean;
}

const initialComponent: PageType = {
  name: 'configured',
  isLoading: false,
};

const initAppList: AppList = {
  active: [],
  inactive: []
};

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Applications() {
  const [currPage, setCurrPage] = useState(initialComponent);
  const [modalVisible, toggleModal] = useState(false);
  const { data, isFetching } = useFetch(48, initAppList);
  console.log('Main:', data);
  const match = useRouteMatch();

  const isConfiguredPage = (currPage.name === 'configured');

  function handleClick(e: any) {
    const currentPage = {
      name: e.target.parentNode.value,
      isLoading: false
    };

    setCurrPage(currentPage);
  }

  function handleBack() {
    setCurrPage(initialComponent);
  }

  function RenderOptions(): JSX.Element | null {
    switch (currPage.name) {
      case 'configured':
        return <AccountIntegrations appList={data} />;
      case 'supported':
        return <>Component In Progress</>;
      // return <SupportedIntegrations templateList={}/>;
      // case 'settings':
      //   return <AppSettings />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className='content-header'>
        {capitalizeFirst(currPage.name)} Applications

        {
          !isConfiguredPage &&
          <Button onClick={handleBack}>Back</Button>
        }
      </div>

      <Skeleton
        loading={isFetching}
        active={true}
        className={`${isFetching ? '_Padding' : ''}`}
      >
        <div className='Content-HeaderContainer'>
          <Button value='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported Apps
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

          {
            isConfiguredPage &&
            <Button size='large' type='primary' onClick={() => toggleModal(curr => !curr)}>
              {/* NOTE: Temporary until we get supported app page displaying integrations */}
              {/* Configure new App */}
              Configure New Citrix VDI
            </Button>
          }
        </div>

        <div className='Content-ComponentView'>
          <RenderOptions />
        </div>
      </Skeleton>
      <NewAppForm showModal={modalVisible} toggleModal={() => toggleModal(curr => !curr)} />
    </>
  );
}

export default Applications;
