import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

// @ts-ignore
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
        localStorage.removeItem("policyUid");
        localStorage.removeItem("mechanismUid");
        localStorage.removeItem("productId");
        localStorage.removeItem("productName");
        localStorage.removeItem("accountId");
        history.push("/");
    }

    if (oktaStorage !== null && oktaStorage !== "") {
        if (oktaStorage !== "{}" && oktaStorage.length === 3386) {            
            const idToken = JSON.parse(oktaStorage).idToken;
            localStorage.setItem("clientId", idToken.clientId);
            localStorage.setItem("issuer", idToken.issuer);
        } else {
            removeItems();
        }
    } else {
        removeItems();
    }

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                oktaStorage !== null ? (
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
