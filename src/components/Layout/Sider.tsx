import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useHistory } from "react-router-dom";

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
				<Menu.Item key="dashboard">Dashboard</Menu.Item>
				<Menu.Item key="mechanism">Mechanisms</Menu.Item>
				<Menu.Item key="policies" >Policies</Menu.Item>
				{/* <Menu.Item key="config">Configuration</Menu.Item> */}
				<Menu.Item key="users">Users</Menu.Item>
				<Menu.Item key="machines">Machines</Menu.Item>
				<Menu.Item key="groups">Groups</Menu.Item>
				<Menu.Item key="activityLogs" >Activity Logs</Menu.Item>
				<Menu.Item key="settings" >Settings</Menu.Item>
			</Menu>
		</Sider>
	);
}

export default AppSider;
