import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import {
	ScanOutlined, UserOutlined, DesktopOutlined, TeamOutlined, SettingOutlined, PieChartOutlined,
	AreaChartOutlined, SolutionOutlined, LockOutlined, GlobalOutlined, AppstoreOutlined
} from '@ant-design/icons';

import {
	ActivityLogs, activityLogs, Dashboard, dashboard, Directory, Groups, groups,
	Machines, machines, Devices, devices, Mechanisms, mechanisms, MenuItemPaths,
	Policies, policies, productNames, account, Settings, TecBIO, TecTANGO, Users,
	users, TecTango, TecUNIFY, TecBio, Account, Domain, domain, Applications, applications, globalPolicies, GlobalPolicies
} from "../../constants";

import { Store } from "../../Store";
import ApiService from "../../Api.service";
import ApiUrls from "../../ApiUtils";


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
		label: Account,
		key: account,
		icon: <SettingOutlined />
	},
	{
		label: Domain,
		key: domain,
		icon: <GlobalOutlined />
	},
	{
		label: GlobalPolicies,
		key: globalPolicies,
		icon: <SolutionOutlined />
	}
];

const tecUnifyItems = [
	{
		label: Applications,
		key: applications,
		icon: <AppstoreOutlined />
	},
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

function AppSider() {
	const history = useHistory();
	const [selectedHeaderOption] = useContext(Store);
	const selectedProductId = localStorage.getItem("productId");
	
	useEffect(() => {
		ApiService.get(ApiUrls.info(localStorage.getItem('accountId')))
		.then(data => {
			console.log(data);
			if(data.enable_vdi === false && data.enable_local_provisioning === false){
				sessionStorage.setItem("ShowGlobal", "false");
			}
			else{
				sessionStorage.clear();
			}
		})
	}, [])

	function openScreen(screen: string) {
		switch (selectedHeaderOption) {
			case Directory:
				history.push(`/${screen}`);
				break;
			case Settings:
				{
					history.push(`/${screen}`);
				}
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
					{productNames[selectedHeaderOption] === TecTango ?
						<img height={28} width={28} src={window.location.origin + "/TecTango.png"} /> :
						productNames[selectedHeaderOption] === TecBio ?
							<img height={28} width={28} src={window.location.origin + "/TecBioIcon.png"} /> : <></>}
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
				return sessionStorage.getItem("ShowGlobal") === "false" ? settingsItems.slice(0, settingsItems.length - 1) : settingsItems;
			case TecTANGO:
				return productItemsWithHeader;
			case TecBIO:
				return productItemsWithHeader;
			case TecUNIFY:
				return tecUnifyItems;
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
				onSelect={(e: any) => { openScreen(e.key) }}
				selectedKeys={[window.location.pathname.split("/")[window.location.pathname.split("/")[1] === 'product' ? 3 : 1]]}
				className="sider-menu"
				items={sidebarItems as any}
			/>
		</Sider>
	);
}

export default AppSider;
