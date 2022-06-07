import { useEffect, useState } from 'react';

import { openNotification } from "../Layout/Notification";
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';

import type { App, AppList, Config, Template } from './types';

const initAppList: AppList = {
  active: [],
  inactive: []
};

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

function useApps(): { appList: AppList; isFetching: boolean; } {
  const [appList, setAppList] = useState<AppList>(initAppList);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => {
    fetchApps()
      .then((configs) => {
        console.log("Fetching Main Apps");
        let activeApps = configs
          .filter((app): boolean => app.active);

        let inactiveApps = configs
          .filter((app): boolean => !app.active);

        toggleFetching(false);
        setAppList({
          active: activeApps,
          inactive: inactiveApps
        });
      }
    )
    .catch((err) => {
      console.log("Error: ", err);
    });
  },[]);

  return {appList, isFetching};
}

export default useApps;
