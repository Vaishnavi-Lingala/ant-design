import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import type { ApiResError } from '../types';

interface FetchOptions {
  url: string;
}

export interface State<T> {
  results: T | undefined;
  total_items: number;
}

type Status = 'idle' | 'fetching' | 'error';

// Fetch apps using above async function, resolve the promises and sort
export function useFetch<T>({ url }: FetchOptions) {
  const [data, setData] = useState<State<T> | T>({ results: undefined, total_items: 0 });
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!url) return

    async function fetchApps<T>() {
      setStatus('fetching');

      const res: ApiResError | T = await ApiService.get(url);
      console.log(res);
      if ('errorSummary' in res)
        throw res;

      return res;
    }

    fetchApps<T>()
      .then((data) => {
        // If data is an array and not already paginated, then we narrow type to State<T>
        if (Array.isArray(data) && !('next' in data)) {
          setData({ results: data, total_items: data.length })
        } else {
          setData(data)
        }
        setStatus('idle');
      })
      .catch((err: ApiResError) => {
        setStatus('error');
        openNotification('error', `Error fetching data: ${err.errorSummary}`);
      });
  }, [url]);

  return { data, status };
}
