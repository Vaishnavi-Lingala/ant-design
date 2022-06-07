import { useState, useRef, useEffect } from 'react';
import { Button, Skeleton } from 'antd';

import './tecUnify.css';
import { mockApiRes } from './mockApiCall';

import { openNotification } from "../Layout/Notification";
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';

import SupportedIntegrations from './SupportedIntegrations';
import AccountIntegrations from './AccountIntegrations';
import BulkAssignment from './BulkAssignment';
import AppSettings from './AppSettings';

import { App, AppList, Config, Template, FilterType } from './types';

interface PageType {
  name: string;
  isLoading: boolean;
}

const homeComponent: PageType = {
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

function Applications(): JSX.Element {
  const [currPage, setCurrPage] = useState<PageType>(homeComponent);
  const [appList, setAppList] = useState<AppList>(initAppList);

  const isBulkAssignmentPage = (currPage.name === 'assignment');
  const isConfiguredPage = (currPage.name === 'configured');
  const appListIsEmpty = appList.active.length === 0 ||
                         appList.inactive.length === 0; 

  let isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    if (appListIsEmpty) {
      fetchApps()
        .then((configs) => {
          if (isMounted.current) {
            let activeApps = configs
              .filter((app): boolean => app.active);

            let inactiveApps = configs
              .filter((app): boolean => !app.active);

            setAppList({
              active: activeApps,
              inactive: inactiveApps
            });
          }
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
    console.log("rendering")
    return(() => {
      isMounted.current = false
    });
  },[]);


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
        return ( 
          <AccountIntegrations appList={appList}/>
        );
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

async function fetchApps(): Promise<App[]> {
  const configs: Config[] = await ApiService
    .get(ApiUrls.allAccountConfigs(48), undefined, true)
    .catch((err) => {
      console.log("Error: ", err);
    });

    const templateIds = configs
      .map(config => config.template_id)
      .filter((value, index, self) => 
        self.indexOf(value) === index
      );

    const templatePromises: Promise<Template>[] = templateIds
      .map((id) => {
        return ApiService.get(ApiUrls.templateById(id), undefined, true); 
      });

    const refs = await Promise.all(templatePromises)
      .then((result) => {
        return result;
      });

    const apps: App[] = configs.map((config) => {
      const match = refs.find((ref) => {
        return (ref.id === config.template_id);
      }) as Template;   

      return {...config, ...match} as App;
    });
  return apps;
}

export default Applications;
