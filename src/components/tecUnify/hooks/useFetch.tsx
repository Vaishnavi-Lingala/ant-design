import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import { ApiResError, isArray, isPaginationType, PaginationApiRes } from '../types';

interface FetchProps {
  url: string;
}

export interface State<T> {
  results: T[];
  total_items: number;
}

type Status = 'idle' | 'fetching' | 'error';

// Fetch apps using above async function, resolve the promises and sort
export function useFetch<T>({ url }: FetchProps) {
  const [data, setData] = useState<State<T> | PaginationApiRes<T>>({
    results: new Array<T>(),
    total_items: 0
  });
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!url) return

    async function fetchApps() {
      setStatus('fetching');

      const res: ApiResError | T[] | PaginationApiRes<T[]> = await ApiService.get(url);
      if ('errorSummary' in res)
        throw res;

      return res;
    }

    fetchApps()
      .then((res) => {
        if (!isPaginationType<T>(res) && isArray<T>(res)) {
          setData({ results: res, total_items: res.length })
        } else if (Array.isArray(res)) {
          setData(res)
        }

        setStatus('idle');
      })
      .catch((err: ApiResError) => {
        setStatus('error');
        openNotification('error', `Error fetching data: ${err.errorSummary}`);
      });
  }, [url]);

  // Using type predicate to narrow our return type down
  if (isPaginationType<T>(data)) {
    console.log('paged via backend', data)
    return { data, status }
  }

  return { data, status }
}
