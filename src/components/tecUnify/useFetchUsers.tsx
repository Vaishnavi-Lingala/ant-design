import { useEffect, useState } from 'react';

import { openNotification } from "../Layout/Notification";
import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

import type { PaginationApiRes, Page } from './types';

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
  const res: PaginationApiRes = await ApiService
    .get(ApiUrls.users, { start: current, limit: limit });

  if ((res as PaginationApiRes)?.total_items === undefined) {
    return Promise.reject(new Error('API response does not match type def'))
  }

  return res;
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
      .catch(error => {
        console.error('Error: ', error)
        openNotification('error', 'Error fetching the User List.');
      });

  }, [userPage]);

  function resetFilter() {
    return userList;
  }

  return { userList, resetFilter, isFetching }
}

export default useFetchUsers;
