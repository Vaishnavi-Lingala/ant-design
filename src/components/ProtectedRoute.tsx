import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

export default function ProtectedRoute({
    component: Component,
    ...restOfProps
}) {
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();
    console.log(oktaAuth);
    console.log(oktaAuth.authStateManager._authState?.isAuthenticated); //false
    console.log(oktaAuth.getIdToken()); //undefined
    console.log(oktaAuth.getAccessToken()); //undefined
    const oktaStorage = localStorage.getItem("okta-token-storage");

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


// const { authState, oktaAuth } = useOktaAuth();
//     const history = useHistory();
//     console.log(oktaAuth);
//     console.log(oktaAuth.authStateManager._authState?.isAuthenticated); //false
//     console.log(oktaAuth.getIdToken()); //undefined
//     console.log(oktaAuth.getAccessToken()); //undefined
//     // const oktaStorage = localStorage.getItem("okta-token-storage");

//     function removeItems() {
//         localStorage.removeItem("domain");
//         localStorage.removeItem("clientId");
//         localStorage.removeItem("issuer");
//         localStorage.removeItem("accountId");
//         localStorage.removeItem("productId");
//         localStorage.removeItem("productName");
//         localStorage.removeItem("SELECTED_HEADER");
//         history.push("/");
//     }

//     //@ts-ignore    
//     if (oktaAuth.authStateManager._authState !== null || oktaAuth.authStateManager._authState?.isAuthenticated !== false || oktaAuth.getIdToken() !== undefined
//         || oktaAuth.getAccessToken() !== undefined) {
//         localStorage.setItem("clientId", oktaAuth.authStateManager._authState?.accessToken?.claims.cid);
//         //@ts-ignore
//         localStorage.setItem("issuer", oktaAuth.authStateManager._authState?.accessToken?.claims.iss);
//     }
//     else {
//         oktaAuth.signOut({
//             postLogoutRedirectUri: window.location.origin + history.createHref({ pathname: '/' })
//         });
//         removeItems();
//     }

//     return (
//         <Route
//             {...restOfProps}
//             render={(props) =>
//                 //@ts-ignore
//                 oktaAuth.authStateManager._authState !== null || oktaAuth.authStateManager._authState?.isAuthenticated !== false || oktaAuth.getIdToken() !== undefined
//                     || oktaAuth.getAccessToken() !== undefined ? (
//                     <SecureRoute>
//                         <Component
//                             authStatus={authState}
//                             oktaAuth={oktaAuth}
//                             {...props}
//                         />
//                     </SecureRoute>
//                 ) : (
//                     <Redirect to={"/"} />
//                 )
//             }
//         />
//     );