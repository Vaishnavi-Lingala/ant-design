import { useEffect, useState } from 'react';
import { openNotification } from "../../Layout/Notification";
import ApiService from "../../../Api.service"
import ApiUrls from '../../../ApiUtils';

import type { PaginationApiRes, Page, Domains, ApiResError, TimeoutOptions } from '../types';

// TODO: Move into single hook, allow hook user to supply a string referencing which fetch
// that they would like to use. (Generics!)

const initUserList: PaginationApiRes = {
  items_on_page: 0,
  items_per_page: 0,
  next: '',
  page: 0,
  previous: '',
  results: [],
  total_items: 0
};

const initOptions: TimeoutOptions = {
  FIFTEEN_MINUTES: "",
  FIVE_MINUTES: "",
  NINETY_MINUTES: "",
  ONE_TWENTY_MINUTES: "",
  SIXTY_MINUTES: "",
  TEN_MINUTES: "",
  THIRTY_MINUTES: ""
}

async function getUsersList({ current, limit }: Page) {
  const res: PaginationApiRes | ApiResError = await ApiService
    .get(ApiUrls
      .users(localStorage.getItem('accountId')),
      { start: current, limit: limit });

  // Type gaurd, narrowing the type down and also ensuring we throw a rejected promise 
  if ('errorSummary' in res)
    return Promise.reject(res)

  return res;
}

async function getDomains() {
  let res: Domains | ApiResError = await ApiService
    .get(ApiUrls.domains(localStorage.getItem('accountId')))

  if ('errorSummary' in res)
    return Promise.reject(res)

  // Remove 'WORKGROUP' from the data response
  return res.filter(domain => !domain.match('WORKGROUP')) as Domains;
}

async function getTimeoutOptions() {
  let res: TimeoutOptions | ApiResError = await ApiService
    .get(ApiUrls.idleTimeoutOptions(localStorage.getItem('accountId')))

  if ('errorSummary' in res)
    return Promise.reject(res)

  return res;
}

export function useFetchTimeout() {
  const [timeoutOptions, setOptions] = useState<TimeoutOptions>(initOptions);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => {
    getTimeoutOptions()
      .then((options) => {
        setOptions(options)
        toggleFetching(false);
      })
      .catch((error: ApiResError) => {
        console.error('Error: ', error.errorSummary);
        toggleFetching(false);
        openNotification('error', `Error fetching list of domains: ${error.errorSummary}`);
      })
  }, []);

  return { timeoutOptions, isFetching }
}

export function useFetchUsers(userPage: Page) {
  const [userList, setUserList] = useState<PaginationApiRes>(initUserList);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => {
    getUsersList(userPage)
      .then((pagedList) => {
        setUserList(pagedList);
        toggleFetching(false);
      })
      .catch(error => {
        console.error('Error: ', error);
        openNotification('error', `Error fetching list of users: ${error.errorSummary}`);
      });

  }, [userPage]);

  // Hard reset of the filter(searchbox and checkboxes) by way of returning
  // the original userlist
  function resetFilter() {
    return userList;
  }

  return { userList, resetFilter, isFetching }
}

export function useFetchDomains() {
  const [domains, setDomains] = useState<Domains>([]);
  const [isFetching, toggleFetching] = useState(true);

  useEffect(() => {
    getDomains()
      .then((domains) => {
        setDomains(domains)
        toggleFetching(false);
      })
      .catch((error: ApiResError) => {
        console.error('Error: ', error.errorSummary);
        toggleFetching(false);
        openNotification('error', `Error fetching list of domains: ${error.errorSummary}`);
      })
  }, []);

  return { domains, isFetching }
}
