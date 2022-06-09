import { useState, useEffect } from 'react';

import type { App, AppList, FilterType } from './types';

interface FProps {
  appList: AppList;
}

const defaultFilterState: FilterType = {
  activity: 'active',
  search: '',
  updated: false
}

function useFilter({ appList }: FProps) {
  const [filteredAppList, setFilteredAppList] = useState<AppList>(appList);
  const [filter, setFilter] = useState<FilterType>(defaultFilterState);

  useEffect(() => {
    filterList();

    setFilter((curr) => {
      return {
        ...curr,
        updated: false
      }
    });
  }, [filter.activity, filter.search]);

  function filterList() {
    if (filter.search === '') {
      setFilteredAppList(appList);
      return
    }

    if (filter.updated) {
      console.log("Updating Filters")
      const filteredApps: App[] = appList[filter.activity]
        .filter(
          (app: App): boolean =>
            app.name.toLowerCase().includes(filter.search));

      setFilteredAppList({
        ...appList,
        [filter.activity]: filteredApps
      });
    }
  }

  function updateFilter(event: any) {
    setFilter((curr) => {
      if (event.key) {
        return {
          search: '',
          activity: event.key,
          updated: true
        }
      } else {
        return {
          ...curr,
          search: event.toLowerCase(),
          updated: true
        }
      }
    });
  }

  return { filter, filteredAppList, updateFilter };
}

export default useFilter;
