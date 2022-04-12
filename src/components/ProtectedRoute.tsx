import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

import Layout from "./Layout/Layout";

// @ts-ignore
export default function ProtectedRoute({ component: Component, ...restOfProps }) {
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();
    const oktaStorage = localStorage.getItem("okta-token-storage");
    
    if(oktaStorage !== null) {
        if(oktaStorage !== "{}"){
            const idToken = JSON.parse(oktaStorage).idToken;
            localStorage.setItem("clientId", idToken.clientId);
            localStorage.setItem("issuer", idToken.issuer);
        }
        else{
            localStorage.removeItem("domain");
            localStorage.removeItem("clientId");
            localStorage.removeItem("issuer");
            history.push("/");
        }
    }
    
    return (
        <Route
            {...restOfProps}
            render={
                (props) => oktaStorage !== null ?
                    <SecureRoute>
                            <Layout>
                                <Component authStatus={authState} oktaAuth={oktaAuth} {...props} />
                            </Layout>
                    </SecureRoute> : <Redirect to={"/"} />
            }
        />
    )
}
