import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import { ConfigProvider } from 'antd';

import 'antd/dist/antd.variable.min.css';
import './App.css';

import config from './config';
import Login from './components/Login';
import Policies from './components/Policies/Policies';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings/Settings';
import PageNotFound from './components/PageNotFound';
import ActivityLogs from './components/ActivityLogs';
import Dashboard from './components/Dashboard/Dashboard';
import Mechanisms from './components/Mechanism/Mechanisms';
import Groups from './components/Groups/groups';
import Users from './components/Users/Users';

const oktaAuth = new OktaAuth(config.oidc);

function App() {
	const history = useHistory();

	ConfigProvider.config({
        theme: {
            // primaryColor: 'green'
        },
    });

	const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
		history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
	};

	return (
		<Security
			oktaAuth={oktaAuth}
			restoreOriginalUri={restoreOriginalUri}
		>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/login/callback" component={LoginCallback} />
	
				<ProtectedRoute path="/policies" component={Policies} />
				<ProtectedRoute path="/activitylogs" component={ActivityLogs} />
				<ProtectedRoute path="/dashboard" component={Dashboard} />
				<ProtectedRoute path="/mechanism" component={Mechanisms} />
				<ProtectedRoute path="/settings" component={Settings} />
				<ProtectedRoute path="/groups" component={Groups} />
				<ProtectedRoute path="/users" component={Users}/>

				<Route component={PageNotFound} />
			</Switch>
		</Security>
	);
}

export default App;
