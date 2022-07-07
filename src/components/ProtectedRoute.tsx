import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";
import Layout from "./Layout/Layout";

export default function ProtectedRoute({
    subRoute = false,
    component: Component,
    ...restOfProps
}) {
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();

    const oktaStorage = localStorage.getItem("okta-token-storage");

    function removeItems() {
        localStorage.removeItem("domain");
        localStorage.removeItem("clientId");
        localStorage.removeItem("issuer");
        localStorage.removeItem("accountId");
        localStorage.removeItem("productId");
        localStorage.removeItem("productName");
        localStorage.removeItem("SELECTED_HEADER");
        history.push('/');
    }

    if (oktaStorage === null || oktaStorage === "" || oktaStorage === "{}") {
        removeItems();
    }
    else {
        if (JSON.parse(oktaStorage).idToken === undefined || JSON.parse(oktaStorage).accessToken === undefined) {
            removeItems();
        }
    }

    const SecureComponent = (props) => <SecureRoute>
        <Component
            authStatus={authState}
            oktaAuth={oktaAuth}
            {...props}
        />
    </SecureRoute>;

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                !authState ? <Redirect to={location.pathname} /> : authState && authState.isAuthenticated ?
                    (
                        subRoute ?
                            <SecureComponent {...props} /> : <Layout>
                                <SecureComponent {...props} />
                            </Layout>
                    ) : (
                        <Redirect to={"/"} />
                    )
            }
        />
    );
}
