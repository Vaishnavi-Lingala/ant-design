import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import type { ApiResError, Page } from '../types';

interface FetchOptions {
  url: string;
  page?: Page;
}

type Status = 'idle' | 'fetching' | 'error';

// Fetch apps using above async function, resolve the promises and sort
export function useFetch<T>({ url, page }: FetchOptions) {
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<Status>('idle');
  const [pageState, setPage] = useState<Page>(page ? page : { start: 1, limit: 10 });

  useEffect(() => {
    if (!url) return

    async function fetchApps<T>() {
      setStatus('fetching');

      const res: ApiResError | T = await ApiService.get(url, pageState);
      if ('errorSummary' in res)
        throw res;

      return res;
    }

    fetchApps<T>()
      .then((data) => {
        setData(data)
        setStatus('idle');
      })
      .catch((err: ApiResError) => {
        setStatus('error');
        openNotification('error', `Error fetching data: ${err.errorSummary}`);
      });
  }, [pageState, url]);

  return { data, status, setPage };
}
