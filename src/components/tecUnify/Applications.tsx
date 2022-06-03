import { useState } from 'react';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';
import { mockApiRes } from './mockApiCall';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';
import BulkAssignment from './BulkAssignment';
import AppSettings from './AppSettings';

interface PageType {
  name: string;
  isLoading: boolean;
}

const homeComponent: PageType = {
  name: 'configured',
  isLoading: false,
};

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Applications(): JSX.Element {
  const [currPage, setCurrPage] = useState<PageType>(homeComponent);

  const isBulkAssignmentPage = (currPage.name === 'assignment');
  const isConfiguredPage = (currPage.name === 'configured');

  function handleClick(e: any): void {
    const currentPage = {
      name: e.target.parentNode.id,
      isLoading: false
    };

    setCurrPage(currentPage);
  }

  function handleBack(): void {
    setCurrPage(homeComponent);
  }

  function SwitchTrack(): JSX.Element | null {
    switch(currPage.name) {
      case 'configured':
        return <AccountIntegrations/>;
      case 'supported':
        return <SupportedIntegrations data={mockApiRes}/>;
      case 'assignment':
        return <BulkAssignment/>;
      case 'settings':
        return <AppSettings/>;
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

      <Skeleton loading={currPage.isLoading}>
        <div className='Content-HeaderContainer'>
          <Button id='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported apps 
          </Button>

          <Button id='assignment' size='large' type='primary' onClick={handleClick}>
            Bulk assign apps
          </Button>
        </div>

        <div className='Content-ComponentView'>
          <Skeleton loading={false}>
            <SwitchTrack/>
          </Skeleton>
        </div>
      </Skeleton>
    </>
  );
}

export default Applications;
