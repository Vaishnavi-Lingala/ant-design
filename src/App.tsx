import { Route, useHistory, Switch } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import { ConfigProvider } from "antd";

import "antd/dist/antd.variable.min.css";
import "./App.css";

import ActivityLogs from "./components/ActivityLogs/ActivityLogs";
import Dashboard from "./components/Dashboard/Dashboard";
import Groups from "./components/Groups/Groups";
import Layout from "./components/Layout/Layout";
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
import { useEffect } from "react";

const oktaAuth = new OktaAuth(config.oidc);

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

    return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
            <StoreProvider>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/login/callback" component={LoginCallback} />
                <Layout>
                    <SecureRoute path={`/product/:productId/policies`} component={Policies} />
                    <SecureRoute path={`/product/:productId/activitylogs`} component={ActivityLogs} />
                    <SecureRoute path={`/dashboard`} component={Dashboard} />
                    <SecureRoute path={`/product/:productId/mechanism`} exact component={Mechanisms} />
                    <SecureRoute path={`/product/:productId/mechanism/:id`} component={Mechanism} />
                    <SecureRoute path={`/account`} component={Settings} />
                    <SecureRoute path={`/domains`} component={Domains} />
                    <SecureRoute path={`/groups`} component={Groups} />
                    <SecureRoute path={`/users`} component={Users} />
                    <SecureRoute path={`/machines`} exact component={Machines} />
                    <SecureRoute path={`/machines/:id`} component={MachineDetails} />
                    <SecureRoute path={`/devices`} exact component={Devices} />
                    <SecureRoute path={`/devices/:id`} exact component={Device} />
                    <SecureRoute path={`/user/:id/profile`} exact component={User} />
                    <SecureRoute path={`/user/:id/groups`} exact component={User} />
                    <SecureRoute path={`/user/:id/enrollments`} exact component={User} />
                </Layout>

                <Route component={PageNotFound} />
            </Switch>
            </StoreProvider>
        </Security>
    );
}

export default App;
