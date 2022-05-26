import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useHistory } from "react-router-dom";
import { AppstoreOutlined, UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined, 
	AreaChartOutlined, SolutionOutlined, LockOutlined } from '@ant-design/icons';

function AppSider() {
	const history = useHistory();
	
	function openScreen(screen: string) {
    history.push('/' + screen);
  }

	return (
		<Sider width='250'
			id="sider">
			<Menu
				mode="inline"
				onSelect={(e: any) => openScreen(e.key)}
				selectedKeys={[window.location.pathname.split("/")[1]]}
				className="sider-menu"
			>
				<Menu.Item key="dashboard"><AreaChartOutlined /> Dashboard</Menu.Item>
				<Menu.Item key="mechanism"><LockOutlined /> Mechanisms</Menu.Item>
				<Menu.Item key="policies"><SolutionOutlined /> Policies</Menu.Item>
				{/* <Menu.Item key="config">Configuration</Menu.Item> */}
				<Menu.Item key="users"><UserOutlined /> Users</Menu.Item>
				<Menu.Item key="machines"><DesktopOutlined /> Machines</Menu.Item>
				<Menu.Item key="groups"><TeamOutlined /> Groups</Menu.Item>
				<Menu.Item key="activityLogs"><PieChartOutlined /> Activity Logs</Menu.Item>
				<Menu.Item key="settings"><SettingOutlined /> Settings</Menu.Item>
        {
        (localStorage.getItem('productName') === 'TecUnify') && 
          <Menu.Item key='apps'><AppstoreOutlined/> Applications</Menu.Item> 
        }
			</Menu>
		</Sider>
	);
}

export default AppSider;
