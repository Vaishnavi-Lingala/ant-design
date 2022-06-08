import { useState } from 'react';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';
import BulkAssignment from './BulkAssignment';
import AppSettings from './AppSettings';
import { useAppFetch } from './useUnifyFetch';

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
  const [currPage, setCurrPage] = useState(homeComponent);
  const { appList, isFetching } = useAppFetch();

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

  function RenderOptions(): JSX.Element | null {
    switch(currPage.name) {
      case 'configured':
        return <AccountIntegrations appList={appList}/>;
      case 'supported':
        // return <SupportedIntegrations templateList={}/>;
      case 'assignment':
        return <BulkAssignment activeList={appList.active}/>;
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

      <Skeleton loading={isFetching}>
        <div className='Content-HeaderContainer'>
          <Button id='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported apps 
          </Button>

          <Button id='assignment' size='large' type='primary' onClick={handleClick}>
            Bulk assign apps
          </Button>
        </div>

        <div className='Content-ComponentView'>
          <RenderOptions/>
        </div>
      </Skeleton>
    </>
  );
}

export default Applications;
