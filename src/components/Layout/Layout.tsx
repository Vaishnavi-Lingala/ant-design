import { Layout as AntLayout } from 'antd';

import './Layout.css';

import AppHeader from "./Header";
import AppSider from "./Sider";

const { Content } = AntLayout;

function Layout(props: any) {
	return (
		<AntLayout>
			<AppHeader />

			<AntLayout className="app-sider">
				<AppSider />

				<AntLayout className="content-layout">
					<Content className="content">
						{props.children}
					</Content>
				</AntLayout>

			</AntLayout>
		</AntLayout>
	);
}

export default Layout;
