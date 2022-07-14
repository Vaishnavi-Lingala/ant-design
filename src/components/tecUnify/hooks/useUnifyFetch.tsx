import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import ApiUrls from '../../../ApiUtils';
import type { PaginationApiRes, ApiResError, Page } from '../types';

interface FetchOptions {
  template: 'Configured' | 'Available';
  page?: Page;
}

const accountId = localStorage.getItem('accountId') as string;

// Fetch apps using above async function, resolve the promises and sort
export function useFetch<T>({ template, page }: FetchOptions) {
  const [data, setData] = useState<PaginationApiRes<T>>();
  const [isFetching, toggleFetching] = useState(true);
  const [pageState, setPage] = useState<Page>(page ? page : { start: 1, limit: 10 });

  const isConfigured = (template === 'Configured');

  useEffect(() => {
    async function fetchApps<T>() {
      const url = isConfigured ?
        ApiUrls.configuredTemplates(accountId) : ApiUrls.availableTemplates(accountId)

      const res: PaginationApiRes<T> | ApiResError = await ApiService.get(url, pageState);

      if ('errorSummary' in res)
        throw res;

      return res;
    }

    fetchApps<T>()
      .then((appList) => {
        console.log("Fetching Account Apps", appList);
        toggleFetching(false);
        setData(appList);
      })
      .catch((err: ApiResError) => {
        console.log("Error: ", err);
        openNotification('error', 'Error fetching your App List.');
      });
  }, [pageState, isConfigured]);

  return { data, isFetching, setPage };
}
