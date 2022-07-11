import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import ApiUrls from '../../../ApiUtils';

interface HookResponseType {
  data: AppList;
  isFetching: boolean;
  update: () => void;
}

// Using the account-combo view in the database, get a array of all
// configs linked to the account. Afterwards strip the template IDs,
// make calls to the database to get templates by their ID. and then
// combine the configs array and template arrays. Returning the result
async function fetchApps(account_id: number): Promise<AppList> {
  const configs: Config[] = await ApiService
    .get(ApiUrls.allAccountConfigs(account_id), undefined, true);
  
  // The above call should for a fact return an array of configs, even if there is a single config linked
  // to the account, type guard below to break early if no data was properly fetched
  if ((configs[0] as Config)?.config_id === undefined) {
    return Promise.reject(new Error('Fetched config data does not match type def'))
  }

  const templateUids = configs
    .map(config => config.template_id)
    .filter((value, index, self) =>
      self.indexOf(value) === index
    );

  const templatePromises: Promise<Template>[] = templateUids
    .map((id) => {
      return ApiService.get(ApiUrls.templateById(id), undefined, true);
    });

  const refs = await Promise.all(templatePromises)
    .then((result) => {
      return result;
    });

  if ((refs[0] as Template)?.template_type === undefined) {
    return Promise.reject(new Error('Fetched template data does not match type def'))
  }

  const apps: App[] = configs.map((config) => {
    const match = refs.find((ref) => {
      return (ref.id === config.template_id);
    }) as Template;

    return { ...config, ...match };
  });

  return {
    active: apps.filter((app) => app.active),
    inactive: apps.filter((app) => !app.active)
  };
}

// Fetch apps using above async function, resolve the promises and sort
export function useFetch(account_id: number, initObject: AppList): HookResponseType {
  const [data, setData] = useState(initObject);
  const [isFetching, toggleFetching] = useState(true);
  const [refresh, toggleRefresh] = useState(false);

  useEffect(() => {
    fetchApps(account_id)
      .then((appList) => {
        console.log("Fetching Account Apps", appList);
        toggleFetching(false);
        setData(appList);
      })
      .catch((err) => {
        console.log("Error: ", err);
        openNotification('error', 'Error fetching your App List.');
      });
  }, [refresh, account_id]);

  return { data, isFetching, update: () => toggleRefresh((curr) => !curr)};
}

// Need an end point that fetches all non-deleted templates
// async function fetchTemplates(): Promise<Template[]> {
//   const templates: Template[] = await ApiService
//     .get(ApiUrls.)
// }

// export function useTemplateFetch({id}: Params): { templates: Template[]; isFetching: boolean; } {
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
