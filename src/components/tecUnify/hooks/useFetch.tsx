import { useEffect, useState } from 'react';
import { openNotification } from "../../Layout/Notification";
import ApiService from "../../../Api.service"
import ApiUrls from '../../../ApiUtils';
import type { PaginationApiRes, TimeoutOptions, Page, ApiResError, Domains, User } from '../types';

async function getUsersList(page: Page) {
  const res: PaginationApiRes<User> | ApiResError = await ApiService
    .get(ApiUrls
      .users(localStorage.getItem('accountId')),
      page
    );

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
  const [timeoutOptions, setOptions] = useState<TimeoutOptions>();
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
  const [userList, setUserList] = useState<PaginationApiRes<User>>();
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
