import { useState, useEffect, useCallback } from 'react';
import { FilterType, isArray } from '../types';

interface FilterHookProps<T> {
  list: T[];
  searchOn: string;
}

const defaultFilterState: FilterType = {
  search: '',
  updated: false
}

// Takes the list passed in and the filterOn value, running the filter
// every time updateFilter func is ran from outside this hook. Will be kept in-sync
// via useEffect
function useFilter<T>({ list, searchOn }: FilterHookProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(list);
  const [filter, setFilter] = useState<FilterType>(defaultFilterState);

  function updateFilter(event: any) {
    setFilter((curr) => {
      return {
        ...curr,
        search: event.toLowerCase(),
        updated: true
      }
    });
  }

  const runFilter = useCallback(() => {
    // If the filter is empty, reset the current search
    if (filter.search === '') {
      setFilteredData(list);
      return
    }

    const listIncludes = (item: T) =>
      item[searchOn].toLowerCase().includes(filter.search);

    if (isArray<T>(list)) {
      // Since we know the data being given to the hook is an array,
      // we can safely convert the type to an array in the below function
      // and later turn that T[] back into just T
      const filtered = genFilter<T>(list, listIncludes);
      setFilteredData(filtered);
    }

  }, [filter.search, list, searchOn])

  useEffect(() => {
    runFilter();
    // Return to an 'idle' state
    setFilter((curr) => {
      return {
        ...curr,
        updated: false
      }
    });

  }, [runFilter]);

  return { filter, filteredData, updateFilter };
}

// Generic filter function, .filter() was giving issues when using on the list passed into the hook
function genFilter<T>(list: T[], filterFunc: (item: T) => boolean): T[] {
  const result = new Array<T>();
  list.forEach(
    (item) => filterFunc(item) && result.push(item)
  )
  return result;
}

export default useFilter;
