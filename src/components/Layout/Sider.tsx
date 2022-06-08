import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useHistory } from "react-router-dom";
import {
	UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined,
	AreaChartOutlined, SolutionOutlined, LockOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { useContext } from "react";
import { Store } from "../../Store";
import { Directory, Settings, TecBIO, TecTANGO, TecUnify} from "../../constants";

function AppSider() {
	const history = useHistory();
	const [selectedMenuOption] = useContext(Store);

	function openScreen(screen: string) {
		history.push('/' + screen);
	}

	function renderOptions() {
		const commonProductoptions = <>
			<Menu.Item key="mechanism"><LockOutlined /> Mechanisms</Menu.Item>
			<Menu.Item key="policies"><SolutionOutlined /> Policies</Menu.Item>
			<Menu.Item key="activityLogs"><PieChartOutlined /> Activity Logs</Menu.Item>
		</>;

		console.log({ selectedMenuOption });

		switch (selectedMenuOption) {
			case Directory:
				return <>
					<Menu.Item key="dashboard"><AreaChartOutlined /> Dashboard</Menu.Item>
					<Menu.Item key="users"><UserOutlined /> Users</Menu.Item>
					<Menu.Item key="machines"><DesktopOutlined /> Machines</Menu.Item>
					<Menu.Item key="groups"><TeamOutlined /> Groups</Menu.Item>
				</>
			case Settings:
				return <Menu.Item key="settings"><SettingOutlined /> Settings</Menu.Item>
			case TecTANGO:
				return commonProductoptions;
			case TecBIO:
				return commonProductoptions;
      case TecUnify:
        return <Menu.Item key="apps"><AppstoreOutlined/> Applications</Menu.Item>;
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
