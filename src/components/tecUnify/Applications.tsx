import { useState, useEffect } from 'react';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';
import { mockType, mockApiRes } from './mockApiCall';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';

interface LoadingState {
  page: boolean;
  content: boolean;
}

interface ComponentTrack {
  current: string;
  previous: string;
}

const home: ComponentTrack = {
  current: 'configured',
  previous: ''
};

function Applications() {
  const [isLoading, setIsLoading] = useState<LoadingState>({page: true, content: false});
  const [componentTrack, setComponentTrack] = useState<ComponentTrack>(home);
  useEffect(() => setIsLoading((currVal) => {return {...currVal, page: false}}), [componentTrack]);

  const handleClick = (e: any) => {
    setComponentTrack((currVal) => {
      return {
        current: e.target.parentNode.id,
        previous: currVal.current
      }
    });
  };

  const handleBack = () => {
    setComponentTrack(home);
  };

  function SwitchTrack(): JSX.Element | null {
    switch(componentTrack.current) {
      case 'configured':
        return <AccountIntegrations/>;
      case 'supported':
        return <SupportedIntegrations data={mockApiRes}/>;
      case 'assignment':
        return <>TODD</>;
      default:
        return null;
    }
  }

  return (
    <>
      <div className='content-header'>
        Configured Applications
        { 
          (componentTrack.current !== 'configured') &&
            <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={handleBack}>Back</Button>
        }
      </div>

      <Skeleton loading={isLoading.page}>
        <div className='header-container border'>
          <Button id='supported' size='large' type='primary' onClick={handleClick}>
            Browse Supported apps 
          </Button>

          <Button id='assigment' size='large' type='primary' onClick={handleClick}>
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
