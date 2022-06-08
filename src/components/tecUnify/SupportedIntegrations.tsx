import { Card, Input } from 'antd';

import useFilter from './useFilter';

import type { Template } from './types';

const { Search } = Input;

interface SIProps {
  templateList: Template[];
}

function SupportedIntegrations({templateList}: SIProps): JSX.Element {

  function handleClick(e) {
  }

  function AppCard({app_id, name, window_title}: Template) {
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
        { 
          templateList.map((item): JSX.Element => {
            return (
              <li className='AppList-Item AppList-Card'>
                <AppCard {...item}/>
              </li>
            );
          })
        }
        </ul>
    </>
  );
}

export default SupportedIntegrations;
