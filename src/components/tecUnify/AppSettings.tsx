import {  useHistory } from 'react-router-dom';
import { Button, Tabs } from 'antd';

import { mockType } from './mockApiCall';

const { TabPane } = Tabs;

function AppSettings(props: any): JSX.Element {
  const history = useHistory();
  const {
    app_name,
    logo,
    active 
  }: mockType = props.location.state;

  function GeneralSetttings() {

  }

  function SignOnSettings() {

  }

  function Assignments() {

  }

  return (
    <>
      <div className='content-header'>
        <img src={logo}/>
        <div className='activity-container'>
          <span>{app_name}</span>
          <Button type='primary' size='small'> {active ? 'Active' : 'Disabled'} </Button>
        </div>
        <Button onClick={() => history.goBack()}>Return</Button>
      </div>

      <Tabs defaultActiveKey='general' tabBarStyle={{marginBottom: '0px', backgroundColor: '#f5f5f6', border: '1px solid #d7d7dc', borderBottom: '0px', padding: '2px'}}>
        <TabPane key='general' tab='General' className='border-left border-right border-bottom'>
        </TabPane>
        <TabPane key='sign-on' tab='Sign on' className='border-left border-right border-bottom'>
        </TabPane>
        <TabPane key='assigned' tab='Assigned to' className='border-left border-right border-bottom'>
        </TabPane>
      </Tabs>
    </>
  );
}

export default AppSettings;
