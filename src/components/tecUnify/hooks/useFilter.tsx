import { useState, useEffect } from 'react';

import type { App, AppList, FilterType } from '../types';

interface FilterHookProps {
  appList: AppList;
}

const defaultFilterState: FilterType = {
  activity: 'active',
  search: '',
  updated: false
}

function useFilter({ appList }: FilterHookProps) {
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
      setFilteredAppList((curr) => {
        return {
          ...curr,
          [filter.activity]: curr[filter.activity].filter(
            (app: App): boolean =>
              app.display_name.toLowerCase().includes(filter.search))
        }
      });
    }
  };

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
