import { Redirect, Route, useHistory, Switch } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import { ConfigProvider } from "antd";

import "antd/dist/antd.variable.min.css";
import "./App.css";

import ActivityLogs from "./components/ActivityLogs/ActivityLogs";
import Dashboard from "./components/Dashboard/Dashboard";
import Groups from "./components/Groups/Groups";
import Login from "./components/Login";
import Machines from "./components/Machines/Machines";
import { MachineDetails } from "./components/Machines/MachineDetails";
import Mechanisms from "./components/Mechanism/Mechanisms";
import Mechanism from "./components/Mechanism/mechanism";
import PageNotFound from "./components/PageNotFound";
import Policies from "./components/Policies/Policies";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings/Settings";
import Users from "./components/Users/Users";
import config from "./config";
import StoreProvider from "./Store";
import Devices from "./components/Devices/Devices";
import Device from "./components/Devices/Device";
import { User } from "./components/Users/User";
import Domains from "./components/Domains/Domains";

import Applications from "./components/tecUnify/Applications";
import AppSettings from "./components/tecUnify/AppSettings";
import GlobalPolicies from "./components/GlobalPolicies/GlobalPolicies";

const oktaAuth = new OktaAuth(config.oidc);

oktaAuth.tokenManager.getTokens().then(({ accessToken, idToken }) => {
    // handle accessToken and idToken
    console.log('Access token: ', accessToken);
    console.log('ID token: ', idToken);
    accessToken? console.log('Access token expired: ', oktaAuth.tokenManager.hasExpired(accessToken)): console.log('Access token not available')
    idToken? console.log('ID token expired: ', oktaAuth.tokenManager.hasExpired(idToken)): console.log('ID token not available')
  });

oktaAuth.tokenManager.on('expired', function (key, expiredToken) {
    console.log('Token with key', key, ' has expired:');
    console.log(expiredToken);
    <Redirect to={"/"} />
});


function App() {
    const history = useHistory();

    ConfigProvider.config({
        theme: {
            // primaryColor: 'yellow'
        },
    });

    const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
        history.replace(
            toRelativeUrl(originalUri || "/", window.location.origin)
        );
    };

    const customAuthHandler = async () => {
        console.log('CustomAuthHandler called');
        <Redirect to={"/"} />
      };

    return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
            <StoreProvider>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/login/callback" component={LoginCallback} />

                    <ProtectedRoute path={`/product/:productId/policies`} component={Policies} />
                    <ProtectedRoute path={`/global-policies`} component={GlobalPolicies} />
                    <ProtectedRoute path={`/product/:productId/activitylogs`} component={ActivityLogs} />
                    <ProtectedRoute path={`/dashboard`} component={Dashboard} />
                    <ProtectedRoute path={`/product/:productId/mechanism`} exact component={Mechanisms} />
                    <ProtectedRoute path={`/product/:productId/mechanism/:id`} component={Mechanism} />
                    <ProtectedRoute path={`/account`} component={Settings} />
                    <ProtectedRoute path={`/domains`} component={Domains} />
                    <ProtectedRoute path={`/groups`} component={Groups} />
                    <ProtectedRoute path={`/users`} component={Users} />
                    <ProtectedRoute path={`/product/:productId/apps`} exact component={Applications} />
                    <ProtectedRoute path={`/product/:productId/apps/:app_id/:app_name`} component={AppSettings} />
                    <ProtectedRoute path={`/machines`} exact component={Machines} />
                    <ProtectedRoute path={`/machines/:id`} component={MachineDetails} />
                    <ProtectedRoute path={`/devices`} exact component={Devices} />
                    <ProtectedRoute path={`/devices/:id`} exact component={Device} />
                    <ProtectedRoute path={`/user/:id/profile`} exact component={User} />
                    <ProtectedRoute path={`/user/:id/groups`} exact component={User} />
                    <ProtectedRoute path={`/user/:id/enrollments`} exact component={User} />

                    <Route component={PageNotFound} />
            </Switch>
            </StoreProvider>
        </Security>
    );
}

export default App;
