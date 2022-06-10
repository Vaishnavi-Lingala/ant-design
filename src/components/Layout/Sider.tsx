import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { HddOutlined, UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined,
	AreaChartOutlined, SolutionOutlined, LockOutlined
} from '@ant-design/icons';

import {
	ActivityLogs, activityLogs, Dashboard, dashboard, Directory, Groups, groups,
	Machines, machines, Devices, devices, Mechanisms, mechanisms, MenuItemPaths,
	Policies, policies, productNames, settings, Settings, TecBIO, TecTANGO, Users, users
} from "../../constants";
import { Store } from "../../Store";

// Sidebar items
const directoryItems = [
    {
        label: Dashboard,
        key: dashboard,
        icon: <AreaChartOutlined />
    },
    {
        label: Users,
        key: users,
        icon: <UserOutlined />
    },
    {
        label: Groups,
        key: groups,
        icon: <TeamOutlined />
    },
    {
        label: Machines,
        key: machines,
        icon: <DesktopOutlined />
    },
	{
		label: Devices,
		key: devices,
		icon: <HddOutlined />
	}
];

const commonProductItems = [
    {
        label: Mechanisms,
        key: mechanisms,
        icon: <LockOutlined />
    },
    {
        label: Policies,
        key: policies,
        icon: <SolutionOutlined />
    },
    {
        label: ActivityLogs,
        key: activityLogs,
        icon: <PieChartOutlined />
    }
];

const settingsItems = [
    {
        label: Settings,
        key: settings,
        icon: <SettingOutlined />
    }
];

function AppSider() {
	const history = useHistory();
	const [selectedMenuOption] = useContext(Store);

	function openScreen(screen: string) {
		if (screen !== selectedMenuOption) {
			history.push('/' + screen);
		}
		else {
			history.push(MenuItemPaths[screen]);
		}
	}

	function renderItems() {
		const productItemsWithHeader = [
			{
				label: <div className="sidebar-header-content">
					<img height={32} width={32} src={"credenti-favicon.png"} />
					{productNames[selectedMenuOption]}
				</div>,
				key: selectedMenuOption
			},
			...commonProductItems
		];

		switch (selectedMenuOption) {
			case Directory:
				return directoryItems;
			case Settings:
				return settingsItems;
			case TecTANGO:
				return productItemsWithHeader;
			case TecBIO:
				return productItemsWithHeader;
			default:
				return [];
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
				items={renderItems()}
			/>
		</Sider>
	);
}

export default AppSider;
