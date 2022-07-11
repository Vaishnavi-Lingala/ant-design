import { useState, useEffect } from 'react';

interface FilterHookProps<T> {
  list: T;
  filterOn: string;
}

const defaultFilterState: FilterType = {
  activity: 'active',
  search: '',
  updated: false
}

// Typeguard to verify that the object passed in is actaully as array
// of type 'T'
function isArray<T>(list: any | any[]): list is T[] {
  return Array.isArray(list);
};

// Generic filter function, .filter() was giving issues when using on the list passed into the hook
function genFilter<T>(list: T[], filterFunc: (item: T) => boolean): T[] {
  const result = new Array<T>();
  list.forEach(
    (item) => filterFunc(item) && result.push(item)
  )
  return result;
}

// Takes the list passed in and the filterOn value, running the filter
// every time updateFilter func is ran from outside this hook. Will be kept in-sync
// via useEffect
function useFilter<T>({ list, filterOn }: FilterHookProps<T>) {
  console.log('From useFilter:', list);
  const [filteredData, setFilteredData] = useState<T>(list);
  const [filter, setFilter] = useState<FilterType>(defaultFilterState);

  function listIncludes(item: T): boolean {
    return item[filterOn].toLowerCase().includes(filter.search);
  }

  function filterList() {
    // If the filter is empty, reset the current search
    if (typeof filter.search === 'undefined') {
      setFilteredData(list);
      return
    }

    if (filter.updated && isArray<T>(list)) {
      const test = genFilter<T>(list, listIncludes);
      setFilteredData((test as unknown) as T);
    }
  }

  function filterActivityList() {
    if (typeof filter.search === 'undefined') {
      setFilteredData(list);
      return
    }

    if (filter.updated && ('activity' in filter)) {
      setFilteredData((curr) => {
        return {
          ...curr,
          [filter.activity!]: genFilter<T>(curr[filter.activity!], listIncludes)
        }
      });
    }
  };

  function updateFilter(event: any) {
    console.log('filtering args:', event);
    setFilter((curr) => {
      if (event.key) {
        return {
          ...curr,
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

  useEffect(() => {
    if ('active' in list)
      filterActivityList();

    if (isArray<T>(list) && 'template_type' in list[0])
      filterList();

    setFilter((curr) => {
      return {
        ...curr,
        updated: false
      }
    });
  }, [filter.activity, filter.search]);

  return { filter, filteredData, updateFilter };
}

export default useFilter;
