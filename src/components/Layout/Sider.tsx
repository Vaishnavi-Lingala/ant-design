import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useHistory } from "react-router-dom";
import {
	UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined,
	AreaChartOutlined, SolutionOutlined, LockOutlined
} from '@ant-design/icons';
import { useContext } from "react";
import { Store } from "../../Store";
import { Directory, MenuItemPaths, Settings, TecBIO, TecTANGO } from "../../constants";

function AppSider() {
	const history = useHistory();
	const [selectedMenuOption] = useContext(Store);

	function openScreen(screen: string) {
		if (screen !== "product") {
			history.push('/' + screen);
		}
		else {
			history.push(MenuItemPaths[selectedMenuOption]);
		}
	}

	function renderOptions() {
		const commonProductoptions = <>
			<Menu.Item key="product" className="sidebar-header">
				<div className="sidebar-header-content">
					<img height={32} width={32} src={require("../../assets/credenti-favicon.png")} />
					{selectedMenuOption.slice(0, 1).toUpperCase() + selectedMenuOption.slice(1, 3).toLowerCase() + selectedMenuOption.slice(3, 4).toUpperCase() + selectedMenuOption.slice(4).toLowerCase()}
				</div>
			</Menu.Item>
			<Menu.Item key="mechanism"><LockOutlined /> Mechanisms</Menu.Item>
			<Menu.Item key="policies"><SolutionOutlined /> Policies</Menu.Item>
			<Menu.Item key="activityLogs"><PieChartOutlined /> Activity Logs</Menu.Item>
		</>;

		switch (selectedMenuOption) {
			case Directory:
				return <>
					<Menu.Item key="dashboard"><AreaChartOutlined /> Dashboard</Menu.Item>
					<Menu.Item key="users"><UserOutlined /> Users</Menu.Item>
					<Menu.Item key="groups"><TeamOutlined /> Groups</Menu.Item>
					<Menu.Item key="machines"><DesktopOutlined /> Machines</Menu.Item>
				</>
			case Settings:
				return <Menu.Item key="settings"><SettingOutlined /> Settings</Menu.Item>
			case TecTANGO:
				return commonProductoptions;
			case TecBIO:
				return commonProductoptions;
			default:
				return null;
		}
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
				{
					renderOptions()
				}
			</Menu>
		</Sider>
	);
}

export default AppSider;
