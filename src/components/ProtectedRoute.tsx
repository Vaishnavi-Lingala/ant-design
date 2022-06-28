import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

export default function ProtectedRoute({
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

    if (oktaStorage !== null && oktaStorage !== "" && oktaStorage !== "{}" &&
        JSON.parse(oktaStorage).idToken && JSON.parse(oktaStorage).accessToken) {
            console.log(oktaStorage);
    }
    else {
        removeItems();
    }

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                !authState ? <Redirect to={location.pathname} /> : authState && authState.isAuthenticated ?
                    (
                        <SecureRoute>
                            <Component
                                authStatus={authState}
                                oktaAuth={oktaAuth}
                                {...props}
                            />
                        </SecureRoute>
                    ) : (
                        <Redirect to={"/"} />
                    )
            }
        />
    );
}
