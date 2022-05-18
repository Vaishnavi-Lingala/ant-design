import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useHistory } from "react-router-dom";
import { UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined, 
	AreaChartOutlined, SolutionOutlined, DatabaseOutlined } from '@ant-design/icons';

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
				<Menu.Item key="dashboard"><AreaChartOutlined style={{ position: 'relative', bottom: '3px' }}/> Dashboard</Menu.Item>
				<Menu.Item key="mechanism"><DatabaseOutlined style={{ position: 'relative', bottom: '3px' }}/> Mechanisms</Menu.Item>
				<Menu.Item key="policies"><SolutionOutlined style={{ position: 'relative', bottom: '3px' }}/> Policies</Menu.Item>
				{/* <Menu.Item key="config">Configuration</Menu.Item> */}
				<Menu.Item key="users"><UserOutlined style={{ position: 'relative', bottom: '3px' }}/> Users</Menu.Item>
				<Menu.Item key="machines"><DesktopOutlined style={{ position: 'relative', bottom: '3px' }}/> Machines</Menu.Item>
				<Menu.Item key="groups"><TeamOutlined style={{ position: 'relative', bottom: '3px' }}/> Groups</Menu.Item>
				<Menu.Item key="activityLogs"><PieChartOutlined style={{ position: 'relative', bottom: '3px' }}/> Activity Logs</Menu.Item>
				<Menu.Item key="settings"><SettingOutlined style={{ position: 'relative', bottom: '3px' }}/> Settings</Menu.Item>
			</Menu>
		</Sider>
	);
}

export default AppSider;
