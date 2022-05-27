// TODO: Call API to get list of all Applications
// TODO: Virtual List, grab items as we scroll down the list

import { useState, useEffect, useContext } from 'react';
import { Checkbox } from 'antd';

import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';
import { StoreContext } from "../../helpers/Store";
import { showToast } from '../Layout/Toast/Toast';

function BulkAssignment() {
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [userList, setUserList] = useState();
	const [toastList, setToastList] = useContext(StoreContext);

	const getUsersList = async (page: number, pageSize: number) => {
		let data = await ApiService.get(ApiUrls.users, { start: page, limit: pageSize }).catch(error => {
			console.error('Error: ', error);
			const response = showToast('error', 'An Error has occured with getting User Lists by Page');
			console.log('response: ', response);
			setToastList([...toastList, response]);
		});

		console.log(data);
		setUserList(data);
	}

  return (
    <>
      <div className='bulk-container'>
        <div className='sub-header border-bottom'>
          <span>Applications</span>
          <a>reset</a>
        </div>

        <div>
        </div>
      </div>

      <div className='bulk-container'>
        <div className='sub-header border-bottom'>
          <span>Users</span>
          <a>reset</a>
        </div>
        <div>
        </div>
      </div>
    </>
  );
}

export default BulkAssignment;
