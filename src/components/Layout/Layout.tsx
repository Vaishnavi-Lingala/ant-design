import { Layout as AntLayout } from 'antd';
import AppHeader from "./Header";
import AppSider from "./Sider";

import './Layout.css';

const { Content } = AntLayout;

import Toast from "./Toast/Toast";

function Layout(props: any) {

	return (
		<AntLayout>
			<AppHeader />

			<AntLayout className="app-sider">
				<AppSider />

				<AntLayout className="content-layout">
					<Content className="content">
						{props.children}

						<Toast />
					</Content>
				</AntLayout>

			</AntLayout>
		</AntLayout>
	);
}

export default Layout;
