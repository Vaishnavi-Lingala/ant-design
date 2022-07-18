import { useEffect, useState } from 'react';

import { openNotification } from "../../Layout/Notification";
import ApiService from '../../../Api.service';
import type { ApiResError, PaginationApiRes } from '../types';

interface FetchOptions {
  url: string;
}

export interface State<T> {
  results: T;
  total_items: number;
}

type Status = 'idle' | 'fetching' | 'error';

// Fetch apps using above async function, resolve the promises and sort
export function useFetch<T>({ url }: FetchOptions) {
  const [data, setData] = useState<State<T[]>>({ results: [], total_items: 0 });

  const initPagedData: PaginationApiRes<T[]> = {
    items_on_page: 0,
    items_per_page: 0,
    next: '',
    page: 0,
    previous: '',
    results: new Array<T>(),
    total_items: 0
  }

  const [pagedData, setPagedData] = useState<PaginationApiRes<T[]>>(initPagedData);
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
      .then((data) => {
        if (!isPaginationType<T>(data)) {
          setData({ results: data, total_items: data.length })
        } else {
          setPagedData(data)
        }

        setStatus('idle');
      })
      .catch((err: ApiResError) => {
        setStatus('error');
        openNotification('error', `Error fetching data: ${err.errorSummary}`);
      });
  }, [url]);

  if (isPaginationType<T>(data))
    return { pagedData, status }

  return { data, status }
}

function isPaginationType<T>(o: any): o is PaginationApiRes<T[]> {
  return 'next' in o;
}
