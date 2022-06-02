// TODO: Call API to get list of all Applications
// TODO: Virtual List, grab items as we scroll down the list

import { useState, useEffect, useContext } from 'react';
import { Checkbox } from 'antd';

import ApiService from "../../Api.service"
import ApiUrls from '../../ApiUtils';

interface PageState {
  current: number;
  limit: number;
}

const initialPState: PageState = {
  current: 1,
  limit: 10
};

function BulkAssignment(): JSX.Element {
  const [page, setPage] = useState<PageState>(initialPState);
  const [userList, setUserList] = useState();

	async function getUsersList({ current, limit }: { current: number; limit: number; }) {
		let data = await ApiService.get(ApiUrls.users, { start: current, limit: limit }).catch(error => {
			console.error('Error: ', error);
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
