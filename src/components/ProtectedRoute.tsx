import { useOktaAuth } from "@okta/okta-react";
import { Redirect, Route } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

export default function ProtectedRoute({
    component: Component,
    ...restOfProps
}) {
    const { authState, oktaAuth } = useOktaAuth();

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                !authState ? null : authState && authState.isAuthenticated ?
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
