import { useState, useEffect } from 'react';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';
import { mockApiRes } from './mockApiCall';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';
import BulkAssignment from './BulkAssignment';

interface PageType {
  name: string;
  isLoading: boolean;
}

interface PageStateType {
  current: PageType;
  previous: PageType;
}

const homeComponent: PageStateType = {
  current: {
    name: 'configured',
    isLoading: false,
  },
  previous: {
    name: '',
    isLoading: false,
  }
};

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Applications(): JSX.Element {
  const [pageState, setPageState] = useState<PageStateType>(homeComponent);

  const isBulkAssignmentPage = (pageState.current.name === 'assignment');
  const isConfiguredPage= (pageState.current.name === 'configured');

  const handleClick = (e: any): void  => {
    const currentPage = {
      name: e.target.parentNode.id,
      isLoading: false
    };

    setPageState((currVal) => ({
      current: currentPage,
      previous: currVal.current
    }));
  }

  const handleBack = (): void => {
    setPageState(homeComponent);
  }

  const SwitchTrack = (): JSX.Element | null  => {
    switch(pageState.current.name) {
      case 'configured':
        return <AccountIntegrations/>;
      case 'supported':
        return <SupportedIntegrations data={mockApiRes}/>;
      case 'assignment':
        return <BulkAssignment/>;
      default:
        return null;
    }
  }

  return (
    <>
      <div className='content-header'>
        {
          !isBulkAssignmentPage ? 
            <>{capitalizeFirst(pageState.current.name)} Applications</> : <span>Bulk Assignment</span>
        }

        { 
          !isConfiguredPage &&
            <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={handleBack}>Back</Button>
        }
      </div>

      <Skeleton loading={pageState.current.isLoading}>
        <div className='header-container border'>
          <Button id='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported apps 
          </Button>

          <Button id='assignment' size='large' type='primary' onClick={handleClick}>
            Bulk assign apps
          </Button>
        </div>

        <div className='content-container-unify border'>
          <Skeleton loading={false}>
            <SwitchTrack/>
          </Skeleton>
        </div>
      </Skeleton>
    </>
  );
}

export default Applications;
