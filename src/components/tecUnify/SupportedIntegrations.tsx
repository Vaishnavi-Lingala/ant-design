import { Card, Input } from 'antd';
import type { mockType } from './mockApiCall';

const { Search } = Input;

interface SProps {
  data: mockType[];
}

function SupportedIntegrations({data}: SProps): JSX.Element {

  function handleClick(e) {
  }

  return (
    <>
      <div className='flex-container'>
        <div className='sidebar-container'>
          <Search style={{width: '200px'}}/>
          <div className='filters-container'>
            filters
          </div>
        </div>

        <div className='flex-container flex-wrap'>
        { 
          data.map((item): JSX.Element => (
            <Card key={item.app_id} title={item.app_name} className='flex-adjust card-unify' onClick={handleClick}>
              <div className='flex-container flex-between'>
                <div className='info-container'>
                  <p>App Id: {item.app_id}</p>
                  <p>Window Title: {item.window_title}</p>
                </div>
                <img className='img-hide' alt='app logo' src='https://placeholder.pics/svg/100' />
              </div>
            </Card>
          ))
        }
        </div>
      </div>
    </>
  );
}

export default SupportedIntegrations;
