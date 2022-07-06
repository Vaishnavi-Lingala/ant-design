import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';
import BulkAssignment from './BulkAssignment';
import AppSettings from './AppSettings';
import { useFetch } from './useUnifyFetch';
import { AppList } from './types';
import NewAppForm from './NewAppForm';

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
  const { data, isFetching, update } = useFetch(48, initAppList);

  const { productId } = useParams<any>();

  const isBulkAssignmentPage = (currPage.name === 'assignment');
  const isConfiguredPage = (currPage.name === 'configured');

  function handleClick(e: any) {
    const currentPage = {
      name: e.target.parentNode.id,
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
      case 'assignment':
        return <BulkAssignment activeList={data.active} />;
      case 'settings':
        return <AppSettings />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className='content-header'>
        {
          !isBulkAssignmentPage ?
            <>{capitalizeFirst(currPage.name)} Applications</> : <span>Bulk Assignment</span>
        }

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
          <Button id='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported Apps
          </Button>

          <Button id='assignment' size='large' type='primary' onClick={handleClick}>
            Bulk Assign Apps
          </Button>

          {
            isConfiguredPage &&
            <Button id='new' size='large' type='primary' onClick={() => toggleModal(curr => !curr)}>
              {/* NOTE: Temparary until we get supported app page displaying integrations */}
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
