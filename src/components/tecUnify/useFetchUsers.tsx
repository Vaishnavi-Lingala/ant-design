import { useEffect, useState } from 'react';

import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

import type { PaginationApiRes, Page} from './types';

const initUserList: PaginationApiRes = {
    items_on_page: 0,
    items_per_page: 0,
    next: '',
    page: 0,
    previous: '',
    results: [],
    total_items: 0
};

async function getUsersList({ current, limit }: Page): Promise<PaginationApiRes> {
  return await ApiService
    .get(ApiUrls.users, { start: current, limit: limit })
    .catch(error => console.error('Error: ', error));
}

function useFetchUsers(userPage: Page) {
  const [userList, setUserList] = useState<PaginationApiRes>(initUserList);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => { 
    getUsersList(userPage)
      .then((pagedList) => {
        setUserList(pagedList);
        toggleFetching(false);
      })
      .catch(error => console.error('Error: ', error));

  },[userPage]);

  function resetFilter() {
    return userList;
  }

  return {userList, resetFilter, isFetching}
}

export default useFetchUsers;
