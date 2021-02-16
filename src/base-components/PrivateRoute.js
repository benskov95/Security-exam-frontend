import { Redirect, useLocation, Route } from "react-router-dom";

export default function PrivateRoute({component: Component, isLoggedIn, ...rest}) {
    const {pathname} = useLocation();
    return (
        <Route>
            {isLoggedIn ? (<Component {...rest}/>) 
            : (<Redirect to={{pathname: "/login", state: {from: pathname}}} />
            )}
        </Route>
    )
}