import {  useOktaAuth} from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";
import { useEffect } from "react";

export default function ProtectedRoute({
    component: Component,
    ...restOfProps
}) {
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();
    // console.log(oktaAuth);
    // console.log(oktaAuth.authStateManager._authState?.isAuthenticated); //false
    // console.log('OktaAuth IsAuthenticated: ',oktaAuth.isAuthenticated()); //undefined
    // console.log('OktaAuth AccessToken: ', oktaAuth.getAccessToken()); //undefined
    // console.log('Authstate IsAuthenticated: ', authState?.isAuthenticated);
    // console.log('Authstate AccessToken: ', authState?.accessToken);
    const oktaStorage = localStorage.getItem("okta-token-storage");

    useEffect(() => {
        console.log('AuthState: ', authState);
    }, [authState, oktaAuth])

    function removeItems() {
        localStorage.removeItem("domain");
        localStorage.removeItem("clientId");
        localStorage.removeItem("issuer");
        localStorage.removeItem("accountId");
        localStorage.removeItem("productId");
        localStorage.removeItem("productName");
        localStorage.removeItem("SELECTED_HEADER");
        history.push("/");
    }

    if (oktaStorage !== null && oktaStorage !== "") {
        if (oktaStorage !== "{}") {
            if (JSON.parse(oktaStorage).idToken && JSON.parse(oktaStorage).accessToken) {
                const idToken = JSON.parse(oktaStorage).idToken;
                localStorage.setItem("clientId", idToken.clientId);
                localStorage.setItem("issuer", idToken.issuer);
            }
            else {
                removeItems();
            }
        }
        else {
            removeItems();
        }
    }
    else {
        removeItems();
    }

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                // authState.isAuthenticated !== false && authState?.accessToken?.accessToken !== undefined
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


// console.log(oktaAuth); //null
    // // console.log(oktaAuth.closeSession()); //null
    // console.log(oktaAuth.authStateManager._authState?.isAuthenticated); //false
    // console.log(oktaAuth.getIdToken()); //undefined
    // console.log('IsAuthenticated: ', isAuthenticated);
    // console.log('Access token: ', authState?.accessToken?.accessToken); //undefined
    // const oktaStorage = localStorage.getItem("okta-token-storage");

    // function removeItems() {
    //     localStorage.removeItem("domain");
    //     localStorage.removeItem("clientId");
    //     localStorage.removeItem("issuer");
    //     localStorage.removeItem("accountId");
    //     localStorage.removeItem("productId");
    //     localStorage.removeItem("productName");
    //     localStorage.removeItem("SELECTED_HEADER");
    // }

    // function autoLogout() {
    //     const basename = window.location.origin + history.createHref({ pathname: '/' });
    //     config.oidc.clientId = String(localStorage.getItem("clientId"));
    //     config.oidc.issuer = String(localStorage.getItem("issuer"));
    //     const oktaAuth = new OktaAuth(config.oidc);
    //     // oktaAuth.closeSession();
    //     oktaAuth.signOut({
    //         postLogoutRedirectUri: basename
    //     }).then(data => {
    //         removeItems();
    //     }).catch((err) => {
    //         console.error(err)
    //     })
    // }

    // //@ts-ignore
    // if (authState.isAuthenticated !== false && authState?.accessToken?.accessToken !== undefined) {
    //     //@ts-ignore
    //     localStorage.setItem("clientId", oktaAuth.authStateManager._authState?.accessToken?.claims.cid);
    //     //@ts-ignore
    //     localStorage.setItem("issuer", oktaAuth.authStateManager._authState?.accessToken?.claims.iss);
    // }
    // else {
    //     autoLogout();
    // }