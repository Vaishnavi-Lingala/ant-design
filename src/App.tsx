import { Route, useHistory, Switch } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback } from "@okta/okta-react";
import { ConfigProvider } from "antd";

import "antd/dist/antd.variable.min.css";
import "./App.css";

import config from "./config";
import Login from "./components/Login";
import Policies from "./components/Policies/Policies";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings/Settings";
import PageNotFound from "./components/PageNotFound";
import ActivityLogs from "./components/ActivityLogs/ActivityLogs";
import Dashboard from "./components/Dashboard/Dashboard";
import Mechanisms from "./components/Mechanism/Mechanisms";
import Groups from "./components/Groups/Groups";
import Users from "./components/Users/Users";
import Layout from "./components/Layout/Layout";

import Toast from "./components/Layout/Toast/Toast";
import checkIcon from './assets/check.svg'
import errorIcon from './assets/error.svg'
import infoIcon from './assets/info.svg'
import warningIcon from './assets/warning.svg'

const oktaAuth = new OktaAuth(config.oidc);

function App() {
	const history = useHistory();
	const testList = [
		{
			id: 1,
			title: 'Success',
			description: 'This is a success toast component',
			backgroundColor: '#5cb85c',
			icon: checkIcon
		},
		{
			id: 2,
			title: 'Warning',
			description: 'This is a warning toast component',
			backgroundColor: '#f0ad4e',
			icon: warningIcon
		},
		{
			id: 3,
			title: 'Danger',
			description: 'This is an error toast component',
			backgroundColor: '#d9534f',
			icon: errorIcon
		},
		{
			id: 4,
			title: 'Info',
			description: 'This is an info toast component',
			backgroundColor: '#5bc0de',
			icon: infoIcon
		},
	];

	ConfigProvider.config({
		theme: {
			// primaryColor: 'green'
		},
	});

	const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
		history.replace(
			toRelativeUrl(originalUri || "/", window.location.origin)
		);
	};

	return (
		<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/login/callback" component={LoginCallback} />

				<Layout>
					<ProtectedRoute path={`/policies`} component={Policies} />
					<ProtectedRoute path={`/activitylogs`} component={ActivityLogs} />
					<ProtectedRoute path={`/dashboard`} component={Dashboard} />
					<ProtectedRoute path={`/mechanism`} component={Mechanisms} />
					<ProtectedRoute path={`/settings`} component={Settings} />
					<ProtectedRoute path={`/groups`} component={Groups} />
					<ProtectedRoute path={`/users`} component={Users} />

					<Toast
						toastList={testList}
						position="top-right"
					/>
				</Layout>
				<Route component={PageNotFound} />
			</Switch>
		</Security>
	);
}

export default App;
