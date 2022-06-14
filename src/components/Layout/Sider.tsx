import { useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { ScanOutlined , UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined,
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
		icon: <ScanOutlined />
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
	const [selectedHeaderOption] = useContext(Store);
	const selectedProductId = localStorage.getItem("productId");

	function openScreen(screen: string) {
		switch (selectedHeaderOption) {
			case Directory:
				history.push(`/${screen}`);
				break;
			case Settings:
				history.push(`/${screen}`);
				break;
			default:
				if (screen === TecTANGO || screen === TecBIO) {
					history.push(`/product/${selectedProductId}${MenuItemPaths[screen]}`);
				}
				else {
					history.push(`/product/${selectedProductId}/${screen}`);
				}
		}
	}

	function renderItems() {
		const productItemsWithHeader = [
			{
				label: <div className="sidebar-header-content">
					<img height={28} width={28} src={"../../credenti-favicon.png"} />
					{productNames[selectedHeaderOption]}
				</div>,
				key: selectedHeaderOption
			},
			...commonProductItems
		];

		switch (selectedHeaderOption) {
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

	const sidebarItems = useMemo(() => renderItems(), [selectedHeaderOption]);

	return (
		<Sider width='250'
			id="sider">
			<Menu
				mode="inline"
				onSelect={(e: any) => {openScreen(e.key)}}
				selectedKeys={[window.location.pathname.split("/")[window.location.pathname.split("/")[1] === 'product' ? 3 : 1]]}
				className="sider-menu"
				items={sidebarItems}
			/>
		</Sider>
	);
}

export default AppSider;
