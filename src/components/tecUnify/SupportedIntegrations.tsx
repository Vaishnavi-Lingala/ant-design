import { Card, Input } from 'antd';

import useFilter from './useFilter';

import type { AppList, App } from './types';

const { Search } = Input;

interface SIProps {
  appList: AppList;
}

function SupportedIntegrations(): JSX.Element {

  function handleClick(e) {
  }

  function AppCard({app_id, name, window_title}: App) {
    return (
      <>
        <h4 className='AppList-CardHeader'>
          {name}
          <img className='AppList-CardBody_ImgSize' alt='app logo' src='https://placeholder.pics/svg/100' />
        </h4>
        <div className='AppList-CardBody'>
          <span>Window Title: {window_title}</span>
          <span>App Id: {app_id}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='Sidebar'>
        <Search/>
        <div>
          filters
        </div>
      </div>

        <ul className='AppList'>
        {/* 
          appList.map((item): JSX.Element => {
            return (
              <li className='AppList-Item AppList-Card'>
                <AppCard {...item}/>
              </li>
            );
          })
        */}
        </ul>
    </>
  );
}

export default SupportedIntegrations;
