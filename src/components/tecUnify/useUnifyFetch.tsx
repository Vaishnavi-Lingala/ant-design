import { useEffect, useState } from 'react';

import { openNotification } from "../Layout/Notification";
import ApiService from '../../Api.service';
import ApiUrls from '../../ApiUtils';

import type { App, AppList, Config, Template } from './types';

const initAppList: AppList = {
  active: [],
  inactive: []
};

// Using the account-combo view in the database, get a array of all
// configs linked to the account. Afterwards strip the template IDs,
// make calls to the database to get templates by their ID. and then
// combine the configs array and template arrays. Returning the result
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

      return {...config, ...match};
    });
  return apps;
}

// Need an end point that fetch all templates
// async function fetchTemplates(): Promise<Template[]> {
//   const templates: Template[] = await ApiService
//     .get(ApiUrls.)
// }

// Fetch apps using above async functions, resolve the promises and
// sort
export function useAppFetch(): { appList: AppList; isFetching: boolean; } {
  const [appList, setAppList] = useState(initAppList);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => {
    fetchApps()
      .then((configs) => {
        console.log("Fetching Account Apps");
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

// export function useTemplateFetch() : { templates: Template[]; isFetching: boolean; } {
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [isFetching, toggleFetching] = useState(true);

//   useEffect(() => {
//     fetchTemplates()
//       .then((templates) => {
//         console.log("Fetching Templates");
//         toggleFetching(false);
//         setTemplates(templates);
//       }
//     )
//     .catch((err) => {
//       console.log("Error: ", err);
//     });
//     },[]);

//   return {templates, isFetching};
// }
