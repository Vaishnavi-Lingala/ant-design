import { Card, Input } from 'antd';
import type { mockType } from './mockApiCall';

const { Search } = Input;

interface SProps {
  data: mockType[];
}

function SupportedIntegrations({data}: SProps): JSX.Element {

  function handleClick(e) {
  }

  function AppCard({app_id, app_name, window_title}: mockType) {
    return (
      <>
        <h4 className='AppList-CardHeader'>
          {app_name}
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
          data.map((item): JSX.Element => {
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
